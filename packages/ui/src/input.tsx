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
  containerClassName?: string;
}

export function Input({
  label,
  error,
  containerClassName = "",
  className = "",
  ...props
}: InputProps) {
  return (
    <View className={containerClassName}>
      {label && (
        <Text className="text-body-sm text-ink-200 mb-2 font-body">
          {label}
        </Text>
      )}
      <TextInput
        className={`
          bg-ink-800
          text-ink-100
          font-body text-body-md
          px-4 py-3
          rounded-md
          border border-ink-600
          placeholder:text-ink-400
          ${error ? "border-oxblood-500" : ""}
          ${className}
        `}
        placeholderTextColor="#787891"
        {...props}
      />
      {error && (
        <Text className="text-caption text-oxblood-500 mt-1 font-body">
          {error}
        </Text>
      )}
    </View>
  );
}