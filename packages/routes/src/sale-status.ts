/**
 * deriveSaleStatus — turns the raw event + ticket-tier state coming from
 * the API into a single user-facing badge label + Brand-Glass variant.
 *
 * Lives in @boletify/routes because both apps already depend on this
 * package and it's a thin pure function with no UI deps.
 *
 * Priority order (first match wins):
 *   1. cancelled / deleted   → CANCELADO (oxblood)
 *   2. ended (or past end)   → FINALIZADO (ink, neutral)
 *   3. not published         → hidden (organiser preview)
 *   4. sale not yet open     → PRÓXIMAMENTE (sun)
 *   5. sale window closed    → VENTA CERRADA (ink)
 *   6. all tiers sold out    → AGOTADO (oxblood)
 *   7. min ticket price = 0  → GRATIS (signal)
 *   8. < 10 % remaining or
 *      < 20 tickets left     → ÚLTIMOS (rosa)
 *   9. otherwise             → EN VENTA (signal)
 *
 * The "hidden" flag lets the consumer drop the badge entirely instead of
 * showing the noisy default ("PUBLISHED") — see the previous regression
 * where the raw DB enum was leaking onto buyer cards.
 */

export type SaleStatusVariant =
  | "signal"
  | "rosa"
  | "oxblood"
  | "leaf"
  | "sun"
  | "cenote"
  | "ink";

export interface SaleStatus {
  /** Spanish label to render inside the Badge. Empty string when hidden. */
  label: string;
  /** Maps directly to @repo/ui Badge `variant` prop. */
  variant: SaleStatusVariant;
  /** True when the consumer should not render a badge at all. */
  hidden: boolean;
}

/**
 * Inputs accept Date | string | number | null so callers don't have to
 * pre-parse — DB drivers, JSON payloads, and direct Date instances all
 * land here with the same shape.
 */
export interface SaleStatusInput {
  /** events.status enum from the schema. */
  status: string | null | undefined;
  /** events.start_date — when the show begins. */
  startDate?: Date | string | number | null;
  /** events.end_date — when the show ends. */
  endDate?: Date | string | number | null;
  /** Earliest sale_start_date across the event's ticket tiers. */
  saleStartDate?: Date | string | number | null;
  /** Latest sale_end_date across the event's ticket tiers. */
  saleEndDate?: Date | string | number | null;
  /** Sum of `quantity` across the event's ticket tiers. */
  totalQuantity?: number | null;
  /** Sum of `sold` across the event's ticket tiers. */
  totalSold?: number | null;
  /** Cheapest tier price in MXN cents (0 means free). */
  minPriceCents?: number | null;
  /** Optional clock injection for testing. Defaults to `new Date()`. */
  now?: Date;
}

/** Threshold below which a published event flips to "ÚLTIMOS". */
const LOW_INVENTORY_RATIO = 0.1;
const LOW_INVENTORY_ABSOLUTE = 20;

function toDate(value: SaleStatusInput["startDate"]): Date | null {
  if (value === null || value === undefined) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

const HIDDEN: SaleStatus = { label: "", variant: "ink", hidden: true };

export function deriveSaleStatus(input: SaleStatusInput): SaleStatus {
  const now = input.now ?? new Date();
  const status = (input.status ?? "").toLowerCase();

  if (status === "cancelled" || status === "deleted") {
    return { label: "CANCELADO", variant: "oxblood", hidden: false };
  }

  const endDate = toDate(input.endDate);
  if (status === "ended" || (endDate !== null && endDate < now)) {
    return { label: "FINALIZADO", variant: "ink", hidden: false };
  }

  // Anything that isn't a published, non-cancelled, non-ended event is
  // organiser-side state (draft / archived / etc.) — don't render anything
  // on a buyer-facing card.
  if (status !== "published") {
    return HIDDEN;
  }

  const saleStartDate = toDate(input.saleStartDate);
  if (saleStartDate !== null && saleStartDate > now) {
    return { label: "PRÓXIMAMENTE", variant: "sun", hidden: false };
  }

  const saleEndDate = toDate(input.saleEndDate);
  if (saleEndDate !== null && saleEndDate < now) {
    return { label: "VENTA CERRADA", variant: "ink", hidden: false };
  }

  const totalQuantity = input.totalQuantity ?? 0;
  const totalSold = input.totalSold ?? 0;

  if (totalQuantity > 0 && totalSold >= totalQuantity) {
    return { label: "AGOTADO", variant: "oxblood", hidden: false };
  }

  if (input.minPriceCents === 0) {
    return { label: "GRATIS", variant: "signal", hidden: false };
  }

  if (totalQuantity > 0) {
    const remaining = totalQuantity - totalSold;
    const ratio = remaining / totalQuantity;
    if (ratio < LOW_INVENTORY_RATIO || remaining < LOW_INVENTORY_ABSOLUTE) {
      return { label: "ÚLTIMOS", variant: "rosa", hidden: false };
    }
  }

  return { label: "EN VENTA", variant: "signal", hidden: false };
}

/**
 * Formats a MXN cents value as a display string. Returns "GRATIS" for 0
 * and "POR CONFIRMAR" for null/undefined so call sites don't have to
 * branch separately.
 */
export function formatMxnPrice(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "POR CONFIRMAR";
  if (cents === 0) return "GRATIS";
  const pesos = cents / 100;
  return `$${pesos.toLocaleString("es-MX", {
    minimumFractionDigits: pesos % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })} MXN`;
}
