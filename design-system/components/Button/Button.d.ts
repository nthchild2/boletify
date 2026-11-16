import * as React from "react";

/**
 * Boletify Brutal-Glass button. Brutal variants carry a brick-shadow that is
 * absorbed on press; the label ramps weight on hover. `glass` is the soft
 * translucent exception for use over imagery.
 *
 * @startingPoint section="Core" subtitle="Brick-shadow CTA with press absorb" viewport="700x200"
 */
export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  /** Button label (alternative to children). */
  text?: string;
  /** Render as an anchor pointing here instead of a <button>. */
  href?: string;
  /** Visual treatment. Default "primary". */
  variant?: "primary" | "accent" | "secondary" | "ghost" | "glass" | "danger";
  /** Size. "xl" switches the label to display type. Default "md". */
  size?: "sm" | "md" | "lg" | "xl";
  /** Disabled state — drops shadow, halves opacity. */
  disabled?: boolean;
  /** Native button type when not an anchor. */
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler;
  children?: React.ReactNode;
  className?: string;
}

export function Button(props: ButtonProps): JSX.Element;
