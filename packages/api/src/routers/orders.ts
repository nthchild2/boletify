/**
 * Orders router
 * Handles order operations for buyers and organisers
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { db } from '@boletify/db';
import { orders, tickets, events, ticketTiers } from '@boletify/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export const ordersRouter = createTRPCRouter({
  /**
   * Create a new order (buyer - checkout)
   */
  create: publicProcedure
    .input(z.object({
      eventId: z.number(),
      buyerEmail: z.string().email(),
      buyerName: z.string().optional(),
      items: z.array(z.object({
        tierId: z.number(),
        quantity: z.number().int().positive(),
      })),
    }))
    .mutation(async ({ input }) => {
      // Get event and verify it's published
      const [event] = await db
        .select()
        .from(events)
        .where(and(
          eq(events.id, input.eventId),
          eq(events.status, 'published')
        ))
        .limit(1);

      if (!event) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found or not available',
        });
      }

      // Calculate totals and verify availability
      let subtotal = 0;
      const orderItems: Array<{
    tier: typeof ticketTiers.$inferSelect;
    quantity: number;
    lineTotal: number;
  }> = [];

      for (const item of input.items) {
        const [tier] = await db
          .select()
          .from(ticketTiers)
          .where(and(
            eq(ticketTiers.id, item.tierId),
            eq(ticketTiers.eventId, input.eventId)
          ))
          .limit(1);

        if (!tier) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Ticket tier not found`,
          });
        }

        const remaining = tier.quantity - tier.sold;
        if (item.quantity > remaining) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Only ${remaining} tickets available for ${tier.name}`,
          });
        }

        if (tier.maxPerOrder && item.quantity > tier.maxPerOrder) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Maximum ${tier.maxPerOrder} tickets per order for ${tier.name}`,
          });
        }

        const lineTotal = tier.price * item.quantity;
        subtotal += lineTotal;
        orderItems.push({ tier, quantity: item.quantity, lineTotal });
      }

      // Calculate fees (placeholder - actual fee calculation in PAY-001)
      const serviceFee = Math.round(subtotal * 0.05); // 5% Boletify fee
      const total = subtotal + serviceFee;

      // Generate order number
      const orderNumber = await generateOrderNumber();

      // Create order
      const [order] = await db
        .insert(orders)
        .values({
          orderNumber,
          eventId: input.eventId,
          buyerEmail: input.buyerEmail.toLowerCase(),
          buyerName: input.buyerName,
          status: 'pending',
          subtotal,
          serviceFee,
          paymentProcessingFee: 0,
          oxxoFee: 0,
          total,
        })
        .returning();

      // Create tickets (reserved - will be updated on payment)
      for (const item of orderItems) {
        for (let i = 0; i < item.quantity; i++) {
          const ticketNumber = generateTicketNumber(order.id, item.tier.id, i);
          await db
            .insert(tickets)
            .values({
              orderId: order.id,
              ticketTierId: item.tier.id,
              ticketNumber,
              qrCode: generateQRCode(ticketNumber),
              status: 'valid',
            });
        }

        // Update sold count
        await db
          .update(ticketTiers)
          .set({
            sold: item.tier.sold + item.quantity,
          })
          .where(eq(ticketTiers.id, item.tier.id));
      }

      return {
        order,
        total,
        subtotal,
        serviceFee,
      };
    }),

  /**
   * Get order by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .limit(1);

      if (!order) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Order not found',
        });
      }

      // Get tickets
      const orderTickets = await db
        .select()
        .from(tickets)
        .where(eq(tickets.orderId, order.id));

      return { ...order, tickets: orderTickets };
    }),

  /**
   * Get order by order number (for lookup)
   */
  getByOrderNumber: publicProcedure
    .input(z.object({ orderNumber: z.string() }))
    .query(async ({ input }) => {
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.orderNumber, input.orderNumber.toUpperCase()))
        .limit(1);

      if (!order) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Order not found',
        });
      }

      const orderTickets = await db
        .select()
        .from(tickets)
        .where(eq(tickets.orderId, order.id));

      return { ...order, tickets: orderTickets };
    }),

  /**
   * List orders by buyer email (for ticket access)
   */
  listByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const buyerOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.buyerEmail, input.email.toLowerCase()))
        .orderBy(desc(orders.createdAt));

      // Get event info for each order
      const ordersWithEvents = await Promise.all(
        buyerOrders.map(async (order) => {
          const [event] = await db
            .select({
              id: events.id,
              title: events.title,
              slug: events.slug,
              startDate: events.startDate,
              venueName: events.venueName,
              coverImageUrl: events.coverImageUrl,
            })
            .from(events)
            .where(eq(events.id, order.eventId))
            .limit(1);

          return { ...order, event };
        })
      );

      return ordersWithEvents;
    }),

  /**
   * List orders for organiser's events
   */
  listByOrganiser: protectedProcedure
    .input(z.object({
      eventId: z.number().optional(),
      status: z.enum(['pending', 'paid', 'failed', 'refunded', 'cancelled']).optional(),
      limit: z.number().int().positive().default(20),
      offset: z.number().int().nonnegative().default(0),
    }).optional())
    .query(async ({ ctx, input }) => {
      const { eventId, status, limit = 20, offset = 0 } = input || {};

      // Get organiser's event IDs
      // For now, just get all orders if eventId provided
      // TODO: join with organiser profiles

      const conditions = [];
      if (eventId) {
        conditions.push(eq(orders.eventId, eventId));
      }
      if (status) {
        conditions.push(eq(orders.status, status));
      }

      const orderList = await db
        .select()
        .from(orders)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(orders.createdAt))
        .limit(limit)
        .offset(offset);

      return orderList;
    }),

  /**
   * Update order status (for payment callbacks)
   */
  updateStatus: publicProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(['pending', 'paid', 'failed', 'refunded', 'cancelled']),
      paymentMethod: z.string().optional(),
      paymentIntentId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(orders)
        .set({
          status: input.status,
          paymentMethod: input.paymentMethod,
          paymentIntentId: input.paymentIntentId,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, input.id))
        .returning();

      return updated;
    }),
});

async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `BOL-${year}-`;
  
  const lastOrder = await db
    .select({ orderNumber: orders.orderNumber })
    .from(orders)
    .orderBy(desc(orders.id))
    .limit(1);

  if (lastOrder.length === 0 || !lastOrder[0].orderNumber?.startsWith(prefix)) {
    return `${prefix}000001`;
  }

  const lastNum = parseInt(lastOrder[0].orderNumber.replace(prefix, ''), 10);
  return `${prefix}${String(lastNum + 1).padStart(6, '0')}`;
}

function generateTicketNumber(orderId: number, tierId: number, index: number): string {
  const prefix = 'TKT';
  const orderPart = String(orderId).padStart(6, '0');
  const tierPart = String(tierId).padStart(3, '0');
  const indexPart = String(index).padStart(3, '0');
  return `${prefix}-${orderPart}-${tierPart}${indexPart}`;
}

function generateQRCode(ticketNumber: string): string {
  // HMAC-signed QR data - simplified for now
  return `boletify://ticket/${ticketNumber}`;
}