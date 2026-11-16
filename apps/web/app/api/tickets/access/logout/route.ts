/** POST /api/tickets/access/logout — ends a guest ticket session. */

import { NextResponse } from 'next/server';
import { TICKET_COOKIE } from '../../../../../lib/ticket-session';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/tickets', request.url), 303);
  response.cookies.delete(TICKET_COOKIE);
  return response;
}
