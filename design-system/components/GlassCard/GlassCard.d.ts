import * as React from "react";

/**
 * Translucent, backdrop-blurred soft-radius panel with layered glass shadow
 * and inner catch-light. For precious / floating surfaces over imagery/mesh.
 */
export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Blur + shadow weight. Default "md". */
  intensity?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  className?: string;
}

export function GlassCard(props: GlassCardProps): JSX.Element;
