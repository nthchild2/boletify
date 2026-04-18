import * as React from "react";
import { View, ViewProps } from "react-native";

export interface GlassCardProps extends ViewProps {
  intensity?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  className?: string;
}

const intensityStyles = {
  sm: "bg-white/5 backdrop-blur-[20px] shadow-glass-sm",
  md: "bg-white/5 backdrop-blur-[32px] shadow-glass-md",
  lg: "bg-white/10 backdrop-blur-[40px] shadow-glass-lg",
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
        border border-white/10
        p-5
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
      <View className="absolute inset-x-0 top-0 h-px bg-white/20" />
      {children}
    </View>
  );
}
