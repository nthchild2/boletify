import * as React from "react";

export type BadgeVariant =
  | "signal" | "rosa" | "oxblood" | "leaf" | "sun" | "cenote" | "ink";

export interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children?: React.ReactNode;
}

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const variantStyles: Record<BadgeVariant, string> = {
  signal: "border border-border-ink bg-signal-500 text-ink-950",
  rosa: "border border-border-ink bg-rosa-500 text-ink-950",
  oxblood: "border border-border-ink bg-oxblood-500 text-bone-50",
  leaf: "border border-border-ink bg-leaf-500 text-ink-950",
  sun: "border border-border-ink bg-sun-500 text-ink-950",
  cenote: "border border-border-ink bg-cenote-500 text-ink-950",
  ink: "border border-border bg-nav-tint text-fg backdrop-blur-[12px]",
};

export function Badge({ variant = "ink", className = "", children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-xs px-2.5 py-1 font-body text-overline uppercase",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
