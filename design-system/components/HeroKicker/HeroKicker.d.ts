import * as React from "react";

/**
 * Overline pill with a glowing signal-lime dot — marks the top of a hero or
 * section. The dot is a brand marker, not a state indicator.
 */
export interface HeroKickerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export function HeroKicker(props: HeroKickerProps): JSX.Element;
