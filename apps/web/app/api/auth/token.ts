/**
 * Shared token utilities for the native-app auth flow.
 * Separated from the route file because Next.js disallows
 * non-handler exports from route.ts files.
 */

import { randomBytes, createHash } from 'crypto';

export function generateToken(userId: number): string {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
    jti: randomBytes(16).toString('hex'),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHash('sha256')
    .update(encoded + (process.env.AUTH_SECRET || 'dev-secret'))
    .digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifyToken(token: string): { sub: number } | null {
  try {
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) return null;

    const expected = createHash('sha256')
      .update(encoded + (process.env.AUTH_SECRET || 'dev-secret'))
      .digest('base64url');

    if (signature !== expected) return null;

    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString());
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return { sub: payload.sub };
  } catch {
    return null;
  }
}
