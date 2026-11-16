/**
 * Card checkout (PAY-001).
 *
 * Flow:
 *   1. createCheckout   — validate cart, reserve inventory, create a pending
 *                         order + pending tickets, create a Stripe PaymentIntent.
 *   2. Buyer pays in the browser with Stripe's Payment Element.
 *   3. markOrderPaid    — called by the Stripe webhook (and as a fallback when
 *                         the buyer lands on the confirmation page): order -> paid,
 *                         tickets -> valid, payment row recorded.
 *   4. Unpaid orders hold their tickets for HOLD_MINUTES; releaseStaleHolds
 *      cancels the PaymentIntent and returns the tickets to sale.
 *
 * The Neon HTTP driver has no interactive transactions, so every step is
 * written to be safe to retry: status changes are conditional updates
 * ("... WHERE status = 'pending'") and inventory is reserved with an atomic
 * "sold + n <= quantity" check.
 *
 * Payments are charged on the platform account for now ("separate charges and
 * transfers"); transfer_group = order number so organiser payouts can be
 * attached once Stripe Connect onboarding exists.
 */

import type Stripe from 'stripe';
import { and, eq, lt, sql } from 'drizzle-orm';
import { db, events, orders, payments, ticketTiers, tickets } from '@boletify/db';
import { calculateOrderAmounts, type OrderAmounts } from './fees';
import { generateOrderNumber, generateTicketNumber, signTicketQr } from './codes';
import { getStripe } from './stripe';

/** How long an unpaid card order keeps its tickets reserved. */
export const HOLD_MINUTES = 30;
export const MAX_TICKETS_PER_ORDER = 10;

export class CheckoutError extends Error {
  constructor(
    public code: 'NOT_FOUND' | 'BAD_REQUEST' | 'CONFLICT' | 'PRECONDITION_FAILED',
    message: string,
  ) {
    super(message);
    this.name = 'CheckoutError';
  }
}

type TierRow = typeof ticketTiers.$inferSelect;

function tierOnSale(tier: TierRow, now: Date): boolean {
  if (tier.saleStartDate && tier.saleStartDate > now) return false;
  if (tier.saleEndDate && tier.saleEndDate <= now) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Checkout page data
// ---------------------------------------------------------------------------

export type CheckoutTier = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  available: number;
  maxPerOrder: number;
  onSale: boolean;
};

export type CheckoutEvent = {
  id: number;
  title: string;
  venueName: string;
  city: string;
  startDate: Date;
  coverImageUrl: string | null;
  onSale: boolean;
  tiers: CheckoutTier[];
};

export async function getCheckoutEvent(eventId: number): Promise<CheckoutEvent | null> {
  const [event] = await db
    .select()
    .from(events)
    .where(and(eq(events.id, eventId), eq(events.status, 'published')))
    .limit(1);
  if (!event) return null;

  const now = new Date();
  const eventUpcoming = event.startDate > now;
  const tiers = await db
    .select()
    .from(ticketTiers)
    .where(eq(ticketTiers.eventId, eventId))
    .orderBy(ticketTiers.price);

  const checkoutTiers = tiers.map((tier) => ({
    id: tier.id,
    name: tier.name,
    description: tier.description,
    price: tier.price,
    available: Math.max(tier.quantity - tier.sold, 0),
    maxPerOrder: Math.min(tier.maxPerOrder ?? MAX_TICKETS_PER_ORDER, MAX_TICKETS_PER_ORDER),
    onSale: eventUpcoming && tierOnSale(tier, now),
  }));

  return {
    id: event.id,
    title: event.title,
    venueName: event.venueName,
    city: event.city,
    startDate: event.startDate,
    coverImageUrl: event.coverImageUrl,
    onSale: checkoutTiers.some((t) => t.onSale && t.available > 0),
    tiers: checkoutTiers,
  };
}

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------

/** Atomically reserve tickets; returns false if there aren't enough left. */
async function reserveTier(tierId: number, quantity: number): Promise<boolean> {
  const rows = await db
    .update(ticketTiers)
    .set({ sold: sql`${ticketTiers.sold} + ${quantity}`, updatedAt: new Date() })
    .where(
      and(eq(ticketTiers.id, tierId), sql`${ticketTiers.sold} + ${quantity} <= ${ticketTiers.quantity}`),
    )
    .returning({ id: ticketTiers.id });
  return rows.length === 1;
}

async function releaseTier(tierId: number, quantity: number): Promise<void> {
  await db
    .update(ticketTiers)
    .set({ sold: sql`GREATEST(${ticketTiers.sold} - ${quantity}, 0)`, updatedAt: new Date() })
    .where(eq(ticketTiers.id, tierId));
}

/**
 * Mark a pending order expired and return its tickets to sale.
 * Returns false if the order was no longer pending (already paid/expired).
 */
