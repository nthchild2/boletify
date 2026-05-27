import * as React from "react";
import { View, ViewProps, type ViewStyle } from "react-native";
import { brickShadows } from "../../shadows";

export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends ViewProps {
  variant?: "default" | "bordered" | "ghost";
  shadow?: "none" | "brick-sm" | "brick-md" | "brick-lg";
  /**
   * Inner padding. Defaults to "md" (p-5). Use "none" for edge-to-edge
   * content like full-bleed images — passing `p-0` via className isn't
   * reliable, since both `p-5` and `p-0` target the same Tailwind property
   * at the same specificity and NativeWind's source order isn't guaranteed.
   */
  padding?: CardPadding;
  children?: React.ReactNode;
  className?: string;
}

const variantStyles = {
  default: "bg-surface border border-border",
  bordered: "bg-surface border border-border-strong",
  ghost: "bg-transparent",
};

const shadowNativeStyles: Record<string, ViewStyle> = {
  none: brickShadows.none,
  "brick-sm": brickShadows.sm,
  "brick-md": brickShadows.md,
  "brick-lg": brickShadows.lg,
};

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
  className = "",
  children,
  style,
  ...props
}: CardProps) {
  return (
    <View
      className={`
        ${variantStyles[variant]}
        rounded-lg
        ${paddingStyles[padding]}
        ${className}
      `}
      style={[shadowNativeStyles[shadow], style]}
      {...props}
    >
      {children}
    </View>
  );
}
