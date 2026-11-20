import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  generateOrderNumber,
  generateTicketNumber,
  orderAccessKey,
  signTicketQr,
  verifyOrderAccessKey,
  verifyTicketQr,
} from './codes';

const ORIGINAL = process.env.TICKET_QR_SECRET;
beforeEach(() => {
  process.env.TICKET_QR_SECRET = 'test-secret-for-unit-tests';
});
afterEach(() => {
  process.env.TICKET_QR_SECRET = ORIGINAL;
});

// No 0/O or 1/I/L so codes read cleanly at the door.
const SAFE = '[23456789ABCDEFGHJKMNPQRSTUVWXYZ]';

describe('order and ticket numbers', () => {
  it('use the expected prefixes, lengths and alphabet', () => {
    expect(generateOrderNumber()).toMatch(new RegExp(`^BOL-${SAFE}{8}$`));
    expect(generateTicketNumber()).toMatch(new RegExp(`^TKT-${SAFE}{10}$`));
  });

  it('are random', () => {
    const many = new Set(Array.from({ length: 500 }, generateTicketNumber));
    expect(many.size).toBe(500);
  });
});

describe('ticket QR signatures', () => {
  it('round-trips a signed payload', () => {
    const payload = signTicketQr('TKT-4HX9QZ2M7C');
    expect(payload.startsWith('TKT-4HX9QZ2M7C.')).toBe(true);
    expect(verifyTicketQr(payload)).toBe('TKT-4HX9QZ2M7C');
  });

  it('rejects a payload whose ticket number was changed', () => {
    const [, sig] = signTicketQr('TKT-4HX9QZ2M7C').split('.');
    expect(verifyTicketQr(`TKT-4HX9QZ2M7D.${sig}`)).toBeNull();
  });

  it('rejects a tampered or truncated signature', () => {
    const payload = signTicketQr('TKT-4HX9QZ2M7C');
    const flipped = payload.slice(0, -1) + (payload.endsWith('A') ? 'B' : 'A');
    expect(verifyTicketQr(flipped)).toBeNull();
    expect(verifyTicketQr(payload.slice(0, -3))).toBeNull();
  });

  it('rejects codes signed with a different secret', () => {
    const payload = signTicketQr('TKT-4HX9QZ2M7C');
    process.env.TICKET_QR_SECRET = 'another-secret';
    expect(verifyTicketQr(payload)).toBeNull();
  });

  it('rejects malformed input', () => {
    for (const bad of ['', 'TKT-4HX9QZ2M7C', '.abc', 'no-dot-here', 'TKT-X.']) {
      expect(verifyTicketQr(bad)).toBeNull();
    }
  });

  it('refuses to sign without a secret', () => {
    delete process.env.TICKET_QR_SECRET;
    expect(() => signTicketQr('TKT-4HX9QZ2M7C')).toThrow(/TICKET_QR_SECRET/);
  });
});

describe('order access keys (email "view tickets" link)', () => {
  it('verifies the key for its own order only', () => {
    const key = orderAccessKey('BOL-JC8BQBYG');
    expect(verifyOrderAccessKey('BOL-JC8BQBYG', key)).toBe(true);
    expect(verifyOrderAccessKey('BOL-JC8BQBYH', key)).toBe(false);
    expect(verifyOrderAccessKey('BOL-JC8BQBYG', key.slice(1))).toBe(false);
    expect(verifyOrderAccessKey('BOL-JC8BQBYG', '')).toBe(false);
  });

  it('cannot be reused as a ticket QR signature', () => {
    // Order keys sign "order:<number>", tickets sign the bare number.
    const key = orderAccessKey('TKT-4HX9QZ2M7C');
    expect(verifyTicketQr(`TKT-4HX9QZ2M7C.${key}`)).toBeNull();
  });
});
