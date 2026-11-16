/**
 * POST /api/tickets/access  (form field: token)
 * Redeems a magic link and starts a guest ticket session.
 *
 * It's a POST from a button on /tickets/acceso rather than the emailed GET
 * link itself, so mail scanners that pre-open links can't use up the token.
 */

import { NextResponse } from 'next/server';
import { consumeTicketAccessToken } from '@boletify/api/tickets';
import { TICKET_COOKIE, TICKET_COOKIE_MAX_AGE, createGuestCookieValue } from '../../../../lib/ticket-session';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  // A plain HTML form posts application/x-www-form-urlencoded.
  const form = new URLSearchParams(await request.text().catch(() => ''));
  const token = form.get('token');
  const email = token ? await consumeTicketAccessToken(token) : null;

  if (!email) {
    return NextResponse.redirect(new URL('/tickets?error=enlace', request.url), 303);
  }

  const response = NextResponse.redirect(new URL('/tickets', request.url), 303);
  response.cookies.set(TICKET_COOKIE, createGuestCookieValue(email), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TICKET_COOKIE_MAX_AGE,
  });
  return response;
}
