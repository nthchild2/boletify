/**
 * Buyer-facing fee calculation (docs/04-technical-architecture.md § 8.4).
 *
 * Pure and dependency-free so the checkout UI and the server compute the
 * exact same numbers. All amounts are MXN cents.
 *
 * Promo codes (PRO-001): the discount comes off the ticket price, and the
 * service fee is then charged on each ticket's discounted price (docs/02 § 9
 * doesn't specify this, so this is the documented choice):
 * - percentage: every ticket gets that % off (rounded to the cent);
 * - flat: an amount off the whole order, split across the tickets in
 *   proportion to their price, never below MXN 0.
 * The flat MXN 10 part of the fee is waived when the discounted ticket is
 * MXN 100 or less, like any cheap ticket.
 */

export const SERVICE_FEE_PERCENT = 0.05; // 5 %
export const SERVICE_FEE_FLAT = 1000; // MXN 10.00
export const LOW_PRICE_THRESHOLD = 10000; // flat fee waived at or below MXN 100.00

export type FeeLine = { price: number; quantity: number };

export type Discount = { type: 'percentage'; value: number } | { type: 'flat'; value: number };

export type OrderAmounts = {
  /** Ticket prices before any discount. */
  subtotal: number;
  /** Total taken off by the promo code (0 without one). */
  discount: number;
  serviceFee: number;
  /** subtotal - discount + serviceFee: what the buyer pays. */
  total: number;
  ticketCount: number;
};

/** Service fee for one ticket: 5 % + MXN 10 (flat part waived for cheap tickets). */
export function serviceFeePerTicket(price: number): number {
  if (price <= 0) return 0;
  const flat = price <= LOW_PRICE_THRESHOLD ? 0 : SERVICE_FEE_FLAT;
  return Math.round(price * SERVICE_FEE_PERCENT) + flat;
}

/** Discount per ticket (same order as `prices`). Sums to the order discount exactly. */
export function allocateDiscount(prices: number[], discount: Discount): number[] {
  if (discount.type === 'percentage') {
    const pct = Math.min(100, Math.max(0, discount.value));
    return prices.map((p) => Math.min(p, Math.round((p * pct) / 100)));
  }

  const subtotal = prices.reduce((a, b) => a + b, 0);
  const total = Math.min(Math.max(0, Math.round(discount.value)), subtotal);
  if (total === 0 || subtotal === 0) return prices.map(() => 0);

  // Largest-remainder split so the parts add up to the exact amount.
  const exact = prices.map((p) => (total * p) / subtotal);
  const parts = exact.map((x) => Math.floor(x));
  let left = total - parts.reduce((a, b) => a + b, 0);
  const order = exact
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i);
  for (const { i } of order) {
    if (left === 0) break;
    if (parts[i] < prices[i]) {
      parts[i] += 1;
      left -= 1;
    }
  }
  return parts;
}

/** Totals for a cart, optionally with a promo code. The buyer pays the service fee on top. */
export function calculateOrderAmounts(lines: FeeLine[], discount?: Discount | null): OrderAmounts {
  const prices: number[] = [];
  for (const { price, quantity } of lines) {
    for (let i = 0; i < quantity; i++) prices.push(price);
  }
  const perTicket = discount ? allocateDiscount(prices, discount) : prices.map(() => 0);

  let subtotal = 0;
  let discountTotal = 0;
  let serviceFee = 0;
  prices.forEach((price, i) => {
    subtotal += price;
    discountTotal += perTicket[i];
    serviceFee += serviceFeePerTicket(price - perTicket[i]);
  });

  return {
    subtotal,
    discount: discountTotal,
    serviceFee,
    total: subtotal - discountTotal + serviceFee,
    ticketCount: prices.length,
  };
}
