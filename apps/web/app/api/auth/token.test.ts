import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { generateToken, verifyToken } from './token';

const ORIGINAL = process.env.AUTH_SECRET;
beforeEach(() => {
  process.env.AUTH_SECRET = 'unit-test-auth-secret';
});
afterEach(() => {
  process.env.AUTH_SECRET = ORIGINAL;
  vi.useRealTimers();
});

describe('native app auth tokens', () => {
  it('round-trips the user id', () => {
    expect(verifyToken(generateToken(42))).toEqual({ sub: 42 });
  });

  it('rejects tampered payloads and signatures', () => {
    const token = generateToken(42);
    const [payload, sig] = token.split('.');
    const forged = Buffer.from(JSON.stringify({ sub: 1, iat: 0, exp: 9_999_999_999, jti: 'x' })).toString('base64url');
    expect(verifyToken(`${forged}.${sig}`)).toBeNull();
    expect(verifyToken(`${payload}.${sig}x`)).toBeNull();
    expect(verifyToken(`${payload}.`)).toBeNull();
    expect(verifyToken(`${token}.extra`)).toBeNull();
    expect(verifyToken('garbage')).toBeNull();
  });

  it('rejects tokens signed with another secret', () => {
    const token = generateToken(42);
    process.env.AUTH_SECRET = 'rotated-secret';
    expect(verifyToken(token)).toBeNull();
  });

  it('expires after 30 days', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-20T00:00:00Z'));
    const token = generateToken(42);
    vi.setSystemTime(new Date('2026-12-19T23:59:00Z'));
    expect(verifyToken(token)).toEqual({ sub: 42 });
    vi.setSystemTime(new Date('2026-12-20T00:00:01Z'));
    expect(verifyToken(token)).toBeNull();
  });

  it('fails closed without AUTH_SECRET instead of using a default', () => {
    const token = generateToken(42);
    delete process.env.AUTH_SECRET;
    expect(() => generateToken(42)).toThrow(/AUTH_SECRET/);
    expect(() => verifyToken(token)).toThrow(/AUTH_SECRET/);
  });
});
