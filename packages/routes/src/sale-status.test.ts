import { describe, expect, it } from 'vitest';
import { deriveSaleStatus, formatMxnPrice, isSaleOpen } from './sale-status';

const now = new Date('2026-11-20T12:00:00Z');
const past = '2026-11-01T00:00:00Z';
const future = '2027-03-12T00:00:00Z';
const base = {
  status: 'published',
  now,
  startDate: future,
  saleStartDate: past,
  saleEndDate: future,
  totalQuantity: 300,
  totalSold: 10,
  minPriceCents: 35000,
};

const label = (overrides: Partial<typeof base> & Record<string, unknown>) =>
  deriveSaleStatus({ ...base, ...overrides }).label;

describe('deriveSaleStatus', () => {
  it('is EN VENTA for a published event on sale with stock', () => {
    expect(deriveSaleStatus(base)).toEqual({ label: 'EN VENTA', variant: 'signal', hidden: false });
  });

  it('applies the documented priority order', () => {
    expect(label({ status: 'cancelled', totalSold: 300 })).toBe('CANCELADO');
    expect(label({ status: 'deleted' })).toBe('CANCELADO');
    expect(label({ status: 'ended' })).toBe('FINALIZADO');
    expect(label({ endDate: past })).toBe('FINALIZADO');
    expect(label({ saleStartDate: future })).toBe('PRÓXIMAMENTE');
    expect(label({ saleEndDate: past })).toBe('VENTA CERRADA');
    expect(label({ totalSold: 300 })).toBe('AGOTADO');
    expect(label({ minPriceCents: 0 })).toBe('GRATIS');
    expect(label({ totalSold: 285 })).toBe('ÚLTIMOS'); // 15 left < 20
  });

  it('flags ÚLTIMOS below 10% remaining even with more than 20 left', () => {
    expect(label({ totalQuantity: 1000, totalSold: 905 })).toBe('ÚLTIMOS'); // 95 left, 9.5%
    expect(label({ totalQuantity: 1000, totalSold: 900 })).toBe('EN VENTA'); // 100 left, 10%
  });

  it('hides the badge for organiser-only states', () => {
    expect(deriveSaleStatus({ ...base, status: 'draft' })).toMatchObject({ hidden: true, label: '' });
    expect(deriveSaleStatus({ ...base, status: null })).toMatchObject({ hidden: true });
  });

  it('is case-insensitive and tolerates missing or invalid dates', () => {
    expect(label({ status: 'PUBLISHED' })).toBe('EN VENTA');
    expect(label({ saleStartDate: null as unknown as string, saleEndDate: 'not a date' })).toBe('EN VENTA');
  });
});

describe('isSaleOpen', () => {
  it('only opens paid checkout for EN VENTA and ÚLTIMOS', () => {
    expect(isSaleOpen({ label: 'EN VENTA' })).toBe(true);
    expect(isSaleOpen({ label: 'ÚLTIMOS' })).toBe(true);
    for (const l of ['GRATIS', 'AGOTADO', 'VENTA CERRADA', 'PRÓXIMAMENTE', 'FINALIZADO', 'CANCELADO', '']) {
      expect(isSaleOpen({ label: l })).toBe(false);
    }
  });
});

describe('formatMxnPrice', () => {
  it('formats cents as MXN', () => {
    expect(formatMxnPrice(98000)).toBe('$980 MXN');
    expect(formatMxnPrice(159950)).toBe('$1,599.50 MXN');
    expect(formatMxnPrice(0)).toBe('GRATIS');
    expect(formatMxnPrice(null)).toBe('POR CONFIRMAR');
  });
});
