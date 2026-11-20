import { describe, expect, it } from 'vitest';
import { calculateOrderAmounts, serviceFeePerTicket } from './fees';

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
    expect(amounts).toEqual({ subtotal: 211000, serviceFee: 14550, total: 225550, ticketCount: 6 });
  });

  it('ignores lines with zero or negative quantity', () => {
    expect(
      calculateOrderAmounts([
        { price: 35000, quantity: 0 },
        { price: 35000, quantity: -2 },
        { price: 8000, quantity: 1 },
      ]),
    ).toEqual({ subtotal: 8000, serviceFee: 400, total: 8400, ticketCount: 1 });
  });

  it('returns zeros for an empty cart', () => {
    expect(calculateOrderAmounts([])).toEqual({ subtotal: 0, serviceFee: 0, total: 0, ticketCount: 0 });
  });
});
