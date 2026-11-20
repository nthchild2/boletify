/**
 * Door check-in (O10 / ORG-004).
 *
 * Staff scan a ticket's QR payload ("<ticketNumber>.<signature>") or pick a
 * ticket by hand. A ticket is admitted at most once: the status flip is a
 * single conditional UPDATE (... WHERE status = 'valid'), so two doors
 * scanning the same code at the same moment can't both get "valid".
 *
 * Callers must first check that the signed-in organiser owns the event
 * (getOwnedEvent); every function here is scoped to that event.
 */

import { and, asc, count, eq, ilike, inArray, or } from 'drizzle-orm';
import { db, events, orders, organiserProfiles, ticketTiers, tickets, users } from '@boletify/db';
import { verifyTicketQr } from './codes';

export type CheckInReason =
  | 'valid' // admitted now
  | 'already_used' // checked in before (checkedInAt says when)
  | 'wrong_event' // genuine Boletify ticket for a different event
  | 'not_paid' // order still waiting for payment
  | 'refunded'
  | 'cancelled'
  | 'invalid'; // forged, malformed or unknown code

export type CheckInStats = { checkedIn: number; total: number };

export type CheckInResult = {
  reason: CheckInReason;
  ticket?: {
    ticketNumber: string;
    attendeeName: string | null;
    tierName: string;
    orderNumber: string;
    /** 1-based position in its order, for "Boleto 1 de 2". */
    position: number;
    ofTickets: number;
    checkedInAt: Date | null;
    checkedInBy: string | null;
  };
  stats: CheckInStats;
};

export type OwnedEvent = { id: number; title: string; venueName: string; startDate: Date };

/** The event, if the user has an organiser profile that owns it. */
export async function getOwnedEvent(userId: number, eventId: number): Promise<OwnedEvent | null> {
  const [row] = await db
    .select({ id: events.id, title: events.title, venueName: events.venueName, startDate: events.startDate })
    .from(events)
    .innerJoin(organiserProfiles, eq(organiserProfiles.id, events.organiserId))
    .where(and(eq(events.id, eventId), eq(organiserProfiles.userId, userId)))
    .limit(1);
  return row ?? null;
}

