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
    "border-[1.5px] border-border-ink bg-primary text-primary-fg shadow-brick-md hover:bg-primary-hover active:translate-x-[6px] active:translate-y-[6px] active:shadow-none",
  accent:
    "border-[1.5px] border-border-ink bg-accent text-accent-fg shadow-brick-md hover:bg-accent-hover active:translate-x-[6px] active:translate-y-[6px] active:shadow-none",
  secondary:
    "border border-border-strong bg-transparent text-fg hover:border-primary hover:text-primary",
  ghost:
    "border border-transparent bg-transparent text-fg hover:text-primary",
  glass:
    "rounded-xl border border-glass-edge bg-glass-tint text-fg shadow-glass-md backdrop-blur-glass-sm hover:bg-surface/30",
  danger:
    "border-[1.5px] border-border-ink bg-danger text-danger-fg shadow-brick-md hover:bg-danger-hover active:translate-x-[6px] active:translate-y-[6px] active:shadow-none",
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
