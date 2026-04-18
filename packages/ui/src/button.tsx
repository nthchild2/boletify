import * as React from "react";
import {
  GestureResponderEvent,
  Text,
  Pressable,
  ViewProps,
  TextProps,
} from "react-native";

export interface ButtonProps extends ViewProps {
  text?: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  className?: string;
}

const variantStyles = {
  primary: "bg-signal-500 active:bg-signal-600",
  secondary: "bg-ink-800 active:bg-ink-700",
  ghost: "bg-transparent active:bg-ink-800",
};

const sizeStyles = {
  sm: "px-3 py-2",
  md: "px-6 py-3.5",
  lg: "px-8 py-4",
};

export function Button({
  text,
  onPress,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        rounded-md
        items-center justify-center
        ${className}
      `}
      onPress={onPress}
      {...props}
    >
      {children ? (
        children
      ) : (
        <Text className="text-ink-950 font-body text-body-md font-semibold">
          {text}
        </Text>
      )}
    </Pressable>
  );
}