async function expireOrder(orderId: number): Promise<boolean> {
  const updated = await db
    .update(orders)
    .set({ status: 'expired', updatedAt: new Date() })
    .where(and(eq(orders.id, orderId), eq(orders.status, 'pending')))
    .returning({ id: orders.id });
  if (updated.length === 0) return false;

  const held = await db
    .update(tickets)
    .set({ status: 'cancelled' })
    .where(and(eq(tickets.orderId, orderId), eq(tickets.status, 'pending')))
    .returning({ tierId: tickets.ticketTierId });

  const perTier = new Map<number, number>();
  for (const { tierId } of held) perTier.set(tierId, (perTier.get(tierId) ?? 0) + 1);
  for (const [tierId, count] of Array.from(perTier.entries())) await releaseTier(tierId, count);
  return true;
}

/**
 * Release tickets held by card orders that weren't paid within HOLD_MINUTES.
 * The PaymentIntent is cancelled first, so a buyer can't pay for an order
 * after its tickets went back on sale.
 */
export async function releaseStaleHolds(eventId?: number): Promise<number> {
  const cutoff = new Date(Date.now() - HOLD_MINUTES * 60_000);
  const stale = await db
    .select({ id: orders.id, paymentIntentId: orders.paymentIntentId })
    .from(orders)
    .where(
      and(
        eq(orders.status, 'pending'),
        lt(orders.createdAt, cutoff),
        eventId ? eq(orders.eventId, eventId) : undefined,
      ),
    )
    .limit(50);

  let released = 0;
  for (const order of stale) {
    if (order.paymentIntentId) {
      const stripe = getStripe();
      try {
        await stripe.paymentIntents.cancel(order.paymentIntentId);
      } catch {
        // Cancel fails if the payment already succeeded or is still processing.
        const pi = await stripe.paymentIntents.retrieve(order.paymentIntentId);
        if (pi.status === 'succeeded') await markOrderPaid(pi);
        if (pi.status !== 'canceled') continue;
      }
    }
    if (await expireOrder(order.id)) released++;
  }
  return released;
}

// ---------------------------------------------------------------------------
// Create checkout
// ---------------------------------------------------------------------------

export type CheckoutInput = {
  eventId: number;
  buyerEmail: string;
  buyerName: string;
  items: Array<{ tierId: number; quantity: number }>;
};

export type CheckoutResult = {
  orderNumber: string;
  clientSecret: string;
  amounts: OrderAmounts;
  holdExpiresAt: Date;
};

