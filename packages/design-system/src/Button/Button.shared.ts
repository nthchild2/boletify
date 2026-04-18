import type { ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  href?: string;
  className?: string;
  children?: ReactNode;
  testID?: string;
  accessibilityLabel?: string;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white active:opacity-80',
  secondary: 'bg-transparent border border-primary text-primary active:opacity-80',
  ghost: 'bg-transparent text-primary active:opacity-80',
  danger: 'bg-error text-white active:opacity-80',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  xl: 'h-14 px-8 text-lg',
};

const BASE = 'flex flex-row items-center justify-center rounded-md font-medium';
const DISABLED = 'opacity-50';

export function buttonClass(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  disabled = false,
): string {
  return [BASE, VARIANT_CLASS[variant], SIZE_CLASS[size], disabled && DISABLED]
    .filter(Boolean)
    .join(' ');
}

export function buttonTextClass(variant: ButtonVariant = 'primary'): string {
  // Native needs a Text child with the colour applied; web inherits from button.
  if (variant === 'secondary' || variant === 'ghost') return 'text-primary font-medium';
  return 'text-white font-medium';
}
