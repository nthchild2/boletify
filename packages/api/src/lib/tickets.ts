/**
 * Ticket delivery (B8, B9, C1, AUTH-002): buyer-facing order views, the
 * order confirmation email, and one-time "magic link" access for guests.
 *
 * Buyers are identified by email: a signed-in user sees every paid order made
 * with their account's email, and a guest proves they own an email by opening
 * a one-time link. Tokens live in the existing verification_tokens table
 * (identifier "tickets:<email>", token = SHA-256 of the secret in the link).
 */

import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { createElement } from 'react';
import { render } from '@react-email/components';
import { and, asc, count, eq, gt, inArray, lt } from 'drizzle-orm';
import { db, events, orders, ticketTiers, tickets, verificationTokens } from '@boletify/db';
import { appUrl, ticketQrImageUrl } from './app-url';
import { orderAccessKey } from './codes';
import { isEmailConfigured, sendEmail } from './email/send';
import { OrderConfirmationEmail } from '../emails/order-confirmation';
import { TicketAccessEmail } from '../emails/ticket-access';

export const ACCESS_LINK_MINUTES = 30;
const MAX_ACTIVE_ACCESS_LINKS = 3;
/** An event counts as past this long after it starts. */
const PAST_AFTER_HOURS = 12;

export function formatMxn(cents: number): string {
  const pesos = cents / 100;
  return `$${pesos.toLocaleString('es-MX', {
    minimumFractionDigits: pesos % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })} MXN`;
}

export function formatEventDate(date: Date): string {
  return date
    .toLocaleString('es-MX', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Mexico_City',
    })
    .toUpperCase();
}

export function isPastEvent(startDate: Date, now = new Date()): boolean {
  return startDate.getTime() + PAST_AFTER_HOURS * 3_600_000 < now.getTime();
}

// ---------------------------------------------------------------------------
// Order views
// ---------------------------------------------------------------------------

export type TicketView = {
  ticketNumber: string;
  tierName: string;
  status: string;
  qrCode: string;
  qrImageUrl: string;
};

export type OrderView = {
  orderNumber: string;
  status: string;
  buyerName: string | null;
  buyerEmail: string;
  subtotal: number;
  serviceFee: number;
  total: number;
  createdAt: Date;
  event: {
    id: number;
    title: string;
    venueName: string;
    city: string;
    startDate: Date;
    coverImageUrl: string | null;
  };
  tickets: TicketView[];
};

const orderColumns = {
  id: orders.id,
  orderNumber: orders.orderNumber,
  status: orders.status,
  buyerName: orders.buyerName,
  buyerEmail: orders.buyerEmail,
  subtotal: orders.subtotal,
  serviceFee: orders.serviceFee,
  total: orders.total,
  createdAt: orders.createdAt,
  eventId: events.id,
  eventTitle: events.title,
  venueName: events.venueName,
  city: events.city,
  startDate: events.startDate,
  coverImageUrl: events.coverImageUrl,
};

type OrderRow = {
  id: number;
  orderNumber: string;
  status: string;
  buyerName: string | null;
  buyerEmail: string;
  subtotal: number;
  serviceFee: number;
  total: number;
  createdAt: Date;
  eventId: number;
  eventTitle: string;
  venueName: string;
  city: string;
  startDate: Date;
  coverImageUrl: string | null;
};

async function withTickets(rows: OrderRow[]): Promise<OrderView[]> {
  if (rows.length === 0) return [];
  const ticketRows = await db
    .select({
      orderId: tickets.orderId,
      ticketNumber: tickets.ticketNumber,
      status: tickets.status,
      qrCode: tickets.qrCode,
      tierName: ticketTiers.name,
    })
    .from(tickets)
    .innerJoin(ticketTiers, eq(ticketTiers.id, tickets.ticketTierId))
    .where(inArray(tickets.orderId, rows.map((r) => r.id)))
    .orderBy(asc(tickets.id));

  return rows.map((row) => ({
    orderNumber: row.orderNumber,
    status: row.status,
    buyerName: row.buyerName,
    buyerEmail: row.buyerEmail,
    subtotal: row.subtotal,
    serviceFee: row.serviceFee,
    total: row.total,
    createdAt: row.createdAt,
    event: {
      id: row.eventId,
      title: row.eventTitle,
      venueName: row.venueName,
      city: row.city,
      startDate: row.startDate,
      coverImageUrl: row.coverImageUrl,
    },
    tickets: ticketRows
      .filter((t) => t.orderId === row.id)
      .map((t) => ({
        ticketNumber: t.ticketNumber,
        tierName: t.tierName,
        status: t.status,
        qrCode: t.qrCode,
        qrImageUrl: ticketQrImageUrl(t.qrCode),
      })),
  }));
}

/** Paid orders bought with this email, soonest event first. */
export async function listOrdersForEmail(email: string): Promise<OrderView[]> {
  const rows = await db
    .select(orderColumns)
    .from(orders)
    .innerJoin(events, eq(events.id, orders.eventId))
    .where(and(eq(orders.buyerEmail, email.trim().toLowerCase()), eq(orders.status, 'paid')))
    .orderBy(asc(events.startDate), asc(orders.createdAt));
  return withTickets(rows);
}

