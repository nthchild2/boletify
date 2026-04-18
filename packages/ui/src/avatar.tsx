import * as React from "react";
import { View, Image, Text, ViewProps, ImageProps } from "react-native";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps extends ViewProps {
  src?: string;
  initials?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-lg",
};

export function Avatar({
  src,
  initials,
  size = "md",
  className = "",
  ...props
}: AvatarProps) {
  const sizeClass = sizeStyles[size];

  if (src) {
    return (
      <Image
        source={{ uri: src }}
        className={`${sizeClass} rounded-full object-cover ${className}`}
        {...props as ImageProps}
      />
    );
  }

  return (
    <View
      className={`
        ${sizeClass}
        rounded-full
        bg-ink-700
        items-center justify-center
        ${className}
      `}
      {...props}
    >
      <Text className="text-ink-200 font-body font-semibold">
        {initials?.slice(0, 2).toUpperCase() || "?"}
      </Text>
    </View>
  );
}