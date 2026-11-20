import { describe, expect, it } from 'vitest';
import { allocateDiscount, calculateOrderAmounts, serviceFeePerTicket } from './fees';

describe('serviceFeePerTicket', () => {
  it('charges 5% + MXN 10 on tickets above MXN 100', () => {
    expect(serviceFeePerTicket(33000)).toBe(1650 + 1000); // $330 -> $26.50
    expect(serviceFeePerTicket(35000)).toBe(1750 + 1000); // $350 -> $27.50
  });

  it('waives the flat MXN 10 at or below MXN 100', () => {
    expect(serviceFeePerTicket(8000)).toBe(400); // $80 -> $4
    expect(serviceFeePerTicket(10000)).toBe(500); // exactly $100 -> 5% only
    expect(serviceFeePerTicket(10001)).toBe(500 + 1000); // just above -> flat applies
  });

  it('charges nothing for free tickets', () => {
    expect(serviceFeePerTicket(0)).toBe(0);
  });

  it('rounds the percentage to whole cents', () => {
    expect(serviceFeePerTicket(15999)).toBe(Math.round(15999 * 0.05) + 1000);
  });
});

describe('calculateOrderAmounts', () => {
  it('matches the worked example in docs/04 (2 x $330)', () => {
    expect(calculateOrderAmounts([{ price: 33000, quantity: 2 }])).toEqual({
      subtotal: 66000,
      discount: 0,
      serviceFee: 5300,
      total: 71300,
      ticketCount: 2,
    });
  });

  it('matches the end-to-end test order BOL-JC8BQBYG', () => {
    const amounts = calculateOrderAmounts([
      { price: 8000, quantity: 2 },
      { price: 35000, quantity: 3 },
      { price: 90000, quantity: 1 },
    ]);
    expect(amounts).toEqual({ subtotal: 211000, discount: 0, serviceFee: 14550, total: 225550, ticketCount: 6 });
  });

  it('ignores lines with zero or negative quantity', () => {
    expect(
      calculateOrderAmounts([
        { price: 35000, quantity: 0 },
        { price: 35000, quantity: -2 },
        { price: 8000, quantity: 1 },
      ]),
    ).toEqual({ subtotal: 8000, discount: 0, serviceFee: 400, total: 8400, ticketCount: 1 });
  });

  it('returns zeros for an empty cart', () => {
    expect(calculateOrderAmounts([])).toEqual({ subtotal: 0, discount: 0, serviceFee: 0, total: 0, ticketCount: 0 });
  });
});

describe('promo code discounts', () => {
  it('percentage: takes the % off every ticket and charges the fee on the discounted price', () => {
    // 2 x $350 with 20% off -> 2 x $280; fee per ticket 5% of 280 + $10 = $24
    expect(calculateOrderAmounts([{ price: 35000, quantity: 2 }], { type: 'percentage', value: 20 })).toEqual({
      subtotal: 70000,
      discount: 14000,
      serviceFee: 4800,
      total: 70000 - 14000 + 4800,
      ticketCount: 2,
    });
  });

  it('percentage: waives the flat fee when the discounted ticket drops to MXN 100 or less', () => {
    // $120 with 20% off -> $96: fee is 5% only ($4.80)
    const a = calculateOrderAmounts([{ price: 12000, quantity: 1 }], { type: 'percentage', value: 20 });
    expect(a).toMatchObject({ discount: 2400, serviceFee: 480, total: 9600 + 480 });
  });

  it('percentage: 100% makes the order free, with no fee', () => {
    expect(calculateOrderAmounts([{ price: 35000, quantity: 3 }], { type: 'percentage', value: 100 })).toMatchObject({
      discount: 105000,
      serviceFee: 0,
      total: 0,
    });
  });

  it('flat: takes the amount off the order once (docs/02 § 9: AMIGOS50 -> MXN 50 off)', () => {
    // 2 x $350 with $50 off -> $25 off each -> 2 x $325; fee 2 x ($16.25 + $10)
    expect(calculateOrderAmounts([{ price: 35000, quantity: 2 }], { type: 'flat', value: 5000 })).toEqual({
      subtotal: 70000,
      discount: 5000,
      serviceFee: 2 * (1625 + 1000),
      total: 70000 - 5000 + 2 * 2625,
      ticketCount: 2,
    });
  });

  it('flat: never goes below MXN 0', () => {
    expect(calculateOrderAmounts([{ price: 8000, quantity: 1 }], { type: 'flat', value: 50000 })).toMatchObject({
      discount: 8000,
      serviceFee: 0,
      total: 0,
    });
  });

  it('flat: splits in proportion to price and adds up to the exact amount', () => {
    const prices = [8000, 35000, 35000, 90000];
    const parts = allocateDiscount(prices, { type: 'flat', value: 3333 });
    expect(parts.reduce((a, b) => a + b, 0)).toBe(3333);
    parts.forEach((d, i) => expect(d).toBeLessThanOrEqual(prices[i]));
    expect(parts[3]).toBeGreaterThan(parts[0]); // pricier ticket gets more of the discount
  });

  it('no discount and a zero discount give the same result', () => {
    const lines = [{ price: 35000, quantity: 2 }];
    expect(calculateOrderAmounts(lines, { type: 'flat', value: 0 })).toEqual(calculateOrderAmounts(lines));
    expect(calculateOrderAmounts(lines, null)).toEqual(calculateOrderAmounts(lines));
  });
});
