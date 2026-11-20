/**
 * Organiser sales figures (ORG-002). Every query is scoped to one organiser.
 *
 * Definitions (paid orders only; expired, failed and refunded orders don't count):
 * - sold:     tickets in paid orders that are valid or already used at the door
 * - gross:    what buyers paid (orders.total: tickets - discount + service fee)
 * - net:      what the organiser earns (orders.subtotal - orders.discount_amount).
 *             Buyers pay the Boletify service fee on top, and the card processing
 *             fee comes out of that service fee, so it isn't deducted here.
 */

import { and, asc, count, desc, eq, inArray, ne, sql } from 'drizzle-orm';
import { db, events, orders, ticketTiers, tickets } from '@boletify/db';

const MX_TZ = 'America/Mexico_City';
const SOLD_STATUSES = ['valid', 'used'];

export type EventSalesSummary = {
  id: number;
  title: string;
  status: string;
  startDate: Date;
  venueName: string;
  sold: number;
  capacity: number;
  gross: number;
  net: number;
  checkedIn: number;
};

export type SalesTotals = { activeEvents: number; sold: number; gross: number; net: number };

/** One row per (non-deleted) event of the organiser, newest event first. */
export async function listEventSales(organiserId: number): Promise<EventSalesSummary[]> {
  const eventRows = await db
    .select({
      id: events.id,
      title: events.title,
      status: events.status,
      startDate: events.startDate,
      venueName: events.venueName,
    })
    .from(events)
    .where(and(eq(events.organiserId, organiserId), ne(events.status, 'deleted')))
    .orderBy(desc(events.startDate));
  if (eventRows.length === 0) return [];
  const ids = eventRows.map((e) => e.id);

  const capacity = await db
    .select({ eventId: ticketTiers.eventId, n: sql<number>`coalesce(sum(${ticketTiers.quantity}), 0)`.mapWith(Number) })
    .from(ticketTiers)
    .where(inArray(ticketTiers.eventId, ids))
    .groupBy(ticketTiers.eventId);

  const money = await db
    .select({
      eventId: orders.eventId,
      gross: sql<number>`coalesce(sum(${orders.total}), 0)`.mapWith(Number),
      net: sql<number>`coalesce(sum(${orders.subtotal} - coalesce(${orders.discountAmount}, 0)), 0)`.mapWith(Number),
    })
    .from(orders)
    .where(and(inArray(orders.eventId, ids), eq(orders.status, 'paid')))
    .groupBy(orders.eventId);

  const ticketCounts = await db
    .select({
      eventId: orders.eventId,
      sold: count(),
      checkedIn: sql<number>`count(*) filter (where ${tickets.status} = 'used')`.mapWith(Number),
    })
    .from(tickets)
    .innerJoin(orders, eq(orders.id, tickets.orderId))
    .where(and(inArray(orders.eventId, ids), eq(orders.status, 'paid'), inArray(tickets.status, SOLD_STATUSES)))
    .groupBy(orders.eventId);

  return eventRows.map((e) => {
    const m = money.find((r) => r.eventId === e.id);
    const t = ticketCounts.find((r) => r.eventId === e.id);
    return {
      ...e,
      sold: t?.sold ?? 0,
      checkedIn: t?.checkedIn ?? 0,
      capacity: capacity.find((r) => r.eventId === e.id)?.n ?? 0,
      gross: m?.gross ?? 0,
      net: m?.net ?? 0,
    };
  });
}

export function totalsOf(rows: EventSalesSummary[], now = new Date()): SalesTotals {
  return {
    activeEvents: rows.filter((r) => r.status === 'published' && r.startDate > now).length,
    sold: rows.reduce((s, r) => s + r.sold, 0),
    gross: rows.reduce((s, r) => s + r.gross, 0),
    net: rows.reduce((s, r) => s + r.net, 0),
  };
}

export type EventSalesDetail = {
  summary: EventSalesSummary;
  /** Paid tickets per day (Mexico City), oldest first, only days with sales. */
  daily: Array<{ day: string; tickets: number; net: number }>;
  tiers: Array<{ id: number; name: string; price: number; quantity: number; sold: number }>;
  paymentMethods: Array<{ method: string; orders: number }>;
  orders: number;
};

