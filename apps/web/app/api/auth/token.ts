/**
 * Shared token utilities for the native-app auth flow.
 * Separated from the route file because Next.js disallows
 * non-handler exports from route.ts files.
 *
 * Token format: `<base64url(JSON payload)>.<base64url(HMAC-SHA256(payload, AUTH_SECRET))>`
 */

import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

const TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

type TokenPayload = {
  sub: number;
  iat: number;
  exp: number;
  jti: string;
};

/**
 * Fails closed: without AUTH_SECRET we can neither issue nor verify tokens,
 * so throw instead of falling back to a guessable default.
 */
function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET is not set; refusing to issue or verify auth tokens');
  }
  return secret;
}

function sign(encoded: string, secret: string): string {
  return createHmac('sha256', secret).update(encoded).digest('base64url');
}

function isTokenPayload(value: unknown): value is TokenPayload {
  if (typeof value !== 'object' || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.sub === 'number' &&
    Number.isSafeInteger(p.sub) &&
    p.sub > 0 &&
    typeof p.exp === 'number' &&
    Number.isFinite(p.exp)
  );
}

export function generateToken(userId: number): string {
  const secret = getSecret();
  const now = Math.floor(Date.now() / 1000);
  const payload: TokenPayload = {
    sub: userId,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
    jti: randomBytes(16).toString('hex'),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encoded}.${sign(encoded, secret)}`;
}

export function verifyToken(token: string): { sub: number } | null {
  // Outside the try: a missing secret is a server misconfiguration and must
  // surface as an error, not be swallowed into "invalid token".
  const secret = getSecret();

  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encoded, signature] = parts;
    if (!encoded || !signature) return null;

    // Compare the exact signature strings (as bytes) in constant time.
    const expected = Buffer.from(sign(encoded, secret));
    const actual = Buffer.from(signature);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
      return null;
    }

    const payload: unknown = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!isTokenPayload(payload)) return null;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;

    return { sub: payload.sub };
  } catch {
    return null;
  }
}
