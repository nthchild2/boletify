/**
 * POST /api/tickets/access/request  { email }
 * Emails a one-time link to "Mis boletos" if that address has paid orders.
 * The response is the same either way, so it can't reveal who bought tickets.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requestTicketAccess } from '@boletify/api/tickets';

export const runtime = 'nodejs';

const bodySchema = z.object({ email: z.string().trim().email().max(254) });

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Escribe un correo válido.' }, { status: 400 });
  }

  try {
    const result = await requestTicketAccess(parsed.data.email);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error('[tickets/access/request] failed', err);
    return NextResponse.json({ error: 'No pudimos enviar el enlace. Intenta de nuevo.' }, { status: 500 });
  }
}
