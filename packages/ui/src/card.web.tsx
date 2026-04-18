import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "ghost";
  shadow?: "none" | "brick-sm" | "brick-md" | "brick-lg";
}

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const variantStyles = {
  default: "bg-ink-900 border border-ink-800",
  bordered: "bg-ink-900 border border-ink-700",
  ghost: "bg-transparent border border-transparent",
} as const;

const shadowStyles = {
  none: "",
  "brick-sm": "shadow-brick-sm",
  "brick-md": "shadow-brick-md",
  "brick-lg": "shadow-brick-lg",
} as const;

export function Card({
  variant = "default",
  shadow = "brick-md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-5 text-bone-50",
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
