/**
 * GET    /api/org/events/:id   — get single event (own only)
 * PATCH  /api/org/events/:id   — update event fields
 * DELETE /api/org/events/:id   — soft-delete event
 *
 * All require Bearer token from the owning organiser.
 */

import { NextResponse } from 'next/server';
import { db } from '@boletify/db';
import { events, ticketTiers } from '@boletify/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireOrganiser } from '../../auth-helper';

type RouteContext = { params: Promise<{ id: string }> };

async function getOwnEvent(organiserId: number, eventId: number) {
  const [event] = await db
    .select()
    .from(events)
    .where(and(eq(events.id, eventId), eq(events.organiserId, organiserId)))
    .limit(1);
  return event ?? null;
}

export async function GET(request: Request, ctx: RouteContext) {
  const result = await requireOrganiser(request);
  if (result instanceof NextResponse) return result;

  const { id } = await ctx.params;
  const eventId = parseInt(id, 10);
  if (isNaN(eventId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const event = await getOwnEvent(result.organiserId, eventId);
  if (!event) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
  }

  // Include ticket tiers
  const tiers = await db
    .select()
    .from(ticketTiers)
    .where(eq(ticketTiers.eventId, eventId));

  return NextResponse.json({ ...event, ticketTiers: tiers });
}

export async function PATCH(request: Request, ctx: RouteContext) {
  const result = await requireOrganiser(request);
  if (result instanceof NextResponse) return result;

  const { id } = await ctx.params;
  const eventId = parseInt(id, 10);
  if (isNaN(eventId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const existing = await getOwnEvent(result.organiserId, eventId);
  if (!existing) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updateData: Record<string, any> = { updatedAt: new Date() };

    // Only set fields that were explicitly sent
    const allowedFields = [
      'title', 'description', 'coverImageUrl', 'venueName',
      'venueAddress', 'venueMapUrl', 'city', 'genreTags',
    ];
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }
    if (body.startDate !== undefined) {
      updateData.startDate = new Date(body.startDate);
    }
    if (body.endDate !== undefined) {
      updateData.endDate = body.endDate ? new Date(body.endDate) : null;
    }

    const [updated] = await db
      .update(events)
      .set(updateData)
      .where(eq(events.id, eventId))
      .returning();

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('Update event error:', err);
    return NextResponse.json(
      { error: err.message || 'Error al actualizar' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, ctx: RouteContext) {
  const result = await requireOrganiser(request);
  if (result instanceof NextResponse) return result;

  const { id } = await ctx.params;
  const eventId = parseInt(id, 10);
  if (isNaN(eventId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const existing = await getOwnEvent(result.organiserId, eventId);
  if (!existing) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
  }

  await db
    .update(events)
    .set({
      status: 'deleted',
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(events.id, eventId));

  return NextResponse.json({ success: true });
}
