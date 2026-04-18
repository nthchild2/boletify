import * as React from "react";
import { View, ViewProps } from "react-native";

export interface GlassCardProps extends ViewProps {
  intensity?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  className?: string;
}

const intensityStyles = {
  sm: "bg-ink-850/60 backdrop-blur-[20px] shadow-glass-sm",
  md: "bg-ink-850/60 backdrop-blur-[32px] shadow-glass-md",
  lg: "bg-ink-850/60 backdrop-blur-[40px] shadow-glass-lg",
};

export function GlassCard({
  intensity = "md",
  className = "",
  children,
  ...props
}: GlassCardProps) {
  return (
    <View
      className={`
        ${intensityStyles[intensity]}
        rounded-xl
        border border-ink-700/30
        p-4
        ${className}
      `}
      style={{ 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
      }}
      {...props}
    >
      {children}
    </View>
  );
}