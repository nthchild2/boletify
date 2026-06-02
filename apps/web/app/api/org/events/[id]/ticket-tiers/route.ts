/**
 * GET  /api/org/events/:id/ticket-tiers  — list tiers for an event
 * POST /api/org/events/:id/ticket-tiers  — create a ticket tier
 */

import { NextResponse } from 'next/server';
import { db } from '@boletify/db';
import { events, ticketTiers } from '@boletify/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireOrganiser } from '../../../auth-helper';

type RouteContext = { params: Promise<{ id: string }> };

async function verifyOwnership(organiserId: number, eventId: number) {
  const [event] = await db
    .select({ id: events.id })
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

  if (!await verifyOwnership(result.organiserId, eventId)) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
  }

  const tiers = await db
    .select()
    .from(ticketTiers)
    .where(eq(ticketTiers.eventId, eventId));

  return NextResponse.json(tiers);
}

export async function POST(request: Request, ctx: RouteContext) {
  const result = await requireOrganiser(request);
  if (result instanceof NextResponse) return result;

  const { id } = await ctx.params;
  const eventId = parseInt(id, 10);
  if (isNaN(eventId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  if (!await verifyOwnership(result.organiserId, eventId)) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { name, description, price, quantity, maxPerOrder, saleStartDate, saleEndDate } = body;

    if (!name || price === undefined || !quantity) {
      return NextResponse.json(
        { error: 'name, price, y quantity son requeridos' },
        { status: 400 },
      );
    }

    const [tier] = await db
      .insert(ticketTiers)
      .values({
        eventId,
        name,
        description: description || null,
        price: Math.round(Number(price)),
        quantity: Math.round(Number(quantity)),
        maxPerOrder: maxPerOrder ? Math.round(Number(maxPerOrder)) : 10,
        saleStartDate: saleStartDate ? new Date(saleStartDate) : null,
        saleEndDate: saleEndDate ? new Date(saleEndDate) : null,
      })
      .returning();

    return NextResponse.json(tier, { status: 201 });
  } catch (err: any) {
    console.error('Create ticket tier error:', err);
    return NextResponse.json(
      { error: err.message || 'Error al crear tier' },
      { status: 500 },
    );
  }
}
