/** Organiser promo code management (PRO-002). Every call checks the event is the organiser's. */

import { TRPCError } from '@trpc/server';
import { ZodError, z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { getOrganiserEvent, getOrganiserId } from '../lib/organiser';
import { PromoError, createPromo, deletePromo, listEventPromos, updatePromo } from '../lib/promo-codes';

async function requireOwnEvent(userId: number, eventId: number): Promise<void> {
  const organiserId = await getOrganiserId(userId);
  const event = organiserId ? await getOrganiserEvent(organiserId, eventId) : null;
  if (!event) throw new TRPCError({ code: 'NOT_FOUND', message: 'Evento no encontrado' });
}

async function promoCall<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (err) {
    if (err instanceof PromoError) throw new TRPCError({ code: err.code, message: err.message });
    if (err instanceof ZodError) throw new TRPCError({ code: 'BAD_REQUEST', message: err.issues[0]?.message });
    throw err;
  }
}

export const promoCodesRouter = createTRPCRouter({
  list: protectedProcedure.input(z.object({ eventId: z.number().int().positive() })).query(async ({ ctx, input }) => {
    await requireOwnEvent(ctx.userId, input.eventId);
    return listEventPromos(input.eventId);
  }),

  // Loose input: promoCreateSchema runs inside createPromo so the form gets one Spanish message.
  create: protectedProcedure
    .input(
      z.object({
        eventId: z.number().int().positive(),
        code: z.string().max(100),
        discountType: z.enum(['percentage', 'flat']),
        discountValue: z.number(),
        maxUses: z.number().nullable(),
        expiresAt: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await requireOwnEvent(ctx.userId, input.eventId);
      return promoCall(() => createPromo(input));
    }),

  update: protectedProcedure
    .input(
      z.object({
        eventId: z.number().int().positive(),
        id: z.number().int().positive(),
        isActive: z.boolean().optional(),
        maxUses: z.number().int().nullable().optional(),
        expiresAt: z.coerce.date().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await requireOwnEvent(ctx.userId, input.eventId);
      const { eventId, id, ...patch } = input;
      return promoCall(() => updatePromo(eventId, id, patch));
    }),

  delete: protectedProcedure
    .input(z.object({ eventId: z.number().int().positive(), id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await requireOwnEvent(ctx.userId, input.eventId);
      await promoCall(() => deletePromo(input.eventId, input.id));
      return { success: true };
    }),
});
