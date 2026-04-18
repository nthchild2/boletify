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
  variant?: "primary" | "accent" | "secondary" | "ghost" | "glass" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const variantStyles = {
  primary: "bg-signal-500 border-2 border-ink-1000 shadow-brick-md",
  accent: "bg-rosa-500 border-2 border-ink-1000 shadow-brick-md",
  secondary: "bg-transparent border border-ink-700",
  ghost: "bg-transparent border border-transparent",
  glass: "bg-white/5 border border-white/10 rounded-xl shadow-glass-md",
  danger: "bg-oxblood-500 border-2 border-ink-1000 shadow-brick-md",
};

const sizeStyles = {
  sm: "h-9 px-3.5",
  md: "h-[52px] px-6",
  lg: "h-[52px] px-8",
  xl: "h-16 px-8",
};

const textStyles = {
  primary: "text-ink-950",
  accent: "text-ink-950",
  secondary: "text-bone-50",
  ghost: "text-bone-50",
  glass: "text-bone-50",
  danger: "text-bone-50",
};

const textSizeStyles = {
  sm: "text-[12px] font-semibold tracking-[0.04em]",
  md: "text-label font-semibold tracking-[0.04em]",
  lg: "text-label font-semibold tracking-[0.04em]",
  xl: "font-display text-[18px] font-bold tracking-[-0.01em] normal-case",
};

export function Button({
  text,
  onPress,
  variant = "primary",
  size = "md",
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? "opacity-50 shadow-none" : ""}
        rounded-md
        items-center justify-center
        flex-row
        ${className}
      `}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      {...props}
    >
      {children ? (
        children
      ) : (
        <Text
          className={`
            ${textStyles[variant]}
            ${textSizeStyles[size]}
            font-body uppercase
          `}
        >
          {text}
        </Text>
      )}
    </Pressable>
  );
}