/** Name recorded in tickets.checked_in_by. */
export async function staffLabel(userId: number): Promise<string> {
  const [user] = await db
    .select({ name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return user?.name?.trim() || user?.email || `user:${userId}`;
}

/** Checked in vs. admissible (valid + used) tickets for the event. */
export async function getCheckInStats(eventId: number): Promise<CheckInStats> {
  const rows = await db
    .select({ status: tickets.status, n: count() })
    .from(tickets)
    .innerJoin(ticketTiers, eq(ticketTiers.id, tickets.ticketTierId))
    .innerJoin(orders, eq(orders.id, tickets.orderId))
    .where(
      and(
        eq(ticketTiers.eventId, eventId),
        eq(orders.status, 'paid'),
        inArray(tickets.status, ['valid', 'used']),
      ),
    )
    .groupBy(tickets.status);
  const checkedIn = rows.find((r) => r.status === 'used')?.n ?? 0;
  const total = rows.reduce((sum, r) => sum + r.n, 0);
  return { checkedIn, total };
}

type TicketRow = {
  id: number;
  orderId: number;
  ticketNumber: string;
  status: string;
  attendeeName: string | null;
  checkedInAt: Date | null;
  checkedInBy: string | null;
  tierName: string;
  eventId: number;
  orderNumber: string;
  orderStatus: string;
};

const ticketColumns = {
  id: tickets.id,
  orderId: tickets.orderId,
  ticketNumber: tickets.ticketNumber,
  status: tickets.status,
  attendeeName: tickets.attendeeName,
  checkedInAt: tickets.checkedInAt,
  checkedInBy: tickets.checkedInBy,
  tierName: ticketTiers.name,
  eventId: ticketTiers.eventId,
  orderNumber: orders.orderNumber,
  orderStatus: orders.status,
};

async function findTicket(ticketNumber: string): Promise<TicketRow | null> {
  const [row] = await db
    .select(ticketColumns)
    .from(tickets)
    .innerJoin(ticketTiers, eq(ticketTiers.id, tickets.ticketTierId))
    .innerJoin(orders, eq(orders.id, tickets.orderId))
    .where(eq(tickets.ticketNumber, ticketNumber))
    .limit(1);
  return row ?? null;
}

async function describe(row: TicketRow): Promise<NonNullable<CheckInResult['ticket']>> {
  const siblings = await db
    .select({ id: tickets.id })
    .from(tickets)
    .where(and(eq(tickets.orderId, row.orderId), inArray(tickets.status, ['valid', 'used', 'refunded'])))
    .orderBy(asc(tickets.id));
  const index = siblings.findIndex((s) => s.id === row.id);
  return {
    ticketNumber: row.ticketNumber,
    attendeeName: row.attendeeName,
    tierName: row.tierName,
    orderNumber: row.orderNumber,
    position: index >= 0 ? index + 1 : 1,
    ofTickets: Math.max(siblings.length, 1),
    checkedInAt: row.checkedInAt,
    checkedInBy: row.checkedInBy,
  };
}

/** Why a ticket that isn't 'valid' can't get in. */
function blockedReason(row: TicketRow): CheckInReason {
  if (row.status === 'used') return 'already_used';
  if (row.status === 'refunded' || row.orderStatus === 'refunded') return 'refunded';
  if (row.status === 'pending' || row.orderStatus === 'pending') return 'not_paid';
  return 'cancelled';
}

async function admit(eventId: number, row: TicketRow, by: string): Promise<CheckInResult> {
  if (row.eventId !== eventId) {
    // Don't reveal anything about other events' tickets.
    return { reason: 'wrong_event', stats: await getCheckInStats(eventId) };
  }

  if (row.status === 'valid' && row.orderStatus === 'paid') {
    const now = new Date();
    const updated = await db
      .update(tickets)
      .set({ status: 'used', checkedInAt: now, checkedInBy: by })
      .where(and(eq(tickets.id, row.id), eq(tickets.status, 'valid')))
      .returning({ id: tickets.id });
    if (updated.length === 1) {
      const ticket = await describe({ ...row, status: 'used', checkedInAt: now, checkedInBy: by });
      return { reason: 'valid', ticket, stats: await getCheckInStats(eventId) };
    }
    // Someone else admitted it between our read and our update.
    const fresh = await findTicket(row.ticketNumber);
    if (fresh) row = fresh;
  }

  return {
    reason: blockedReason(row),
    ticket: await describe(row),
    stats: await getCheckInStats(eventId),
  };
}

/** Check in from a scanned or pasted QR payload. */
export async function checkInByCode(eventId: number, rawCode: string, by: string): Promise<CheckInResult> {
  const code = rawCode.trim();
  const ticketNumber = code.length <= 200 ? verifyTicketQr(code) : null;
  const row = ticketNumber ? await findTicket(ticketNumber) : null;
  if (!row) return { reason: 'invalid', stats: await getCheckInStats(eventId) };
  return admit(eventId, row, by);
}

/** Manual check-in of a ticket found through search. */
export async function checkInByTicketNumber(
  eventId: number,
  ticketNumber: string,
  by: string,
): Promise<CheckInResult> {
  const row = await findTicket(ticketNumber.trim().toUpperCase());
  if (!row || row.eventId !== eventId) return { reason: 'invalid', stats: await getCheckInStats(eventId) };
  return admit(eventId, row, `${by} (manual)`);
}

export type SearchHit = {
  ticketNumber: string;
  attendeeName: string | null;
  attendeeEmail: string | null;
  tierName: string;
  orderNumber: string;
  status: 'valid' | 'used' | 'refunded' | 'not_paid';
  checkedInAt: Date | null;
};

/** Find the event's tickets by attendee name, email, order number or ticket number. */
export async function searchEventTickets(eventId: number, rawQuery: string): Promise<SearchHit[]> {
  const query = rawQuery.trim();
  if (query.length < 2) return [];
  const pattern = `%${query.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;

  const rows = await db
    .select({
      ticketNumber: tickets.ticketNumber,
      attendeeName: tickets.attendeeName,
      attendeeEmail: tickets.attendeeEmail,
      status: tickets.status,
      checkedInAt: tickets.checkedInAt,
      tierName: ticketTiers.name,
      orderNumber: orders.orderNumber,
      orderStatus: orders.status,
    })
    .from(tickets)
    .innerJoin(ticketTiers, eq(ticketTiers.id, tickets.ticketTierId))
    .innerJoin(orders, eq(orders.id, tickets.orderId))
    .where(
      and(
        eq(ticketTiers.eventId, eventId),
        inArray(tickets.status, ['valid', 'used', 'refunded', 'pending']),
        or(
          ilike(tickets.attendeeName, pattern),
          ilike(tickets.attendeeEmail, pattern),
          ilike(orders.orderNumber, pattern),
          ilike(tickets.ticketNumber, pattern),
          ilike(orders.buyerName, pattern),
          ilike(orders.buyerEmail, pattern),
        ),
      ),
    )
    .orderBy(asc(tickets.attendeeName), asc(tickets.id))
    .limit(25);

  return rows.map((r) => ({
    ticketNumber: r.ticketNumber,
    attendeeName: r.attendeeName,
    attendeeEmail: r.attendeeEmail,
    tierName: r.tierName,
    orderNumber: r.orderNumber,
    status:
      r.status === 'used'
        ? 'used'
        : r.status === 'refunded' || r.orderStatus === 'refunded'
          ? 'refunded'
          : r.status === 'pending' || r.orderStatus !== 'paid'
            ? 'not_paid'
            : 'valid',
    checkedInAt: r.checkedInAt,
  }));
}

