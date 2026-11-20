/** Organiser lookups shared by the organiser-only features. */

import { and, eq, ne } from 'drizzle-orm';
import { db, events, organiserProfiles } from '@boletify/db';

/** The organiser profile id for a user, or null if they aren't an organiser. */
export async function getOrganiserId(userId: number): Promise<number | null> {
  const [profile] = await db
    .select({ id: organiserProfiles.id })
    .from(organiserProfiles)
    .where(eq(organiserProfiles.userId, userId))
    .limit(1);
  return profile?.id ?? null;
}

/** The event if it belongs to this organiser and isn't deleted. */
export async function getOrganiserEvent(organiserId: number, eventId: number) {
  const [event] = await db
    .select()
    .from(events)
    .where(and(eq(events.id, eventId), eq(events.organiserId, organiserId), ne(events.status, 'deleted')))
    .limit(1);
  return event ?? null;
}
