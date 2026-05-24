import * as React from "react";
import {
  GestureResponderEvent,
  Text,
  Pressable,
  ViewProps,
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
  primary: "bg-primary border-2 border-border-ink shadow-brick-md",
  accent: "bg-accent border-2 border-border-ink shadow-brick-md",
  secondary: "bg-transparent border border-border-strong",
  ghost: "bg-transparent border border-transparent",
  glass: "bg-glass-tint border border-glass-edge rounded-xl shadow-glass-md",
  danger: "bg-danger border-2 border-border-ink shadow-brick-md",
};

const sizeStyles = {
  sm: "h-9 px-3.5",
  md: "h-[52px] px-6",
  lg: "h-[52px] px-8",
  xl: "h-16 px-8",
};

const textStyles = {
  primary: "text-primary-fg",
  accent: "text-accent-fg",
  secondary: "text-fg",
  ghost: "text-fg",
  glass: "text-fg",
  danger: "text-danger-fg",
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
