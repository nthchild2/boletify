/** Promo code rules that don't touch the database (PRO-001/002). */

import { z } from 'zod';
import type { Discount } from './fees';

/** Codes are case-insensitive: stored and compared in upper case. */
export function normalizePromoCode(raw: string): string {
  return raw.trim().toUpperCase();
}

export const PROMO_CODE_PATTERN = /^[A-Z0-9_-]{3,30}$/;

export type PromoStatus = 'active' | 'inactive' | 'expired' | 'exhausted';

export type PromoState = {
  isActive: boolean;
  expiresAt: Date | null;
  maxUses: number | null;
  usesCount: number;
};

export function promoStatus(p: PromoState, now = new Date()): PromoStatus {
  if (!p.isActive) return 'inactive';
  if (p.expiresAt && p.expiresAt <= now) return 'expired';
  if (p.maxUses !== null && p.usesCount >= p.maxUses) return 'exhausted';
  return 'active';
}

export function toDiscount(p: { discountType: string; discountValue: number }): Discount {
  return p.discountType === 'percentage'
    ? { type: 'percentage', value: p.discountValue }
    : { type: 'flat', value: p.discountValue };
}

/** Organiser input for a new code. discountValue: % (1-100) or MXN cents for flat. */
export const promoCreateSchema = z
  .object({
    eventId: z.number().int().positive(),
    code: z
      .string()
      .transform(normalizePromoCode)
      .pipe(z.string().regex(PROMO_CODE_PATTERN, 'Usa 3 a 30 letras, números, guiones o guiones bajos.')),
    discountType: z.enum(['percentage', 'flat']),
    discountValue: z.number().int().positive('El descuento debe ser mayor a 0.'),
    maxUses: z.number().int().positive('Los usos máximos deben ser al menos 1.').nullable(),
    expiresAt: z
      .union([z.string().min(1), z.date()])
      .nullable()
      .transform((v) => (v === null ? null : new Date(v)))
      .refine((d) => d === null || !Number.isNaN(d.getTime()), 'Fecha de expiración inválida.'),
  })
  .superRefine((v, ctx) => {
    if (v.discountType === 'percentage' && v.discountValue > 100) {
      ctx.addIssue({ code: 'custom', path: ['discountValue'], message: 'El porcentaje va de 1 a 100.' });
    }
    if (v.discountType === 'flat' && v.discountValue > 10_000_00) {
      ctx.addIssue({ code: 'custom', path: ['discountValue'], message: 'El descuento máximo es $10,000 MXN.' });
    }
  });

export type PromoCreateInput = z.input<typeof promoCreateSchema>;
