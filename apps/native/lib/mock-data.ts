/**
 * Shared types for mobile event data.
 *
 * Previously this file contained hardcoded mock events. All data now
 * comes from the API (`/api/events`). Only types remain.
 */

import type { SaleStatusVariant } from "@boletify/routes";

export interface MobileEvent {
  id: string;
  title: string;
  eyebrow: string;
  venue: string;
  location: string;
  date: string;
  access: string;
  price: string;
  /** Buyer-facing label rendered in the status badge ("EN VENTA", etc.). */
  status: string;
  /** Brand variant for the badge — derived via @boletify/routes. */
  statusVariant?: SaleStatusVariant;
  /** When false the EventTile drops the status badge entirely. */
  showStatus?: boolean;
  category: string;
  lineup: string;
  description: string;
  coverImageUrl?: string;
}
