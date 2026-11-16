import * as React from "react";

/**
 * Overline-type status / category pill. Brand-color variants are theme-fixed;
 * `ink` is a translucent glass chip that adapts.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Default "ink". Brand colors carry semantic meaning — see prompt. */
  variant?: "signal" | "rosa" | "oxblood" | "leaf" | "sun" | "cenote" | "ink";
  children?: React.ReactNode;
  className?: string;
}

export function Badge(props: BadgeProps): JSX.Element;
