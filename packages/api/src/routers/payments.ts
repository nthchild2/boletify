/**
 * Payments router
 * Handles payment operations (webhooks, status checks)
 * Actual checkout flow in PAY-001
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { desc } from 'drizzle-orm';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { db, payments, orders } from '@boletify/db';
import { eq, and } from 'drizzle-orm';

export const paymentsRouter = createTRPCRouter({
  /**
   * Get payment status for an order
   */
  getByOrderId: publicProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ input }) => {
      const orderPayments = await db
        .select()
        .from(payments)
        .where(eq(payments.orderId, input.orderId))
        .orderBy(desc(payments.createdAt));

      return orderPayments;
    }),

  /**
   * Record a payment (for webhooks - internal)
   */
  create: publicProcedure
    .input(z.object({
      orderId: z.number(),
      provider: z.enum(['stripe', 'oxxo', 'mercadopago']),
      providerPaymentId: z.string(),
      amount: z.number().int().positive(),
      currency: z.string().default('MXN'),
      status: z.enum(['pending', 'succeeded', 'failed', 'refunded']),
      webhookData: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const [payment] = await db
        .insert(payments)
        .values({
          orderId: input.orderId,
          provider: input.provider,
          providerPaymentId: input.providerPaymentId,
          amount: input.amount,
          currency: input.currency,
          status: input.status,
          webhookData: input.webhookData,
          processedAt: input.status === 'succeeded' ? new Date() : undefined,
        })
        .returning();

      // Update order status
      const orderStatusMap: Record<string, typeof orders.$inferSelect.status> = {
        succeeded: 'paid',
        failed: 'failed',
        refunded: 'refunded',
      };

      if (orderStatusMap[input.status]) {
        await db
          .update(orders)
          .set({
            status: orderStatusMap[input.status],
            updatedAt: new Date(),
          })
          .where(eq(orders.id, input.orderId));
      }

      return payment;
    }),

  /**
   * Process Stripe webhook (internal endpoint)
   */
  stripeWebhook: publicProcedure
    .input(z.object({
      eventType: z.string(),
      data: z.any(),
    }))
    .mutation(async ({ input }) => {
      // This would be called from the Stripe webhook handler
      // Actual implementation in PAY-002
      console.log('Stripe webhook received:', input.eventType);
      
      return { received: true };
    }),

  /**
   * Process payment callback (OXXO/MercadoPago)
   */
  handleCallback: publicProcedure
    .input(z.object({
      orderId: z.number(),
      provider: z.enum(['oxxo', 'mercadopago']),
      status: z.enum(['pending', 'succeeded', 'failed']),
      providerReference: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.orderId))
        .limit(1);

      if (!order) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Order not found',
        });
      }

      // Update order status
      const statusMap: Record<string, typeof orders.$inferSelect.status> = {
        succeeded: 'paid',
        failed: 'failed',
        pending: 'pending',
      };

      await db
        .update(orders)
        .set({
          status: statusMap[input.status] || 'pending',
          paymentMethod: input.provider,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, input.orderId));

      // Create payment record
      await db
        .insert(payments)
        .values({
          orderId: input.orderId,
          provider: input.provider === 'oxxo' ? 'oxxo' : 'mercadopago',
          providerPaymentId: input.providerReference || `callback-${Date.now()}`,
          amount: order.total,
          currency: 'MXN',
          status: statusMap[input.status] || 'pending',
          processedAt: input.status === 'succeeded' ? new Date() : undefined,
        });

      return { success: true };
    }),
});