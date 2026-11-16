import * as React from "react";

/**
 * Brutal surface panel that casts a hard brick-shadow. Utility radius (14px).
 * Becomes a pressable link when given an href (or `interactive`).
 */
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "bordered" | "ghost";
  /** Brick-shadow weight. Default "brick-md". */
  shadow?: "none" | "brick-sm" | "brick-md" | "brick-lg";
  /** Render as a link; makes the card pressable (hover-lift, press-absorb). */
  href?: string;
  /** Force interactive press behaviour without a link. */
  interactive?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function Card(props: CardProps): JSX.Element;
