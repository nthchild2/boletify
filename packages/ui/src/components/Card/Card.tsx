import * as React from "react";
import { View, ViewProps } from "react-native";

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

const shadowStyles = {
  none: "",
  "brick-sm": "shadow-brick-sm",
  "brick-md": "shadow-brick-md",
  "brick-lg": "shadow-brick-lg",
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
  ...props
}: CardProps) {
  return (
    <View
      className={`
        ${variantStyles[variant]}
        ${shadowStyles[shadow]}
        rounded-lg
        ${paddingStyles[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </View>
  );
}
