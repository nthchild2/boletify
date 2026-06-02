/**
 * GET  /api/org/events         — list organiser's events (optional ?status= filter)
 * POST /api/org/events         — create a new event (draft)
 *
 * Both require Bearer token from a user with an organiser profile.
 */

import { NextResponse } from 'next/server';
import { db } from '@boletify/db';
import { events } from '@boletify/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { requireOrganiser } from '../auth-helper';

function generateSlug(title: string, date: Date, city: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const dateStr = date.toISOString().split('T')[0];
  return `${base}-${dateStr}-${city.toLowerCase()}`;
}

export async function GET(request: Request) {
  const result = await requireOrganiser(request);
  if (result instanceof NextResponse) return result;
  const { organiserId } = result;

  const url = new URL(request.url);
  const status = url.searchParams.get('status');

  const conditions = [eq(events.organiserId, organiserId)];
  if (status) {
    conditions.push(eq(events.status, status));
  }

  const rows = await db
    .select()
    .from(events)
    .where(and(...conditions))
    .orderBy(desc(events.createdAt))
    .limit(50);

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const result = await requireOrganiser(request);
  if (result instanceof NextResponse) return result;
  const { organiserId } = result;

  try {
    const body = await request.json();
    const {
      title,
      description,
      coverImageUrl,
      venueName,
      venueAddress,
      venueMapUrl,
      city = 'CDMX',
      genreTags,
      startDate,
      endDate,
    } = body;

    if (!title || !venueName || !startDate) {
      return NextResponse.json(
        { error: 'title, venueName, y startDate son requeridos' },
        { status: 400 },
      );
    }

    const parsedStart = new Date(startDate);
    if (isNaN(parsedStart.getTime())) {
      return NextResponse.json({ error: 'Fecha de inicio inválida' }, { status: 400 });
    }

    const slug = generateSlug(title, parsedStart, city);

    const [event] = await db
      .insert(events)
      .values({
        title,
        slug,
        description: description || null,
        coverImageUrl: coverImageUrl || null,
        venueName,
        venueAddress: venueAddress || null,
        venueMapUrl: venueMapUrl || null,
        city,
        genreTags: genreTags || null,
        startDate: parsedStart,
        endDate: endDate ? new Date(endDate) : null,
        organiserId,
        status: 'draft',
      })
      .returning();

    return NextResponse.json(event, { status: 201 });
  } catch (err: any) {
    console.error('Create event error:', err);
    return NextResponse.json(
      { error: err.message || 'Error al crear evento' },
      { status: 500 },
    );
  }
}