/** A paid order by number. Callers must check the viewer may see it. */
export async function getPaidOrder(orderNumber: string): Promise<OrderView | null> {
  const rows = await db
    .select(orderColumns)
    .from(orders)
    .innerJoin(events, eq(events.id, orders.eventId))
    .where(and(eq(orders.orderNumber, orderNumber), eq(orders.status, 'paid')))
    .limit(1);
  const [view] = await withTickets(rows);
  return view ?? null;
}

/** Link from the confirmation email straight to the order's tickets. */
export function orderTicketsUrl(orderNumber: string): string {
  return `${appUrl()}/tickets/${orderNumber}?k=${orderAccessKey(orderNumber)}`;
}

// ---------------------------------------------------------------------------
// Order confirmation email (C1)
// ---------------------------------------------------------------------------

export async function renderOrderConfirmation(order: OrderView) {
  const lines = new Map<string, number>();
  for (const t of order.tickets) lines.set(t.tierName, (lines.get(t.tierName) ?? 0) + 1);

  const element = createElement(OrderConfirmationEmail, {
    appUrl: appUrl(),
    orderNumber: order.orderNumber,
    buyerName: order.buyerName,
    event: {
      title: order.event.title,
      dateLabel: formatEventDate(order.event.startDate),
      venueName: order.event.venueName,
      city: order.event.city,
    },
    lines: Array.from(lines.entries()).map(([tierName, quantity]) => ({ tierName, quantity })),
    totalLabel: formatMxn(order.total),
    tickets: order.tickets.map((t) => ({
      ticketNumber: t.ticketNumber,
      tierName: t.tierName,
      qrImageUrl: t.qrImageUrl,
    })),
    viewTicketsUrl: orderTicketsUrl(order.orderNumber),
  });

  return {
    subject: `Tus boletos para ${order.event.title}`,
    html: await render(element),
    text: await render(element, { plainText: true }),
  };
}

/** Send the confirmation email for a paid order. Never throws. */
export async function sendOrderConfirmation(orderNumber: string): Promise<void> {
  try {
    const order = await getPaidOrder(orderNumber);
    if (!order) return;
    const email = await renderOrderConfirmation(order);
    await sendEmail({
      to: order.buyerEmail,
      ...email,
      idempotencyKey: `order-confirmation/${order.orderNumber}`,
    });
  } catch (err) {
    console.error('[tickets] order confirmation email failed', orderNumber, err);
  }
}

// ---------------------------------------------------------------------------
// Magic link access for guests (AUTH-002)
// ---------------------------------------------------------------------------

const hashToken = (raw: string) => createHash('sha256').update(raw).digest('hex');
const identifierFor = (email: string) => `tickets:${email}`;

export type AccessRequestResult = {
  /** Only set outside production when email isn't configured, to test locally. */
  devAccessUrl?: string;
};

/**
 * Email a one-time link to someone who bought tickets with this address.
 * Always looks the same to the caller, so it can't be used to check which
 * emails have orders.
 */
export async function requestTicketAccess(rawEmail: string): Promise<AccessRequestResult> {
  const email = rawEmail.trim().toLowerCase();
  const identifier = identifierFor(email);
  const now = new Date();

  const [{ paid }] = await db
    .select({ paid: count() })
    .from(orders)
    .where(and(eq(orders.buyerEmail, email), eq(orders.status, 'paid')));
  if (paid === 0) return {};

  await db
    .delete(verificationTokens)
    .where(and(eq(verificationTokens.identifier, identifier), lt(verificationTokens.expires, now)));

  const [{ active }] = await db
    .select({ active: count() })
    .from(verificationTokens)
    .where(and(eq(verificationTokens.identifier, identifier), gt(verificationTokens.expires, now)));
  if (active >= MAX_ACTIVE_ACCESS_LINKS) return {}; // don't let someone flood an inbox

  const raw = randomBytes(32).toString('base64url');
  await db.insert(verificationTokens).values({
    id: randomUUID(),
    identifier,
    token: hashToken(raw),
    expires: new Date(now.getTime() + ACCESS_LINK_MINUTES * 60_000),
  });

  const accessUrl = `${appUrl()}/tickets/acceso?token=${raw}`;
  const element = createElement(TicketAccessEmail, {
    appUrl: appUrl(),
    accessUrl,
    expiresInMinutes: ACCESS_LINK_MINUTES,
  });
  await sendEmail({
    to: email,
    subject: 'Tu enlace para ver tus boletos',
    html: await render(element),
    text: await render(element, { plainText: true }),
  });

  if (!isEmailConfigured() && process.env.NODE_ENV !== 'production') {
    return { devAccessUrl: accessUrl };
  }
  return {};
}

/** Redeem a magic link. Returns the email it was issued for, or null. One use only. */
export async function consumeTicketAccessToken(raw: string): Promise<string | null> {
  if (!raw || raw.length > 200) return null;
  const [row] = await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.token, hashToken(raw)))
    .returning({ identifier: verificationTokens.identifier, expires: verificationTokens.expires });
  if (!row || !row.identifier.startsWith('tickets:') || row.expires < new Date()) return null;
  return row.identifier.slice('tickets:'.length);
}
