import * as React from "react";
import type {
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TextInputProps,
} from "react-native";

// Same public API as Input.tsx (React Native TextInputProps), rendered as a DOM
// <input>. RN-only props are translated to their HTML equivalents here and are
// never spread onto the DOM element.
export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  glass?: boolean;
  containerClassName?: string;
}

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type HTMLInputType = React.InputHTMLAttributes<HTMLInputElement>["type"];
type HTMLInputMode = React.HTMLAttributes<HTMLInputElement>["inputMode"];
type HTMLEnterKeyHint = React.InputHTMLAttributes<HTMLInputElement>["enterKeyHint"];

function keyboardTypeToHtml(
  keyboardType: TextInputProps["keyboardType"],
): { type?: HTMLInputType; inputMode?: HTMLInputMode } {
  switch (keyboardType) {
    case "email-address":
      return { type: "email", inputMode: "email" };
    case "phone-pad":
      return { type: "tel", inputMode: "tel" };
    case "url":
      return { type: "url", inputMode: "url" };
    case "web-search":
      return { type: "search", inputMode: "search" };
    case "number-pad":
    case "numeric":
      return { inputMode: "numeric" };
    case "decimal-pad":
      return { inputMode: "decimal" };
    default:
      return {};
  }
}

const enterKeyHints: Partial<Record<NonNullable<TextInputProps["returnKeyType"]>, HTMLEnterKeyHint>> = {
  done: "done",
  go: "go",
  next: "next",
  search: "search",
  send: "send",
  previous: "previous",
};

export function Input({
  label,
  error,
  hint,
  glass = false,
  containerClassName,
  className,
  value,
  defaultValue,
  placeholder,
  onChangeText,
  onChange,
  onFocus,
  onBlur,
  onSubmitEditing,
  secureTextEntry,
  keyboardType,
  inputMode,
  autoCapitalize,
  autoCorrect,
  autoComplete,
  autoFocus,
  editable,
  readOnly,
  maxLength,
  returnKeyType,
  enterKeyHint,
  nativeID,
  id,
  testID,
  accessibilityLabel,
  "aria-label": ariaLabel,
}: InputProps) {
  const generatedId = React.useId();
  const inputId = id ?? nativeID ?? generatedId;
  const fromKeyboard = keyboardTypeToHtml(keyboardType);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    if (onChange) {
      // Mirror react-native-web: expose the new text as nativeEvent.text.
      (event.nativeEvent as unknown as TextInputChangeEventData).text = text;
      onChange(event as unknown as NativeSyntheticEvent<TextInputChangeEventData>);
    }
    onChangeText?.(text);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (onSubmitEditing && event.key === "Enter" && !event.nativeEvent.isComposing) {
      onSubmitEditing({
        nativeEvent: { text: event.currentTarget.value },
      } as Parameters<NonNullable<TextInputProps["onSubmitEditing"]>>[0]);
    }
  };

  return (
    <div className={containerClassName}>
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-2 block font-body text-overline uppercase text-fg-muted"
        >
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        data-testid={testID}
        aria-label={ariaLabel ?? accessibilityLabel}
        aria-invalid={error ? true : undefined}
        type={secureTextEntry ? "password" : (fromKeyboard.type ?? "text")}
        inputMode={inputMode ?? fromKeyboard.inputMode}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={onFocus as unknown as React.FocusEventHandler<HTMLInputElement>}
        onBlur={onBlur as unknown as React.FocusEventHandler<HTMLInputElement>}
        onKeyDown={onSubmitEditing ? handleKeyDown : undefined}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect === undefined ? undefined : autoCorrect ? "on" : "off"}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        readOnly={readOnly ?? (editable === false ? true : undefined)}
        maxLength={maxLength}
        enterKeyHint={enterKeyHint ?? (returnKeyType ? enterKeyHints[returnKeyType] : undefined)}
        className={cn(
          "h-12 w-full rounded-md border px-4 font-body text-body-md text-fg placeholder:text-fg-subtle focus:border-primary focus:outline-none focus:shadow-glow-focus",
          glass
            ? "border-glass-edge bg-glass-tint shadow-glass-sm backdrop-blur-glass-sm"
            : "border-border-strong bg-surface-sunken",
          error && "border-danger",
          className,
        )}
      />
      {error || hint ? (
        <p className={cn("mt-2 font-body text-caption", error ? "text-danger" : "text-fg-subtle")}>
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}
