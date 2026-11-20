/**
 * Auth for the check-in API: the web session cookie (organiser dashboard)
 * or the native app's Bearer token. The user must own the event.
 */

import { NextResponse } from 'next/server';
import { getOwnedEvent, staffLabel, type OwnedEvent } from '@boletify/api/checkin';
import { auth } from '../../../../../../lib/auth';
import { verifyToken } from '../../../../auth/token';

export type CheckInContext = { userId: number; event: OwnedEvent; staff: string };

async function currentUserId(request: Request): Promise<number | null> {
  const header = request.headers.get('authorization');
  if (header?.startsWith('Bearer ')) {
    return verifyToken(header.slice(7))?.sub ?? null;
  }
  try {
    const session = await auth();
    const id = Number(session?.user?.id);
    return Number.isInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

export async function requireEventCheckIn(
  request: Request,
  rawEventId: string,
): Promise<CheckInContext | NextResponse> {
  const userId = await currentUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
  const eventId = Number(rawEventId);
  const event = Number.isInteger(eventId) && eventId > 0 ? await getOwnedEvent(userId, eventId) : null;
  if (!event) {
    // Same answer whether the event doesn't exist or belongs to someone else.
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
  }
  return { userId, event, staff: await staffLabel(userId) };
}
