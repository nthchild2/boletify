/**
 * GET /api/org/events/:id/check-in/search?q=…
 * Manual lookup by attendee name, email, order number or ticket number.
 */

import { NextResponse } from 'next/server';
import { searchEventTickets } from '@boletify/api/checkin';
import { requireEventCheckIn } from '../auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireEventCheckIn(request, (await params).id);
  if (ctx instanceof NextResponse) return ctx;
  const q = new URL(request.url).searchParams.get('q') ?? '';
  return NextResponse.json({ results: await searchEventTickets(ctx.event.id, q.slice(0, 100)) });
}