export async function createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  const stripe = getStripe(); // fail before touching inventory if Stripe isn't configured

  // Merge duplicate tier lines and drop zero quantities.
  const wanted = new Map<number, number>();
  for (const { tierId, quantity } of input.items) {
    if (quantity > 0) wanted.set(tierId, (wanted.get(tierId) ?? 0) + quantity);
  }
  const totalTickets = Array.from(wanted.values()).reduce((a, b) => a + b, 0);
  if (totalTickets === 0) throw new CheckoutError('BAD_REQUEST', 'Elige al menos un boleto.');
  if (totalTickets > MAX_TICKETS_PER_ORDER) {
    throw new CheckoutError('BAD_REQUEST', `Máximo ${MAX_TICKETS_PER_ORDER} boletos por compra.`);
  }

  // Return tickets from abandoned checkouts for this event before checking stock.
  await releaseStaleHolds(input.eventId).catch((err) => {
    console.error('[checkout] releaseStaleHolds failed', err);
  });

  const event = await getCheckoutEvent(input.eventId);
  if (!event) throw new CheckoutError('NOT_FOUND', 'Este evento no está disponible.');

  const lines: Array<{ tier: CheckoutTier; quantity: number }> = [];
  for (const [tierId, quantity] of Array.from(wanted.entries())) {
    const tier = event.tiers.find((t) => t.id === tierId);
    if (!tier) throw new CheckoutError('NOT_FOUND', 'Ese tipo de boleto no existe.');
    if (!tier.onSale) throw new CheckoutError('PRECONDITION_FAILED', `${tier.name} no está a la venta.`);
    if (quantity > tier.maxPerOrder) {
      throw new CheckoutError('BAD_REQUEST', `Máximo ${tier.maxPerOrder} boletos de ${tier.name} por compra.`);
    }
    if (quantity > tier.available) {
      throw new CheckoutError('CONFLICT', `Solo quedan ${tier.available} boletos de ${tier.name}.`);
    }
    lines.push({ tier, quantity });
  }

  const amounts = calculateOrderAmounts(lines.map((l) => ({ price: l.tier.price, quantity: l.quantity })));
  if (amounts.total === 0) {
    throw new CheckoutError('PRECONDITION_FAILED', 'El registro para eventos gratuitos llega pronto.');
  }

  // Prepare ticket rows up front (also checks TICKET_QR_SECRET is set).
  const ticketDrafts = lines.flatMap(({ tier, quantity }) =>
    Array.from({ length: quantity }, () => {
      const ticketNumber = generateTicketNumber();
      return { ticketTierId: tier.id, ticketNumber, qrCode: signTicketQr(ticketNumber) };
    }),
  );

  // Reserve inventory; undo earlier reservations if a later tier sold out meanwhile.
  const reserved: Array<{ tierId: number; quantity: number }> = [];
  for (const { tier, quantity } of lines) {
    if (!(await reserveTier(tier.id, quantity))) {
      for (const r of reserved) await releaseTier(r.tierId, r.quantity);
      throw new CheckoutError('CONFLICT', `Se acaban de agotar los boletos de ${tier.name}.`);
    }
    reserved.push({ tierId: tier.id, quantity });
  }

  let orderId: number | undefined;
  try {
    const orderNumber = generateOrderNumber();
    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        eventId: event.id,
        buyerEmail: input.buyerEmail.trim().toLowerCase(),
        buyerName: input.buyerName.trim(),
        status: 'pending',
        subtotal: amounts.subtotal,
        serviceFee: amounts.serviceFee,
        paymentProcessingFee: 0,
        oxxoFee: 0,
        total: amounts.total,
        paymentMethod: 'card',
      })
      .returning();
    orderId = order.id;

    await db.insert(tickets).values(
      ticketDrafts.map((t) => ({
        ...t,
        orderId: order.id,
        status: 'pending',
        attendeeName: input.buyerName.trim(),
        attendeeEmail: input.buyerEmail.trim().toLowerCase(),
      })),
    );

    const intent = await stripe.paymentIntents.create(
      {
        amount: amounts.total,
        currency: 'mxn',
        allowed_payment_method_types: ['card'], // OXXO is added in PAY-003
        receipt_email: order.buyerEmail,
        description: `${event.title} · ${amounts.ticketCount} boleto(s) · ${orderNumber}`,
        transfer_group: orderNumber,
        metadata: { orderId: String(order.id), orderNumber, eventId: String(event.id) },
      },
      { idempotencyKey: `order-${order.id}-intent` },
    );

    await db
      .update(orders)
      .set({ paymentIntentId: intent.id, updatedAt: new Date() })
      .where(eq(orders.id, order.id));

    if (!intent.client_secret) throw new Error('PaymentIntent has no client_secret');

    return {
      orderNumber,
      clientSecret: intent.client_secret,
      amounts,
      holdExpiresAt: new Date(order.createdAt.getTime() + HOLD_MINUTES * 60_000),
    };
  } catch (err) {
    // Give the tickets back if anything after the reservation failed.
    if (orderId !== undefined) {
      await expireOrder(orderId).catch(() => undefined);
    } else {
      for (const r of reserved) await releaseTier(r.tierId, r.quantity).catch(() => undefined);
    }
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Payment results
// ---------------------------------------------------------------------------

/** Idempotently mark the order behind a succeeded PaymentIntent as paid. */
export async function markOrderPaid(intent: Stripe.PaymentIntent): Promise<void> {
  const orderId = Number(intent.metadata?.orderId);
  if (!orderId) return; // not a Boletify checkout payment

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order || order.paymentIntentId !== intent.id) {
    console.error('[checkout] PaymentIntent does not match an order', intent.id, orderId);
    return;
  }
  if (intent.amount !== order.total || intent.currency !== 'mxn') {
    console.error('[checkout] amount mismatch', intent.id, intent.amount, order.total);
    return;
  }

  const stripe = getStripe();

  if (order.status === 'expired' || order.status === 'cancelled') {
    // Shouldn't happen (holds cancel the PaymentIntent first), but never keep
    // money for tickets that went back on sale.
    await stripe.refunds.create({ payment_intent: intent.id }, { idempotencyKey: `refund-${intent.id}` });
    await recordPayment(order.id, intent, 'refunded');
    return;
  }

  if (order.status === 'pending') {
    await db
      .update(orders)
      .set({ status: 'paid', paymentMethod: 'card', updatedAt: new Date() })
      .where(and(eq(orders.id, order.id), eq(orders.status, 'pending')));
  }

  // Safe to repeat: only flips tickets that are still pending.
  await db
    .update(tickets)
    .set({ status: 'valid' })
    .where(and(eq(tickets.orderId, order.id), eq(tickets.status, 'pending')));

  await recordPayment(order.id, intent, 'succeeded');

  // Store Stripe's actual processing fee (best effort).
  try {
    const full = await stripe.paymentIntents.retrieve(intent.id, {
      expand: ['latest_charge.balance_transaction'],
    });
    const charge = full.latest_charge as Stripe.Charge | null;
    const balance = charge?.balance_transaction as Stripe.BalanceTransaction | null;
    if (balance?.fee != null) {
      await db
        .update(orders)
        .set({ paymentProcessingFee: balance.fee })
        .where(eq(orders.id, order.id));
    }
  } catch (err) {
    console.error('[checkout] could not read processing fee', err);
  }
}

