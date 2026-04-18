import { Pressable, Text } from 'react-native';
import clsx from 'clsx';
import { type ButtonProps, buttonClass, buttonTextClass } from './Button.shared';

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onPress,
  className,
  children,
  testID,
  accessibilityLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={clsx(buttonClass(variant, size, isDisabled), className)}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
      {typeof children === 'string' ? (
        <Text className={buttonTextClass(variant)}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
