import * as React from "react";

export interface StatItem {
  label: string;
  /** Pre-formatted value — keep numbers tabular ($1,247,830, 8,421, T+3). */
  value: string;
  /** Optional small delta in the primary hue (e.g. "+12.4%"). */
  delta?: string;
}

/**
 * Dashboard stat row: big tabular-mono numbers with overline labels.
 *
 * @startingPoint section="Data" subtitle="Tabular-mono dashboard stat row" viewport="900x160"
 */
export interface StatStripProps extends React.HTMLAttributes<HTMLDListElement> {
  stats: StatItem[];
  className?: string;
}

export function StatStrip(props: StatStripProps): JSX.Element;
