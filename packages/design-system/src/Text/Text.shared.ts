import type { ReactNode } from 'react';

export type TextVariant =
  | 'display-lg' | 'display-md'
  | 'heading-lg' | 'heading-md' | 'heading-sm'
  | 'body-lg' | 'body-md' | 'body-sm'
  | 'label' | 'caption' | 'overline';

export interface TextProps {
  variant?: TextVariant;
  className?: string;
  children?: ReactNode;
  numberOfLines?: number;
  testID?: string;
}

const VARIANT_CLASS: Record<TextVariant, string> = {
  'display-lg': 'text-5xl font-extrabold leading-tight tracking-tight',
  'display-md': 'text-4xl font-extrabold leading-tight tracking-tight',
  'heading-lg': 'text-2xl font-extrabold leading-tight tracking-tight',
  'heading-md': 'text-xl font-bold leading-snug',
  'heading-sm': 'text-lg font-semibold leading-snug',
  'body-lg': 'text-lg font-medium leading-relaxed',
  'body-md': 'text-base font-medium leading-normal',
  'body-sm': 'text-sm font-medium leading-normal',
  label: 'text-sm font-semibold',
  caption: 'text-xs font-semibold',
  overline: 'text-xs font-bold uppercase tracking-widest',
};

export function variantClass(variant?: TextVariant): string {
  return variant ? VARIANT_CLASS[variant] : '';
}
