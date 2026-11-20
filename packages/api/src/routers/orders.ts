/**
 * Orders router
 *
 * Buyers: start a card checkout, or cancel it to change their cart.
 * Organisers: list orders for their own events.
 *
 * Marking orders as paid only happens server-side, from the Stripe webhook
 * (apps/web/app/api/webhooks/stripe) or after verifying the PaymentIntent
 * with Stripe — never from a client call.
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { and, desc, eq } from 'drizzle-orm';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { db, events, orders, organiserProfiles } from '@boletify/db';
import { CheckoutError, MAX_TICKETS_PER_ORDER, cancelCheckout, createCheckout } from '../lib/checkout';
import { INVALID_CODE_MESSAGE, findUsablePromo } from '../lib/promo-codes';

function toTRPCError(err: unknown): never {
  if (err instanceof CheckoutError) {
    throw new TRPCError({ code: err.code, message: err.message });
  }
  console.error('[orders] checkout failed', err);
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'No pudimos iniciar el pago. Intenta de nuevo en un momento.',
  });
}

export const ordersRouter = createTRPCRouter({
  /**
   * Reserve tickets and create a Stripe PaymentIntent for them.
   * Returns the client secret the browser uses to show Stripe's payment form.
   */
  createCheckout: publicProcedure
    .input(
      z.object({
        eventId: z.number().int().positive(),
        buyerEmail: z.string().trim().email(),
        buyerName: z.string().trim().min(2).max(120),
        items: z
          .array(
            z.object({
              tierId: z.number().int().positive(),
              quantity: z.number().int().min(0).max(MAX_TICKETS_PER_ORDER),
            }),
          )
          .min(1)
          .max(20),
        promoCode: z.string().trim().max(40).nullish(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        return await createCheckout(input);
      } catch (err) {
        toTRPCError(err);
      }
    }),

  /**
   * Check a promo code while the buyer fills in the checkout form. Returns the
   * discount so the form can show the new total; checkout re-validates it.
   */
  previewPromo: publicProcedure
    .input(z.object({ eventId: z.number().int().positive(), code: z.string().trim().min(1).max(40) }))
    .query(async ({ input }) => {
      const promo = await findUsablePromo(input.eventId, input.code);
      if (!promo) throw new TRPCError({ code: 'NOT_FOUND', message: INVALID_CODE_MESSAGE });
      return { code: promo.code, discountType: promo.discountType as 'percentage' | 'flat', discountValue: promo.discountValue };
    }),

  /** Cancel an unpaid checkout so its tickets go back on sale. */
  cancelCheckout: publicProcedure
    .input(z.object({ orderNumber: z.string().min(1), clientSecret: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const cancelled = await cancelCheckout(input.orderNumber, input.clientSecret);
      return { cancelled };
    }),

  /** Orders for the signed-in organiser's events. */
  listByOrganiser: protectedProcedure
    .input(
      z
        .object({
          eventId: z.number().int().positive().optional(),
          status: z.enum(['pending', 'paid', 'failed', 'refunded', 'cancelled', 'expired']).optional(),
          limit: z.number().int().positive().max(100).default(20),
          offset: z.number().int().nonnegative().default(0),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const { eventId, status, limit = 20, offset = 0 } = input ?? {};

      const [profile] = await db
        .select({ id: organiserProfiles.id })
        .from(organiserProfiles)
        .where(eq(organiserProfiles.userId, ctx.userId))
        .limit(1);
      if (!profile) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'No tienes un perfil de organizador' });
      }

      return db
        .select({
          id: orders.id,
          orderNumber: orders.orderNumber,
          eventId: orders.eventId,
          eventTitle: events.title,
          buyerEmail: orders.buyerEmail,
          buyerName: orders.buyerName,
          status: orders.status,
          subtotal: orders.subtotal,
          serviceFee: orders.serviceFee,
          total: orders.total,
          paymentMethod: orders.paymentMethod,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .innerJoin(events, eq(events.id, orders.eventId))
        .where(
          and(
            eq(events.organiserId, profile.id),
            eventId ? eq(orders.eventId, eventId) : undefined,
            status ? eq(orders.status, status) : undefined,
          ),
        )
        .orderBy(desc(orders.createdAt))
        .limit(limit)
        .offset(offset);
    }),
});
