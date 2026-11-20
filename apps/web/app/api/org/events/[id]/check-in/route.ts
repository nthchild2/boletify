/**
 * GET  /api/org/events/:id/check-in  → { event, stats }
 * POST /api/org/events/:id/check-in  { code } (scanned/pasted QR) or { ticketNumber } (manual)
 *      → { reason, ticket?, stats }
 *
 * Organiser-only (web session or Bearer token). Results are always 200 with
 * a `reason`; HTTP errors mean the request itself was rejected.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkInByCode, checkInByTicketNumber, getCheckInStats } from '@boletify/api/checkin';
import { requireEventCheckIn } from './auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireEventCheckIn(request, (await params).id);
  if (ctx instanceof NextResponse) return ctx;
  return NextResponse.json({ event: ctx.event, stats: await getCheckInStats(ctx.event.id) });
}

const bodySchema = z.union([
  z.object({ code: z.string().min(1).max(500) }),
  z.object({ ticketNumber: z.string().min(1).max(40) }),
]);

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireEventCheckIn(request, (await params).id);
  if (ctx instanceof NextResponse) return ctx;

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Falta el código del boleto.' }, { status: 400 });
  }

  const result =
    'code' in parsed.data
      ? await checkInByCode(ctx.event.id, parsed.data.code, ctx.staff)
      : await checkInByTicketNumber(ctx.event.id, parsed.data.ticketNumber, ctx.staff);
  return NextResponse.json(result);
}
