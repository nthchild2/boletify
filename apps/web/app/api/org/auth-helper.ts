/**
 * Shared auth helper for /api/org/* REST endpoints.
 * Validates Bearer token and resolves the organiser profile.
 */

import { NextResponse } from 'next/server';
import { db, users } from '@boletify/db';
import { organiserProfiles } from '@boletify/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '../auth/token';

export type OrgContext = {
  userId: number;
  organiserId: number;
};

/**
 * Returns the authenticated organiser context or a NextResponse error.
 * Usage:
 *   const result = await requireOrganiser(request);
 *   if (result instanceof NextResponse) return result;
 *   const { userId, organiserId } = result;
 */
export async function requireOrganiser(
  request: Request,
): Promise<OrgContext | NextResponse> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 });
  }

  const profiles = await db
    .select({ id: organiserProfiles.id })
    .from(organiserProfiles)
    .where(eq(organiserProfiles.userId, payload.sub))
    .limit(1);

  if (profiles.length === 0) {
    return NextResponse.json(
      { error: 'No tienes un perfil de organizador' },
      { status: 403 },
    );
  }

  return { userId: payload.sub, organiserId: profiles[0].id };
}
