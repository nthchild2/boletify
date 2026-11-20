/**
 * Event publish / unpublish / delete (EVT-003), shared by the tRPC router
 * (web dashboard) and the REST routes (native app).
 *
 * Rules:
 * - Publish: only drafts, with at least one ticket type and a future date.
 * - Back to draft (unpublish) and delete: not once anyone has paid, and not
 *   while a checkout is in progress (its 30-minute ticket hold). Cancelling an
 *   event with buyers needs refunds, which are post-MVP.
 * Each change is a single conditional UPDATE that re-checks those orders, so a
 * purchase completing at the same moment can't slip through.
 */

import { and, count, eq, gt, inArray, ne, sql } from 'drizzle-orm';
import { db, events, orders, ticketTiers } from '@boletify/db';
import { getOrganiserEvent } from './organiser';

export class EventLifecycleError extends Error {
  constructor(
    public code: 'NOT_FOUND' | 'CONFLICT' | 'BAD_REQUEST',
    message: string,
  ) {
    super(message);
    this.name = 'EventLifecycleError';
  }
}

export type EventLockState = {
  paidOrders: number;
  pendingOrders: number;
  ticketTypes: number;
  /** Why the event can't go back to draft or be deleted, if it can't. */
  lockedReason: string | null;
  /** Why the event can't be published, if it's a draft that can't. */
  publishBlocker: string | null;
};

const PAID_MESSAGE =
  'Este evento ya tiene boletos vendidos, así que no se puede despublicar ni eliminar. Cancelar eventos con reembolsos llegará pronto; mientras tanto escríbenos a ayuda@boletify.com.';
const PENDING_MESSAGE = 'Hay compras en curso para este evento. Intenta de nuevo en unos minutos.';

/** No paid or in-progress orders for the event (checked inside the UPDATE). */
const noBlockingOrders = (eventId: number) =>
  sql`not exists (select 1 from ${orders} where ${orders.eventId} = ${eventId} and ${orders.status} in ('paid', 'pending'))`;

export async function getEventLockState(eventId: number): Promise<EventLockState> {
  const byStatus = await db
    .select({ status: orders.status, n: count() })
    .from(orders)
    .where(and(eq(orders.eventId, eventId), inArray(orders.status, ['paid', 'pending'])))
    .groupBy(orders.status);
  const paidOrders = byStatus.find((r) => r.status === 'paid')?.n ?? 0;
  const pendingOrders = byStatus.find((r) => r.status === 'pending')?.n ?? 0;

  const [{ n: ticketTypes }] = await db
    .select({ n: count() })
    .from(ticketTiers)
    .where(and(eq(ticketTiers.eventId, eventId), gt(ticketTiers.quantity, 0)));

  const [event] = await db.select({ startDate: events.startDate }).from(events).where(eq(events.id, eventId));

  return {
    paidOrders,
    pendingOrders,
    ticketTypes,
    lockedReason: paidOrders > 0 ? PAID_MESSAGE : pendingOrders > 0 ? PENDING_MESSAGE : null,
    publishBlocker:
      ticketTypes === 0
        ? 'Agrega al menos un tipo de boleto antes de publicar.'
        : event && event.startDate <= new Date()
          ? 'La fecha del evento ya pasó. Cambia la fecha antes de publicar.'
          : null,
  };
}

async function requireEvent(organiserId: number, eventId: number) {
  const event = await getOrganiserEvent(organiserId, eventId);
  if (!event) throw new EventLifecycleError('NOT_FOUND', 'Evento no encontrado');
  return event;
}

export async function publishEvent(organiserId: number, eventId: number) {
  const event = await requireEvent(organiserId, eventId);
  if (event.status !== 'draft') {
    throw new EventLifecycleError('BAD_REQUEST', 'Solo los borradores se pueden publicar.');
  }
  const { publishBlocker } = await getEventLockState(eventId);
  if (publishBlocker) throw new EventLifecycleError('BAD_REQUEST', publishBlocker);

  const [updated] = await db
    .update(events)
    .set({ status: 'published', publishedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(events.id, eventId), eq(events.status, 'draft')))
    .returning();
  if (!updated) throw new EventLifecycleError('CONFLICT', 'El evento cambió mientras tanto. Recarga la página.');
  return updated;
}

/** Published → draft: hides it from buyers again. */
export async function unpublishEvent(organiserId: number, eventId: number) {
  const event = await requireEvent(organiserId, eventId);
  if (event.status !== 'published') {
    throw new EventLifecycleError('BAD_REQUEST', 'Solo los eventos publicados pueden volver a borrador.');
  }
  const [updated] = await db
    .update(events)
    .set({ status: 'draft', publishedAt: null, updatedAt: new Date() })
    .where(and(eq(events.id, eventId), eq(events.status, 'published'), noBlockingOrders(eventId)))
    .returning();
  if (!updated) {
    const { lockedReason } = await getEventLockState(eventId);
    throw new EventLifecycleError('CONFLICT', lockedReason ?? 'El evento cambió mientras tanto. Recarga la página.');
  }
  return updated;
}

/** Soft delete: the event disappears for buyers and from the dashboard. */
export async function deleteEvent(organiserId: number, eventId: number) {
  await requireEvent(organiserId, eventId);
  const [updated] = await db
    .update(events)
    .set({ status: 'deleted', deletedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(events.id, eventId), ne(events.status, 'deleted'), noBlockingOrders(eventId)))
    .returning({ id: events.id });
  if (!updated) {
    const { lockedReason } = await getEventLockState(eventId);
    throw new EventLifecycleError('CONFLICT', lockedReason ?? 'El evento cambió mientras tanto. Recarga la página.');
  }
  return { success: true as const };
}
