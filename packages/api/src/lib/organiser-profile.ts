/**
 * Organiser profile (ORG-001): public name, bio, logo URL and slug.
 * Logo upload comes later; for now organisers paste an https image URL.
 */

import { z } from 'zod';
import { and, eq, ne } from 'drizzle-orm';
import { db, organiserProfiles } from '@boletify/db';

export const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/;

export const profileInputSchema = z.object({
  organiserName: z.string().trim().min(2, 'Escribe al menos 2 caracteres.').max(80, 'Máximo 80 caracteres.'),
  bio: z
    .string()
    .trim()
    .max(500, 'Máximo 500 caracteres.')
    .transform((v) => (v === '' ? null : v))
    .nullable(),
  logoUrl: z
    .string()
    .trim()
    .max(500)
    .transform((v) => (v === '' ? null : v))
    .nullable()
    .refine((v) => v === null || /^https:\/\/[^\s]+$/i.test(v), 'El logo debe ser una URL https://'),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(SLUG_PATTERN, 'Usa 3 a 40 letras minúsculas, números o guiones (sin guion al inicio o al final).'),
});

export type ProfileInput = z.input<typeof profileInputSchema>;

export class ProfileError extends Error {
  constructor(
    public code: 'NOT_FOUND' | 'CONFLICT',
    message: string,
  ) {
    super(message);
    this.name = 'ProfileError';
  }
}

const publicColumns = {
  id: organiserProfiles.id,
  organiserName: organiserProfiles.organiserName,
  bio: organiserProfiles.bio,
  logoUrl: organiserProfiles.logoUrl,
  slug: organiserProfiles.slug,
};

export async function getProfileForUser(userId: number) {
  const [profile] = await db.select(publicColumns).from(organiserProfiles).where(eq(organiserProfiles.userId, userId)).limit(1);
  return profile ?? null;
}

export async function updateProfileForUser(userId: number, raw: ProfileInput) {
  const input = profileInputSchema.parse(raw);
  const current = await getProfileForUser(userId);
  if (!current) throw new ProfileError('NOT_FOUND', 'No tienes un perfil de organizador');

  const [taken] = await db
    .select({ id: organiserProfiles.id })
    .from(organiserProfiles)
    .where(and(eq(organiserProfiles.slug, input.slug), ne(organiserProfiles.id, current.id)))
    .limit(1);
  if (taken) throw new ProfileError('CONFLICT', 'Ese enlace ya lo usa otro organizador. Prueba otro.');

  try {
    const [updated] = await db
      .update(organiserProfiles)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(organiserProfiles.id, current.id))
      .returning(publicColumns);
    return updated;
  } catch (err) {
    // Unique index on slug: someone took it between our check and the update.
    if ((err as { code?: string })?.code === '23505') {
      throw new ProfileError('CONFLICT', 'Ese enlace ya lo usa otro organizador. Prueba otro.');
    }
    throw err;
  }
}
