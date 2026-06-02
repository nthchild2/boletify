/**
 * POST /api/org/events/:id/publish — publish a draft event
 */

import { NextResponse } from 'next/server';
import { db } from '@boletify/db';
import { events } from '@boletify/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireOrganiser } from '../../../auth-helper';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: RouteContext) {
  const result = await requireOrganiser(request);
  if (result instanceof NextResponse) return result;

  const { id } = await ctx.params;
  const eventId = parseInt(id, 10);
  if (isNaN(eventId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const [existing] = await db
    .select()
    .from(events)
    .where(
      and(eq(events.id, eventId), eq(events.organiserId, result.organiserId)),
    )
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
  }

  if (existing.status !== 'draft') {
    return NextResponse.json(
      { error: 'Solo eventos en borrador pueden publicarse' },
      { status: 400 },
    );
  }

  const [published] = await db
    .update(events)
    .set({
      status: 'published',
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(events.id, eventId))
    .returning();

  return NextResponse.json(published);
}
