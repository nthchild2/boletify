import * as React from "react";

export interface TicketArtifactEvent {
  title?: string;
  venue?: string;
  location?: string;
  /** Formatted date (e.g. "Sáb 17 may"). */
  date?: string;
  /** Access / door time (e.g. "21:00 hrs"). */
  access?: string;
  /** Section label. Default "GRAL A". */
  section?: string;
  /** Formatted price (mono, lime). */
  price?: string;
  /** Lineup / sub-line under the title. */
  lineup?: string;
  /** Ticket ID printed under the QR. Default "TCK · 0412 · 0091". */
  ticketId?: string;
}

/**
 * The signature glass ticket — a precious skeuomorphic artifact (the one
 * place paper grain + perforation are allowed). Stays dark-glass in both
 * themes.
 *
 * @startingPoint section="Events" subtitle="The signature glass ticket artifact" viewport="480x720"
 */
export interface TicketArtifactProps extends React.HTMLAttributes<HTMLDivElement> {
  event: TicketArtifactEvent;
  /** Real QR image src. Omit to render the decorative stand-in pattern. */
  qr?: string;
  className?: string;
}

export function TicketArtifact(props: TicketArtifactProps): JSX.Element;
