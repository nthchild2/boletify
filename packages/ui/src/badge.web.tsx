import * as React from "react";

export type BadgeVariant =
  | "signal"
  | "rosa"
  | "oxblood"
  | "leaf"
  | "sun"
  | "cenote"
  | "ink";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const variantStyles: Record<BadgeVariant, string> = {
  signal: "border border-ink-1000 bg-signal-500 text-ink-950",
  rosa: "border border-ink-1000 bg-rosa-500 text-ink-950",
  oxblood: "border border-ink-1000 bg-oxblood-500 text-bone-50",
  leaf: "border border-ink-1000 bg-leaf-500 text-ink-950",
  sun: "border border-ink-1000 bg-sun-500 text-ink-950",
  cenote: "border border-ink-1000 bg-cenote-500 text-ink-950",
  ink: "border border-white/10 bg-[rgba(8,8,12,0.72)] text-ink-100 backdrop-blur-[12px]",
};

export function Badge({
  variant = "ink",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-xs px-2.5 py-1 font-body text-overline uppercase",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
