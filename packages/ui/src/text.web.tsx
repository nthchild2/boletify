import * as React from "react";

export type TextVariant =
  | "display-2xl"
  | "display-xl"
  | "display-lg"
  | "display-md"
  | "display-sm"
  | "heading-lg"
  | "heading-md"
  | "heading-sm"
  | "body-lg"
  | "body-md"
  | "body-sm"
  | "label"
  | "caption"
  | "overline"
  | "mono-md"
  | "mono-sm";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  variant?: TextVariant;
}

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const variantStyles: Record<TextVariant, string> = {
  "display-2xl": "font-display text-display-2xl leading-[0.875] tracking-[-0.04em]",
  "display-xl": "font-display text-display-xl leading-[0.917] tracking-[-0.035em]",
  "display-lg": "font-display text-display-lg leading-[0.944] tracking-[-0.03em]",
  "display-md": "font-display text-display-md leading-[1] tracking-[-0.025em]",
  "display-sm": "font-display text-display-sm leading-[1.1] tracking-[-0.02em]",
  "heading-lg": "font-display text-heading-lg leading-[1.125] tracking-[-0.015em] font-bold",
  "heading-md": "font-display text-heading-md leading-[1.25] tracking-[-0.01em] font-bold",
  "heading-sm": "font-display text-heading-sm leading-[1.33] tracking-[-0.005em] font-semibold",
  "body-lg": "font-body text-body-lg leading-[1.55]",
  "body-md": "font-body text-body-md leading-[1.5]",
  "body-sm": "font-body text-body-sm leading-[1.55]",
  label: "font-body text-label uppercase tracking-[0.04em] font-semibold",
  caption: "font-body text-caption tracking-[0.02em]",
  overline: "font-body text-overline uppercase tracking-[0.16em] font-bold",
  "mono-md": "font-mono text-mono-md",
  "mono-sm": "font-mono text-mono-sm uppercase tracking-[0.08em]",
};

const tagMap: Partial<Record<TextVariant, keyof JSX.IntrinsicElements>> = {
  "display-2xl": "h1",
  "display-xl": "h1",
  "display-lg": "h1",
  "display-md": "h1",
  "display-sm": "h2",
  "heading-lg": "h2",
  "heading-md": "h3",
  "heading-sm": "h4",
  "body-lg": "p",
  "body-md": "p",
  "body-sm": "p",
  caption: "p",
};

export function Text({
  as,
  variant = "body-md",
  className,
  children,
  ...props
}: TextProps) {
  const Component = as ?? tagMap[variant] ?? "span";

  return (
    <Component className={cn("text-bone-50", variantStyles[variant], className)} {...props}>
      {children}
    </Component>
  );
}
