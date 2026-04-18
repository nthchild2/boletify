import * as React from "react";
import { View, Text, ViewProps } from "react-native";

export type BadgeVariant = "signal" | "rosa" | "oxblood" | "leaf" | "sun" | "cenote" | "ink";

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  signal: "bg-signal-500 border border-ink-1000 text-ink-950",
  rosa: "bg-rosa-500 border border-ink-1000 text-ink-950",
  oxblood: "bg-oxblood-500 border border-ink-1000 text-bone-50",
  leaf: "bg-leaf-500 border border-ink-1000 text-ink-950",
  sun: "bg-sun-500 border border-ink-1000 text-ink-950",
  cenote: "bg-cenote-500 border border-ink-1000 text-ink-950",
  ink: "bg-[rgba(8,8,12,0.72)] border border-white/10 text-ink-100",
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
      <Text className="font-body text-overline uppercase">
        {children}
      </Text>
    </View>
  );
}
