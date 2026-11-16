import * as React from "react";

/**
 * Edge-to-edge looping brand band in display type, middle-dot separated.
 * Decorative; respects reduced-motion.
 */
export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Words to loop. Array (preferred) or a "·"-separated string. */
  items: string[] | string;
  className?: string;
}

export function Marquee(props: MarqueeProps): JSX.Element;
