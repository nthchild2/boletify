/**
 * GET /api/auth/me
 * Returns the current user from a Bearer token.
 * Used by the native app to validate stored sessions.
 */

import { NextResponse } from 'next/server';
import { db, users } from '@boletify/db';
import { eq } from 'drizzle-orm';
import { verifyToken } from '../token';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 });
  }

  const userList = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, payload.sub))
    .limit(1);

  if (userList.length === 0) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  return NextResponse.json(userList[0]);
}