export async function getEventSales(organiserId: number, eventId: number): Promise<EventSalesDetail | null> {
  const summary = (await listEventSales(organiserId)).find((e) => e.id === eventId);
  if (!summary) return null;

  const dayExpr = sql<string>`to_char((${orders.createdAt} at time zone 'UTC') at time zone ${sql.raw(`'${MX_TZ}'`)}, 'YYYY-MM-DD')`; // inlined constant so SELECT and GROUP BY match
  const perOrderTickets = db
    .select({ orderId: tickets.orderId, n: count().as('n') })
    .from(tickets)
    .where(inArray(tickets.status, SOLD_STATUSES))
    .groupBy(tickets.orderId)
    .as('per_order');

  const daily = await db
    .select({
      day: dayExpr,
      tickets: sql<number>`coalesce(sum(${perOrderTickets.n}), 0)`.mapWith(Number),
      net: sql<number>`coalesce(sum(${orders.subtotal} - coalesce(${orders.discountAmount}, 0)), 0)`.mapWith(Number),
    })
    .from(orders)
    .leftJoin(perOrderTickets, eq(perOrderTickets.orderId, orders.id))
    .where(and(eq(orders.eventId, eventId), eq(orders.status, 'paid')))
    .groupBy(dayExpr)
    .orderBy(asc(dayExpr));

  const tierRows = await db
    .select({ id: ticketTiers.id, name: ticketTiers.name, price: ticketTiers.price, quantity: ticketTiers.quantity })
    .from(ticketTiers)
    .where(eq(ticketTiers.eventId, eventId))
    .orderBy(asc(ticketTiers.price));
  const tierSold = await db
    .select({ tierId: tickets.ticketTierId, sold: count() })
    .from(tickets)
    .innerJoin(orders, eq(orders.id, tickets.orderId))
    .where(and(eq(orders.eventId, eventId), eq(orders.status, 'paid'), inArray(tickets.status, SOLD_STATUSES)))
    .groupBy(tickets.ticketTierId);

  const methods = await db
    .select({ method: sql<string>`coalesce(${orders.paymentMethod}, 'card')`, orders: count() })
    .from(orders)
    .where(and(eq(orders.eventId, eventId), eq(orders.status, 'paid')))
    .groupBy(sql`coalesce(${orders.paymentMethod}, 'card')`);

  return {
    summary,
    daily,
    tiers: tierRows.map((t) => ({ ...t, sold: tierSold.find((s) => s.tierId === t.id)?.sold ?? 0 })),
    paymentMethods: methods.sort((a, b) => b.orders - a.orders),
    orders: methods.reduce((s, m) => s + m.orders, 0),
  };
}

export type BuyerRow = {
  attendeeName: string | null;
  buyerEmail: string;
  tierName: string;
  ticketNumber: string;
  orderNumber: string;
  purchasedAt: Date;
  paymentMethod: string | null;
  checkedIn: boolean;
  checkedInAt: Date | null;
  eventId: number;
  eventTitle: string;
};

/**
 * One row per sold ticket of the organiser's events (newest purchase first).
 * Pass eventId for one event; omit it for all events (CSV export).
 */
export async function listBuyers(
  organiserId: number,
  opts: { eventId?: number; limit?: number; offset?: number } = {},
): Promise<{ rows: BuyerRow[]; total: number }> {
  const where = and(
    eq(events.organiserId, organiserId),
    ne(events.status, 'deleted'),
    eq(orders.status, 'paid'),
    inArray(tickets.status, SOLD_STATUSES),
    opts.eventId ? eq(orders.eventId, opts.eventId) : undefined,
  );

  const [{ total }] = await db
    .select({ total: count() })
    .from(tickets)
    .innerJoin(orders, eq(orders.id, tickets.orderId))
    .innerJoin(events, eq(events.id, orders.eventId))
    .where(where);

  const query = db
    .select({
      attendeeName: sql<string | null>`coalesce(${tickets.attendeeName}, ${orders.buyerName})`,
      buyerEmail: orders.buyerEmail,
      tierName: ticketTiers.name,
      ticketNumber: tickets.ticketNumber,
      orderNumber: orders.orderNumber,
      purchasedAt: orders.createdAt,
      paymentMethod: orders.paymentMethod,
      checkedIn: sql<boolean>`${tickets.status} = 'used'`,
      checkedInAt: tickets.checkedInAt,
      eventId: events.id,
      eventTitle: events.title,
    })
    .from(tickets)
    .innerJoin(orders, eq(orders.id, tickets.orderId))
    .innerJoin(events, eq(events.id, orders.eventId))
    .innerJoin(ticketTiers, eq(ticketTiers.id, tickets.ticketTierId))
    .where(where)
    .orderBy(desc(orders.createdAt), asc(tickets.id));

  const rows = opts.limit !== undefined ? await query.limit(opts.limit).offset(opts.offset ?? 0) : await query;
  return { rows, total };
}
