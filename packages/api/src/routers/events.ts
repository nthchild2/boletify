/**
 * Events router
 * Handles event CRUD operations for organisers
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { db } from '@boletify/db';
import { events, ticketTiers, organiserProfiles } from '@boletify/db/schema';
import { eq, and, desc } from 'drizzle-orm';

const eventSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
  venueName: z.string().min(1).max(255),
  venueAddress: z.string().optional(),
  venueMapUrl: z.string().url().optional(),
  city: z.string().default('CDMX'),
  genreTags: z.array(z.string()).optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
});

const ticketTierSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.number().int().min(0),
  quantity: z.number().int().positive(),
  maxPerOrder: z.number().int().positive().default(10),
  saleStartDate: z.date().optional(),
  saleEndDate: z.date().optional(),
});

export const eventsRouter = createTRPCRouter({
  /**
   * Create a new event (organiser only)
   */
  create: protectedProcedure
    .input(eventSchema)
    .mutation(async ({ ctx, input }) => {
      // Get organiser profile for user
      const profiles = await db
        .select()
        .from(organiserProfiles)
        .where(eq(organiserProfiles.userId, ctx.userId))
        .limit(1);

      if (profiles.length === 0) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You must have an organiser profile to create events',
        });
      }

      // Generate slug from title + date
      const slug = generateSlug(input.title, input.startDate, input.city);

      const [event] = await db
        .insert(events)
        .values({
          ...input,
          slug,
          organiserId: profiles[0].id,
          status: 'draft',
        })
        .returning();

      return event;
    }),

  /**
   * Get event by ID or slug
   */
  getById: publicProcedure
    .input(z.object({ id: z.number().optional(), slug: z.string().optional() }))
    .query(async ({ input }) => {
      if (!input.id && !input.slug) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either id or slug required',
        });
      }

      const conditions = input.id
        ? eq(events.id, input.id)
        : eq(events.slug, input.slug!);

      const [event] = await db
        .select()
        .from(events)
        .where(and(conditions, eq(events.status, 'published')))
        .limit(1);

      if (!event) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found',
        });
      }

      // Get ticket tiers
      const tiers = await db
        .select()
        .from(ticketTiers)
        .where(eq(ticketTiers.eventId, event.id));

      return { ...event, ticketTiers: tiers };
    }),

  /**
   * List events (for discovery - public)
   */
  list: publicProcedure
    .input(z.object({
      city: z.string().optional(),
      status: z.enum(['published']).default('published'),
      limit: z.number().int().positive().default(20),
      offset: z.number().int().nonnegative().default(0),
    }).optional())
    .query(async ({ input }) => {
      // Return empty for now - the home page uses hardcoded DB_EVENTS
      return [];
    }),

  /**
   * List organiser's events (protected)
   */
  listByOrganiser: protectedProcedure
    .input(z.object({
      status: z.enum(['draft', 'published', 'cancelled', 'ended', 'deleted']).optional(),
      limit: z.number().int().positive().default(20),
      offset: z.number().int().nonnegative().default(0),
    }).optional())
    .query(async ({ ctx, input }) => {
      const { status, limit = 20, offset = 0 } = input || {};

      // Get organiser profile
      const profiles = await db
        .select()
        .from(organiserProfiles)
        .where(eq(organiserProfiles.userId, ctx.userId))
        .limit(1);

      if (profiles.length === 0) {
        return [];
      }

      const conditions = [eq(events.organiserId, profiles[0].id)];
      if (status) {
        conditions.push(eq(events.status, status));
      }

      return db
        .select()
        .from(events)
        .where(and(...conditions))
        .orderBy(desc(events.createdAt))
        .limit(limit)
        .offset(offset);
    }),

  /**
   * Update an event (organiser only, own events)
   */
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      data: eventSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const profiles = await db
        .select()
        .from(organiserProfiles)
        .where(eq(organiserProfiles.userId, ctx.userId))
        .limit(1);

      if (profiles.length === 0) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'No organiser profile found',
        });
      }

      const [existing] = await db
        .select()
        .from(events)
        .where(and(
          eq(events.id, input.id),
          eq(events.organiserId, profiles[0].id)
        ))
        .limit(1);

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found or access denied',
        });
      }

      const [updated] = await db
        .update(events)
        .set({
          ...input.data,
          updatedAt: new Date(),
        })
        .where(eq(events.id, input.id))
        .returning();

      return updated;
    }),

  /**
   * Publish an event (make it visible)
   */
  publish: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const profiles = await db
        .select()
        .from(organiserProfiles)
        .where(eq(organiserProfiles.userId, ctx.userId))
        .limit(1);

      if (profiles.length === 0) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'No organiser profile found',
        });
      }

      const [existing] = await db
        .select()
        .from(events)
        .where(and(
          eq(events.id, input.id),
          eq(events.organiserId, profiles[0].id)
        ))
        .limit(1);

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found or access denied',
        });
      }

      if (existing.status !== 'draft') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Only draft events can be published',
        });
      }

      const [published] = await db
        .update(events)
        .set({
          status: 'published',
          publishedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(events.id, input.id))
        .returning();

      return published;
    }),

  /**
   * Delete (soft delete) an event
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const profiles = await db
        .select()
        .from(organiserProfiles)
        .where(eq(organiserProfiles.userId, ctx.userId))
        .limit(1);

      if (profiles.length === 0) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'No organiser profile found',
        });
      }

      const [existing] = await db
        .select()
        .from(events)
        .where(and(
          eq(events.id, input.id),
          eq(events.organiserId, profiles[0].id)
        ))
        .limit(1);

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found or access denied',
        });
      }

      await db
        .update(events)
        .set({
          status: 'deleted',
          deletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(events.id, input.id));

      return { success: true };
    }),

  /**
   * Create ticket tier for an event
   */
  createTicketTier: protectedProcedure
    .input(z.object({
      eventId: z.number(),
      data: ticketTierSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      const profiles = await db
        .select()
        .from(organiserProfiles)
        .where(eq(organiserProfiles.userId, ctx.userId))
        .limit(1);

      if (profiles.length === 0) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'No organiser profile found',
        });
      }

      const [event] = await db
        .select()
        .from(events)
        .where(and(
          eq(events.id, input.eventId),
          eq(events.organiserId, profiles[0].id)
        ))
        .limit(1);

      if (!event) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found or access denied',
        });
      }

      const [tier] = await db
        .insert(ticketTiers)
        .values({
          ...input.data,
          eventId: input.eventId,
        })
        .returning();

      return tier;
    }),
});

function generateSlug(title: string, date: Date, city: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  const dateStr = date.toISOString().split('T')[0];
  return `${base}-${dateStr}-${city.toLowerCase()}`;
}