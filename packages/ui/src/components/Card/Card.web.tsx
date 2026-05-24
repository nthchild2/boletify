import * as React from "react";

export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "ghost";
  shadow?: "none" | "brick-sm" | "brick-md" | "brick-lg";
  /**
   * Inner padding. Defaults to "md" (p-5). Use "none" for edge-to-edge
   * content like full-bleed images.
   */
  padding?: CardPadding;
}

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const variantStyles = {
  default: "bg-surface border border-border",
  bordered: "bg-surface border border-border-strong",
  ghost: "bg-transparent border border-transparent",
} as const;

const shadowStyles = {
  none: "",
  "brick-sm": "shadow-brick-sm",
  "brick-md": "shadow-brick-md",
  "brick-lg": "shadow-brick-lg",
} as const;

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  variant = "default",
  shadow = "brick-md",
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg text-fg",
        paddingStyles[padding],
        variantStyles[variant],
        shadowStyles[shadow],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
