import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';

// Crockford-style alphabet: no 0/O or 1/I/L, so codes read cleanly aloud and at the door.
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

function randomCode(length: number): string {
  let out = '';
  for (let i = 0; i < length; i++) out += ALPHABET[randomInt(ALPHABET.length)];
  return out;
}

/** Public order reference, e.g. BOL-7KQ2M9XA. Random so it can't be enumerated. */
export function generateOrderNumber(): string {
  return `BOL-${randomCode(8)}`;
}

/** Ticket number printed on the ticket, e.g. TKT-4HX9QZ2M7C. */
export function generateTicketNumber(): string {
  return `TKT-${randomCode(10)}`;
}

function qrSecret(): string {
  const secret = process.env.TICKET_QR_SECRET;
  if (!secret) throw new Error('TICKET_QR_SECRET is not set');
  return secret;
}

function sign(ticketNumber: string): string {
  return createHmac('sha256', qrSecret()).update(ticketNumber).digest('base64url').slice(0, 22);
}

/**
 * QR payload for a ticket: "<ticketNumber>.<signature>". The signature lets the
 * door scanner reject forged codes before looking the ticket up.
 */
export function signTicketQr(ticketNumber: string): string {
  return `${ticketNumber}.${sign(ticketNumber)}`;
}

/**
 * Key for the "view this order" link in the confirmation email. Whoever has
 * the email already has the QR codes, so the link grants nothing extra.
 */
export function orderAccessKey(orderNumber: string): string {
  return sign(`order:${orderNumber}`);
}

export function verifyOrderAccessKey(orderNumber: string, key: string): boolean {
  const given = Buffer.from(key);
  const expected = Buffer.from(orderAccessKey(orderNumber));
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Returns the ticket number if the QR payload's signature is valid, otherwise null. */
export function verifyTicketQr(payload: string): string | null {
  const dot = payload.lastIndexOf('.');
  if (dot <= 0) return null;
  const ticketNumber = payload.slice(0, dot);
  const given = Buffer.from(payload.slice(dot + 1));
  const expected = Buffer.from(sign(ticketNumber));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  return ticketNumber;
}
