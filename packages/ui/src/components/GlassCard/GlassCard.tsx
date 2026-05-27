import * as React from "react";
import { View, ViewProps } from "react-native";
import { glassShadows } from "../../shadows";

export interface GlassCardProps extends ViewProps {
  intensity?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  className?: string;
}

const intensityStyles = {
  sm: "bg-glass-tint backdrop-blur-[20px]",
  md: "bg-glass-tint backdrop-blur-[32px]",
  lg: "bg-glass-tint backdrop-blur-[40px]",
};

export function GlassCard({
  intensity = "md",
  className = "",
  children,
  style,
  ...props
}: GlassCardProps) {
  return (
    <View
      className={`
        ${intensityStyles[intensity]}
        rounded-xl
        border border-glass-edge
        p-5
        ${className}
      `}
      style={[glassShadows[intensity], style]}
      {...props}
    >
      <View className="absolute inset-x-0 top-0 h-px bg-glass-edge" />
      {children}
    </View>
  );
}
