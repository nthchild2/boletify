/**
 * Auth for the check-in API: the web session cookie (organiser dashboard)
 * or the native app's Bearer token. The user must own the event.
 */

import { NextResponse } from 'next/server';
import { getOwnedEvent, staffLabel, type OwnedEvent } from '@boletify/api/checkin';
import { getRequestUserId } from '../../../../../../lib/request-user';

export type CheckInContext = { userId: number; event: OwnedEvent; staff: string };

export async function requireEventCheckIn(
  request: Request,
  rawEventId: string,
): Promise<CheckInContext | NextResponse> {
  const userId = await getRequestUserId(request);
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
