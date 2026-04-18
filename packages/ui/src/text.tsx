import * as React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";

export type TextVariant =
  // Display
  | "display-2xl"
  | "display-xl"
  | "display-lg"
  | "display-md"
  | "display-sm"
  // Heading
  | "heading-lg"
  | "heading-md"
  | "heading-sm"
  // Body
  | "body-lg"
  | "body-md"
  | "body-sm"
  // Special
  | "label"
  | "caption"
  | "overline"
  // Mono
  | "mono-md"
  | "mono-sm";

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  children?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<TextVariant, string> = {
  // Display
  "display-2xl": "font-display text-display-2xl leading-[112px] tracking-[-4%]",
  "display-xl": "font-display text-display-xl leading-[88px] tracking-[-3.5%]",
  "display-lg": "font-display text-display-lg leading-[68px] tracking-[-3%]",
  "display-md": "font-display text-display-md leading-[56px] tracking-[-2.5%]",
  "display-sm": "font-display text-display-sm leading-[44px] tracking-[-2%]",
  // Heading
  "heading-lg": "font-body text-heading-lg leading-[36px] tracking-[-1.5%] font-bold",
  "heading-md": "font-body text-heading-md leading-[30px] tracking-[-1%] font-bold",
  "heading-sm": "font-body text-heading-sm leading-[24px] tracking-[-0.5%] font-semibold",
  // Body
  "body-lg": "font-body text-body-lg leading-[28px]",
  "body-md": "font-body text-body-md leading-[24px]",
  "body-sm": "font-body text-body-sm leading-[22px]",
  // Special
  "label": "font-body text-label leading-[16px] tracking-[4%] uppercase font-semibold",
  "caption": "font-body text-caption leading-[16px] tracking-[2%]",
  "overline": "font-body text-overline leading-[16px] tracking-[16%] uppercase font-bold",
  // Mono
  "mono-md": "font-mono text-mono-md leading-[20px]",
  "mono-sm": "font-mono text-mono-sm leading-[16px]",
};

export function Text({
  variant = "body-md",
  className = "",
  children,
  ...props
}: TextProps) {
  return (
    <RNText
      className={`${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </RNText>
  );
}