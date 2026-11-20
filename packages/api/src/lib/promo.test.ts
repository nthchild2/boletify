import { describe, expect, it } from 'vitest';
import { normalizePromoCode, promoCreateSchema, promoStatus, toDiscount } from './promo';

const now = new Date('2026-11-20T12:00:00Z');
const base = { isActive: true, expiresAt: null, maxUses: null, usesCount: 0 };

describe('promoStatus', () => {
  it('is active by default', () => expect(promoStatus(base, now)).toBe('active'));
  it('is inactive when switched off', () => expect(promoStatus({ ...base, isActive: false }, now)).toBe('inactive'));
  it('expires at the expiry time', () => {
    expect(promoStatus({ ...base, expiresAt: new Date('2026-11-20T12:00:00Z') }, now)).toBe('expired');
    expect(promoStatus({ ...base, expiresAt: new Date('2026-11-20T12:00:01Z') }, now)).toBe('active');
  });
  it('is exhausted once uses reach the maximum', () => {
    expect(promoStatus({ ...base, maxUses: 2, usesCount: 1 }, now)).toBe('active');
    expect(promoStatus({ ...base, maxUses: 2, usesCount: 2 }, now)).toBe('exhausted');
  });
});

describe('promo codes', () => {
  it('normalises case and spaces', () => expect(normalizePromoCode('  amigos50 ')).toBe('AMIGOS50'));

  it('maps rows to discounts', () => {
    expect(toDiscount({ discountType: 'percentage', discountValue: 20 })).toEqual({ type: 'percentage', value: 20 });
    expect(toDiscount({ discountType: 'flat', discountValue: 5000 })).toEqual({ type: 'flat', value: 5000 });
  });
});

describe('promoCreateSchema', () => {
  const ok = { eventId: 1, code: 'amigos50', discountType: 'flat' as const, discountValue: 5000, maxUses: 100, expiresAt: null };

  it('accepts a valid code and upper-cases it', () => {
    expect(promoCreateSchema.parse(ok).code).toBe('AMIGOS50');
  });

  it.each(['ab', 'con espacio', 'ÑANDÚ', 'x'.repeat(31), 'amigos!'])('rejects code %j', (code) => {
    expect(promoCreateSchema.safeParse({ ...ok, code }).success).toBe(false);
  });

  it('limits percentages to 1-100', () => {
    expect(promoCreateSchema.safeParse({ ...ok, discountType: 'percentage', discountValue: 100 }).success).toBe(true);
    expect(promoCreateSchema.safeParse({ ...ok, discountType: 'percentage', discountValue: 101 }).success).toBe(false);
    expect(promoCreateSchema.safeParse({ ...ok, discountType: 'percentage', discountValue: 0 }).success).toBe(false);
  });

  it('requires positive uses when a maximum is set', () => {
    expect(promoCreateSchema.safeParse({ ...ok, maxUses: 0 }).success).toBe(false);
    expect(promoCreateSchema.safeParse({ ...ok, maxUses: null }).success).toBe(true);
  });
});
