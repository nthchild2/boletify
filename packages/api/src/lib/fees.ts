/**
 * Buyer-facing fee calculation (docs/04-technical-architecture.md § 8.4).
 *
 * Pure and dependency-free so the checkout UI and the server compute the
 * exact same numbers. All amounts are MXN cents.
 */

export const SERVICE_FEE_PERCENT = 0.05; // 5 %
export const SERVICE_FEE_FLAT = 1000; // MXN 10.00
export const LOW_PRICE_THRESHOLD = 10000; // flat fee waived at or below MXN 100.00

export type FeeLine = { price: number; quantity: number };

export type OrderAmounts = {
  subtotal: number;
  serviceFee: number;
  total: number;
  ticketCount: number;
};

/** Service fee for one ticket: 5 % + MXN 10 (flat part waived for cheap tickets). */
export function serviceFeePerTicket(price: number): number {
  if (price <= 0) return 0;
  const flat = price <= LOW_PRICE_THRESHOLD ? 0 : SERVICE_FEE_FLAT;
  return Math.round(price * SERVICE_FEE_PERCENT) + flat;
}

/** Totals for a cart. The buyer pays the service fee on top of the ticket price. */
export function calculateOrderAmounts(lines: FeeLine[]): OrderAmounts {
  let subtotal = 0;
  let serviceFee = 0;
  let ticketCount = 0;
  for (const { price, quantity } of lines) {
    if (quantity <= 0) continue;
    subtotal += price * quantity;
    serviceFee += serviceFeePerTicket(price) * quantity;
    ticketCount += quantity;
  }
  return { subtotal, serviceFee, total: subtotal + serviceFee, ticketCount };
}
