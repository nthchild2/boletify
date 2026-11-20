/**
 * Promo codes in the database (PRO-001/002), using promo_codes and
 * orders.promo_code_id / orders.discount_amount.
 *
 * uses_count counts paid orders plus checkouts still holding tickets: a use
 * is claimed when checkout starts (one conditional UPDATE, so two buyers can
 * never push it past max_uses) and given back if that hold expires or is
 * cancelled, exactly like ticket inventory.
 */

import { and, desc, eq, sql } from 'drizzle-orm';
import { db, orders, promoCodes } from '@boletify/db';
import { normalizePromoCode, promoCreateSchema, promoStatus, type PromoCreateInput } from './promo';

export class PromoError extends Error {
  constructor(
    public code: 'NOT_FOUND' | 'CONFLICT' | 'BAD_REQUEST',
    message: string,
  ) {
    super(message);
    this.name = 'PromoError';
  }
}

export const INVALID_CODE_MESSAGE = 'Código inválido o expirado.';

type PromoRow = typeof promoCodes.$inferSelect;

export async function findPromoByCode(eventId: number, rawCode: string): Promise<PromoRow | null> {
  const code = normalizePromoCode(rawCode);
  if (!code) return null;
  const [row] = await db
    .select()
    .from(promoCodes)
    .where(and(eq(promoCodes.eventId, eventId), eq(promoCodes.code, code)))
    .limit(1);
  return row ?? null;
}

/** A code buyers can use right now, or null (same answer for unknown, expired, exhausted). */
export async function findUsablePromo(eventId: number, rawCode: string): Promise<PromoRow | null> {
  const row = await findPromoByCode(eventId, rawCode);
  return row && promoStatus(row) === 'active' ? row : null;
}

/** Atomically take one use of the code. Returns false if it's no longer usable. */
export async function claimPromoUse(promoId: number): Promise<boolean> {
  const rows = await db
    .update(promoCodes)
    .set({ usesCount: sql`${promoCodes.usesCount} + 1` })
    .where(
      and(
        eq(promoCodes.id, promoId),
        eq(promoCodes.isActive, true),
        sql`(${promoCodes.maxUses} is null or ${promoCodes.usesCount} < ${promoCodes.maxUses})`,
        sql`(${promoCodes.expiresAt} is null or ${promoCodes.expiresAt} > now())`,
      ),
    )
    .returning({ id: promoCodes.id });
  return rows.length === 1;
}

/** Give a use back (checkout abandoned or failed before payment). */
export async function releasePromoUse(promoId: number): Promise<void> {
  await db
    .update(promoCodes)
    .set({ usesCount: sql`greatest(${promoCodes.usesCount} - 1, 0)` })
    .where(eq(promoCodes.id, promoId));
}

// ---------------------------------------------------------------------------
// Organiser management (callers check the organiser owns eventId)
// ---------------------------------------------------------------------------

export type PromoListItem = PromoRow & { status: ReturnType<typeof promoStatus>; paidOrders: number; discountGiven: number };

export async function listEventPromos(eventId: number): Promise<PromoListItem[]> {
  const rows = await db.select().from(promoCodes).where(eq(promoCodes.eventId, eventId)).orderBy(desc(promoCodes.createdAt));
  const impact = await db
    .select({
      promoCodeId: orders.promoCodeId,
      paidOrders: sql<number>`count(*)`.mapWith(Number),
      discountGiven: sql<number>`coalesce(sum(${orders.discountAmount}), 0)`.mapWith(Number),
    })
    .from(orders)
    .where(and(eq(orders.eventId, eventId), eq(orders.status, 'paid')))
    .groupBy(orders.promoCodeId);
  return rows.map((r) => {
    const i = impact.find((x) => x.promoCodeId === r.id);
    return { ...r, status: promoStatus(r), paidOrders: i?.paidOrders ?? 0, discountGiven: i?.discountGiven ?? 0 };
  });
}

export async function createPromo(raw: PromoCreateInput): Promise<PromoRow> {
  const input = promoCreateSchema.parse(raw);
  if (input.expiresAt && input.expiresAt <= new Date()) {
    throw new PromoError('BAD_REQUEST', 'La fecha de expiración ya pasó.');
  }
  if (await findPromoByCode(input.eventId, input.code)) {
    throw new PromoError('CONFLICT', `Ya existe el código ${input.code} para este evento.`);
  }
  const [row] = await db
    .insert(promoCodes)
    .values({
      eventId: input.eventId,
      code: input.code,
      discountType: input.discountType,
      discountValue: input.discountValue,
      maxUses: input.maxUses,
      expiresAt: input.expiresAt,
      isActive: true,
    })
    .returning();
  return row;
}

async function requirePromo(eventId: number, promoId: number): Promise<PromoRow> {
  const [row] = await db
    .select()
    .from(promoCodes)
    .where(and(eq(promoCodes.id, promoId), eq(promoCodes.eventId, eventId)))
    .limit(1);
  if (!row) throw new PromoError('NOT_FOUND', 'Código no encontrado');
  return row;
}

/** Turn a code on or off, or change its limits. Code, type and amount are fixed once created. */
export async function updatePromo(
  eventId: number,
  promoId: number,
  patch: { isActive?: boolean; maxUses?: number | null; expiresAt?: Date | null },
): Promise<PromoRow> {
  const current = await requirePromo(eventId, promoId);
  if (patch.maxUses !== undefined && patch.maxUses !== null && patch.maxUses < 1) {
    throw new PromoError('BAD_REQUEST', 'Los usos máximos deben ser al menos 1.');
  }
  if (patch.maxUses !== undefined && patch.maxUses !== null && patch.maxUses < current.usesCount) {
    throw new PromoError('BAD_REQUEST', `Ya se usó ${current.usesCount} veces; el máximo no puede ser menor.`);
  }
  const [row] = await db
    .update(promoCodes)
    .set({
      ...(patch.isActive !== undefined ? { isActive: patch.isActive } : {}),
      ...(patch.maxUses !== undefined ? { maxUses: patch.maxUses } : {}),
      ...(patch.expiresAt !== undefined ? { expiresAt: patch.expiresAt } : {}),
    })
    .where(eq(promoCodes.id, promoId))
    .returning();
  return row;
}

/** Delete a code nobody has used; used codes can only be switched off (orders point at them). */
export async function deletePromo(eventId: number, promoId: number): Promise<void> {
  const current = await requirePromo(eventId, promoId);
  const [{ n }] = await db
    .select({ n: sql<number>`count(*)`.mapWith(Number) })
    .from(orders)
    .where(eq(orders.promoCodeId, promoId));
  if (current.usesCount > 0 || n > 0) {
    throw new PromoError('CONFLICT', 'Este código ya se usó; desactívalo en lugar de eliminarlo.');
  }
  await db.delete(promoCodes).where(eq(promoCodes.id, promoId));
}