async function recordPayment(
  orderId: number,
  intent: Stripe.PaymentIntent,
  status: 'succeeded' | 'failed' | 'refunded',
): Promise<void> {
  if (status !== 'failed') {
    const existing = await db
      .select({ id: payments.id })
      .from(payments)
      .where(and(eq(payments.providerPaymentId, intent.id), eq(payments.status, status)))
      .limit(1);
    if (existing.length) return;
  }
  await db.insert(payments).values({
    orderId,
    provider: 'stripe',
    providerPaymentId: intent.id,
    amount: intent.amount,
    currency: intent.currency.toUpperCase(),
    status,
    webhookData:
      status === 'failed' ? JSON.stringify({ error: intent.last_payment_error?.message ?? null }) : null,
    processedAt: new Date(),
  });
}

export async function recordPaymentFailed(intent: Stripe.PaymentIntent): Promise<void> {
  const orderId = Number(intent.metadata?.orderId);
  if (!orderId) return;
  await recordPayment(orderId, intent, 'failed');
}

/** Called when Stripe reports the PaymentIntent was cancelled. */
export async function handleIntentCanceled(intent: Stripe.PaymentIntent): Promise<void> {
  const orderId = Number(intent.metadata?.orderId);
  if (orderId) await expireOrder(orderId);
}

// ---------------------------------------------------------------------------
// Buyer access (confirmation page)
// ---------------------------------------------------------------------------

/**
 * Load the order behind a PaymentIntent client secret. The client secret is
 * the buyer's proof of access: Stripe puts it in the return URL, and only the
 * browser that started checkout has it.
 */
async function loadOrderForSecret(orderNumber: string, clientSecret: string) {
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  if (!order?.paymentIntentId) return null;
  if (!clientSecret.startsWith(`${order.paymentIntentId}_secret_`)) return null;

  const intent = await getStripe().paymentIntents.retrieve(order.paymentIntentId);
  if (intent.client_secret !== clientSecret) return null;
  return { order, intent };
}

export type BuyerOrder = {
  orderNumber: string;
  status: string;
  buyerName: string | null;
  buyerEmail: string;
  subtotal: number;
  serviceFee: number;
  total: number;
  createdAt: Date;
  event: { id: number; title: string; venueName: string; city: string; startDate: Date };
  tickets: Array<{ ticketNumber: string; qrCode: string; status: string; tierName: string }>;
};

export async function getOrderForBuyer(orderNumber: string, clientSecret: string): Promise<BuyerOrder | null> {
  const found = await loadOrderForSecret(orderNumber, clientSecret);
  if (!found) return null;
  let { order } = found;

  // The webhook may not have arrived yet (or isn't set up locally): confirm here too.
  if (order.status === 'pending' && found.intent.status === 'succeeded') {
    await markOrderPaid(found.intent);
    [order] = await db.select().from(orders).where(eq(orders.id, order.id)).limit(1);
  }

  const [event] = await db
    .select({
      id: events.id,
      title: events.title,
      venueName: events.venueName,
      city: events.city,
      startDate: events.startDate,
    })
    .from(events)
    .where(eq(events.id, order.eventId))
    .limit(1);

  const orderTickets = await db
    .select({
      ticketNumber: tickets.ticketNumber,
      qrCode: tickets.qrCode,
      status: tickets.status,
      tierName: ticketTiers.name,
    })
    .from(tickets)
    .innerJoin(ticketTiers, eq(ticketTiers.id, tickets.ticketTierId))
    .where(eq(tickets.orderId, order.id))
    .orderBy(tickets.id);

  return {
    orderNumber: order.orderNumber,
    status: order.status,
    buyerName: order.buyerName,
    buyerEmail: order.buyerEmail,
    subtotal: order.subtotal,
    serviceFee: order.serviceFee,
    total: order.total,
    createdAt: order.createdAt,
    event,
    tickets: orderTickets,
  };
}

/** Buyer went back to change their cart: cancel the unpaid order and free its tickets. */
export async function cancelCheckout(orderNumber: string, clientSecret: string): Promise<boolean> {
  const found = await loadOrderForSecret(orderNumber, clientSecret);
  if (!found || found.order.status !== 'pending') return false;
  try {
    await getStripe().paymentIntents.cancel(found.intent.id);
  } catch {
    return false; // already paid or processing — keep the order
  }
  return expireOrder(found.order.id);
}
