/**
 * Who is looking at "Mis boletos"?
 *
 * - A signed-in user (Auth.js session) sees orders bought with their email.
 * - A guest who opened a magic link gets a signed cookie holding the email
 *   they proved they own, valid for 30 days.
 */

import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { auth } from './auth';

export const TICKET_COOKIE = 'boletify_tickets';
export const TICKET_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // seconds

function secret(): string {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error('AUTH_SECRET is not set');
  return value;
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(`ticket-session:${payload}`).digest('base64url');
}

export function createGuestCookieValue(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({ e: email, x: Math.floor(Date.now() / 1000) + TICKET_COOKIE_MAX_AGE }),
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function readGuestCookieValue(value: string | undefined): string | null {
  if (!value) return null;
  const [payload, signature] = value.split('.');
  if (!payload || !signature) return null;
  const given = Buffer.from(signature);
  const expected = Buffer.from(sign(payload));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const { e, x } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (typeof e !== 'string' || typeof x !== 'number' || x < Date.now() / 1000) return null;
    return e;
  } catch {
    return null;
  }
}

export type TicketViewer = { email: string; source: 'account' | 'guest' };

export async function getTicketViewer(): Promise<TicketViewer | null> {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (email) return { email: email.toLowerCase(), source: 'account' };
  } catch {
    // fall through to the guest cookie
  }
  const store = await cookies();
  const guestEmail = readGuestCookieValue(store.get(TICKET_COOKIE)?.value);
  return guestEmail ? { email: guestEmail, source: 'guest' } : null;
}
