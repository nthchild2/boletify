import * as React from "react";
import { View, Text, ViewProps } from "react-native";

export type BadgeVariant = "signal" | "rosa" | "oxblood" | "leaf" | "sun" | "cenote" | "ink";

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}

// Brand-color badges keep their hue across themes (the lime is always lime),
// but text color flips for legibility on the colored fill.
const variantStyles: Record<BadgeVariant, string> = {
  signal: "bg-signal-500 border border-border-ink",
  rosa: "bg-rosa-500 border border-border-ink",
  oxblood: "bg-oxblood-500 border border-border-ink",
  leaf: "bg-leaf-500 border border-border-ink",
  sun: "bg-sun-500 border border-border-ink",
  cenote: "bg-cenote-500 border border-border-ink",
  // The "ink" variant is meant to look like a chip inset on the page —
  // adapts to the active theme's surface tint.
  ink: "bg-nav-tint border border-border",
};

const textStyles: Record<BadgeVariant, string> = {
  signal: "text-ink-950",
  rosa: "text-ink-950",
  oxblood: "text-bone-50",
  leaf: "text-ink-950",
  sun: "text-ink-950",
  cenote: "text-ink-950",
  ink: "text-fg",
};

export function Badge({
  variant = "ink",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <View
      className={`
        ${variantStyles[variant]}
        px-2.5 py-1
        rounded-xs
        items-center justify-center
        ${className}
      `}
      {...props}
    >
      <Text className={`font-body text-overline uppercase ${textStyles[variant]}`}>
        {children}
      </Text>
    </View>
  );
}
