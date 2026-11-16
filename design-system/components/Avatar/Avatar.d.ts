import * as React from "react";

/**
 * Round identity chip — photo when `src` is set, otherwise up-to-two
 * uppercased initials on a raised surface. Always circular with a glass-edge
 * hairline + glass-sm shadow.
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image URL. When present, renders the photo instead of initials. */
  src?: string;
  /** Fallback initials (sliced to 2, uppercased). */
  initials?: string;
  /** Default "md". */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Accessible label / img alt. Falls back to initials. */
  alt?: string;
  className?: string;
}

export function Avatar(props: AvatarProps): JSX.Element;
