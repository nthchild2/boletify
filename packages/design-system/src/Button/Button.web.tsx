import type { JSX } from 'react';
import clsx from 'clsx';
import { type ButtonProps, buttonClass } from './Button.shared';

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onPress,
  href,
  className,
  children,
  testID,
  accessibilityLabel,
}: ButtonProps): JSX.Element {
  const cls = clsx(buttonClass(variant, size, disabled || loading), className);
  const isDisabled = disabled || loading;

  if (href && !isDisabled) {
    return (
      <a
        href={href}
        className={cls}
        data-testid={testID}
        aria-label={accessibilityLabel}
        onClick={
          onPress
            ? (e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                onPress();
              }
            : undefined
        }
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type="button"
      className={cls}
      disabled={isDisabled}
      onClick={onPress}
      data-testid={testID}
      aria-label={accessibilityLabel}
    >
      {children}
    </button>
  );
}
