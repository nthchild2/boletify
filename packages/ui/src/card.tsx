import * as React from "react";
import { View, ViewProps } from "react-native";

export interface CardProps extends ViewProps {
  variant?: "default" | "bordered" | "ghost";
  shadow?: "none" | "brick-sm" | "brick-md" | "brick-lg";
  children?: React.ReactNode;
  className?: string;
}

const variantStyles = {
  default: "bg-ink-900",
  bordered: "bg-ink-900 border border-ink-700",
  ghost: "bg-transparent",
};

const shadowStyles = {
  none: "",
  "brick-sm": "shadow-brick-sm",
  "brick-md": "shadow-brick-md",
  "brick-lg": "shadow-brick-lg",
};

export function Card({
  variant = "default",
  shadow = "none",
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
        p-4
        ${className}
      `}
      {...props}
    >
      {children}
    </View>
  );
}