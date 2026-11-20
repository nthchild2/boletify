/**
 * Sales router (ORG-002): organiser-only sales figures and buyer lists.
 * Everything is scoped to the signed-in user's organiser profile.
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { getOrganiserId } from '../lib/organiser';
import { getEventSales, listBuyers, listEventSales, totalsOf } from '../lib/sales';

async function requireOrganiser(userId: number): Promise<number> {
  const organiserId = await getOrganiserId(userId);
  if (!organiserId) throw new TRPCError({ code: 'FORBIDDEN', message: 'No tienes un perfil de organizador' });
  return organiserId;
}

export const salesRouter = createTRPCRouter({
  /** Dashboard: totals plus one row per event. */
  overview: protectedProcedure.query(async ({ ctx }) => {
    const events = await listEventSales(await requireOrganiser(ctx.userId));
    return { totals: totalsOf(events), events };
  }),

  /** Event "Ventas" tab: summary, daily sales, tiers, payment methods. */
  event: protectedProcedure
    .input(z.object({ eventId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const detail = await getEventSales(await requireOrganiser(ctx.userId), input.eventId);
      if (!detail) throw new TRPCError({ code: 'NOT_FOUND', message: 'Evento no encontrado' });
      return detail;
    }),

  /** Paginated buyer list for one event. */
  buyers: protectedProcedure
    .input(
      z.object({
        eventId: z.number().int().positive(),
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(5).max(100).default(25),
      }),
    )
    .query(async ({ ctx, input }) => {
      const organiserId = await requireOrganiser(ctx.userId);
      const { rows, total } = await listBuyers(organiserId, {
        eventId: input.eventId,
        limit: input.pageSize,
        offset: (input.page - 1) * input.pageSize,
      });
      return { rows, total, page: input.page, pageSize: input.pageSize };
    }),
});
