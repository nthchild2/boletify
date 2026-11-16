import * as React from "react";

export interface EventCardEvent {
  id?: string;
  /** Full event name. Falls back to the poster headline. */
  title?: string;
  /** Big poster headline (supports \n line breaks). Defaults to title. */
  posterTitle?: string;
  /** Organiser cover image URL (preferred — no stock photography). */
  posterImage?: string;
  /** CSS background used when there's no image (gradient poster fallback). */
  posterBackground?: string;
  /** Category chip (e.g. "INDIE"). Rendered as an ink Badge, top-right. */
  category?: string;
  /** Sale-state label (e.g. "EN VENTA", "AGOTADO"). Top-left Badge. */
  status?: string;
  /** Badge variant for the status. Default "signal". */
  statusVariant?: "signal" | "rosa" | "oxblood" | "leaf" | "sun" | "cenote" | "ink";
  /** Hide the status badge even if `status` is set. */
  showStatus?: boolean;
  /** Date string, already formatted (e.g. "SÁB 17 MAY"). Tabular mono. */
  date?: string;
  /** Time / access string (e.g. "21:00"). */
  access?: string;
  venue?: string;
  location?: string;
  /** Formatted price (e.g. "$450 MXN" or "GRATIS"). */
  price?: string;
  href?: string;
}

/**
 * Buyer-facing poster card: 4:5 organiser image under a brick-shadow chassis.
 *
 * @startingPoint section="Events" subtitle="Poster event card with sale badge" viewport="360x520"
 */
export interface EventCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  event: EventCardEvent;
  /** Overrides event.href / derived /events/:id. */
  href?: string;
  className?: string;
}

export function EventCard(props: EventCardProps): JSX.Element;
