import * as React from "react";

export interface ButtonProps {
  text?: string;
  onPress?: () => void;
  href?: string;
  variant?: "primary" | "accent" | "secondary" | "ghost" | "glass" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const variantStyles = {
  primary:
    "border-[1.5px] border-ink-1000 bg-signal-500 text-ink-950 shadow-brick-md hover:bg-signal-400 active:translate-x-[6px] active:translate-y-[6px] active:shadow-none",
  accent:
    "border-[1.5px] border-ink-1000 bg-rosa-500 text-ink-950 shadow-brick-md hover:bg-rosa-400 active:translate-x-[6px] active:translate-y-[6px] active:shadow-none",
  secondary:
    "border border-ink-700 bg-transparent text-bone-50 hover:border-signal-500 hover:text-signal-500",
  ghost: "border border-transparent bg-transparent text-bone-50 hover:text-signal-500",
  glass:
    "rounded-xl border border-white/10 bg-white/5 text-bone-50 shadow-glass-md backdrop-blur-glass-sm hover:bg-white/10",
  danger:
    "border-[1.5px] border-ink-1000 bg-oxblood-500 text-bone-50 shadow-brick-md hover:bg-oxblood-400 active:translate-x-[6px] active:translate-y-[6px] active:shadow-none",
} as const;

const sizeStyles = {
  sm: "h-9 px-3.5 text-[12px] font-semibold tracking-[0.04em]",
  md: "h-[52px] px-6 text-label font-semibold tracking-[0.04em]",
  lg: "h-[52px] px-8 text-label font-semibold tracking-[0.04em]",
  xl: "h-16 px-8 font-display text-[18px] font-bold normal-case tracking-[-0.01em]",
} as const;

const baseClassName =
  "inline-flex items-center justify-center gap-2 rounded-md font-body uppercase transition duration-instant ease-motion-instant focus-visible:outline-none focus-visible:shadow-glow-focus";

export function Button({
  text,
  onPress,
  href,
  variant = "primary",
  size = "md",
  disabled = false,
  children,
  className,
}: ButtonProps) {
  const classes = cn(
    baseClassName,
    variantStyles[variant],
    sizeStyles[size],
    disabled && "pointer-events-none opacity-50 shadow-none",
    className,
  );

  if (href && !disabled) {
    return (
      <a href={href} className={classes} onClick={onPress}>
        {children ?? text}
      </a>
    );
  }

  return (
    <button type="button" className={classes} disabled={disabled} onClick={onPress}>
      {children ?? text}
    </button>
  );
}
