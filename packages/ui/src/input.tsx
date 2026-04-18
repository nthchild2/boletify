import * as React from "react";
import {
  TextInput,
  View,
  Text,
  TextInputProps,
  ViewProps,
} from "react-native";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  glass?: boolean;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  hint,
  glass = false,
  containerClassName = "",
  className = "",
  ...props
}: InputProps) {
  return (
    <View className={containerClassName}>
      {label && (
        <Text className="mb-2 font-body text-overline uppercase text-ink-300">
          {label}
        </Text>
      )}
      <TextInput
        className={`
          ${glass ? "bg-white/5 border-white/10 shadow-glass-sm" : "bg-ink-850 border-ink-700"}
          h-12
          text-bone-50
          font-body text-body-md
          px-4
          rounded-md
          border
          placeholder:text-ink-400
          ${error ? "border-oxblood-500" : ""}
          ${className}
        `}
        placeholderTextColor="#787891"
        {...props}
      />
      {(error || hint) && (
        <Text className={`mt-2 font-body text-caption ${error ? "text-oxblood-400" : "text-ink-400"}`}>
          {error ?? hint}
        </Text>
      )}
    </View>
  );
}
