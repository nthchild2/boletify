import * as React from "react";
import {
  TextInput,
  View,
  Text,
  TextInputProps,
} from "react-native";
import { glassShadows } from "../../shadows";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  glass?: boolean;
  containerClassName?: string;
}

// Placeholder color — fg-subtle (Slate light #6E6E8A)
const PLACEHOLDER_COLOR = "#6E6E8A";

export function Input({
  label,
  error,
  hint,
  glass = false,
  containerClassName = "",
  className = "",
  placeholderTextColor,
  ...props
}: InputProps) {
  return (
    <View className={containerClassName}>
      {label && (
        <Text className="mb-2 font-body text-overline uppercase text-fg-muted">
          {label}
        </Text>
      )}
      <TextInput
        className={`
          ${glass ? "bg-glass-tint border-glass-edge" : "bg-surface-sunken border-border-strong"}
          h-12
          text-fg
          font-body text-body-md
          px-4
          rounded-md
          border
          placeholder:text-fg-subtle
          ${error ? "border-danger" : ""}
          ${className}
        `}
        style={glass ? glassShadows.sm : undefined}
        placeholderTextColor={placeholderTextColor ?? PLACEHOLDER_COLOR}
        {...props}
      />
      {(error || hint) && (
        <Text className={`mt-2 font-body text-caption ${error ? "text-danger" : "text-fg-subtle"}`}>
          {error ?? hint}
        </Text>
      )}
    </View>
  );
}
