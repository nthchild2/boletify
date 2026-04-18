import * as React from "react";
import { View, Text, ViewProps } from "react-native";

export type BadgeVariant = "signal" | "rosa" | "oxblood" | "leaf" | "sun" | "cenote" | "ink";

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  signal: "bg-signal-500 text-signal-900",
  rosa: "bg-rosa-500 text-rosa-600",
  oxblood: "bg-oxblood-500 text-oxblood-400",
  leaf: "bg-leaf-500 text-leaf-500",
  sun: "bg-sun-500 text-sun-500",
  cenote: "bg-cenote-500 text-cenote-500",
  ink: "bg-ink-700 text-ink-200",
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
        px-2 py-0.5
        rounded-xs
        items-center justify-center
        ${className}
      `}
      {...props}
    >
      <Text className="text-label font-body">
        {children}
      </Text>
    </View>
  );
}