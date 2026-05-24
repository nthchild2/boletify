import * as React from "react";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  glass?: boolean;
  containerClassName?: string;
}

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function Input({
  label,
  error,
  hint,
  glass = false,
  containerClassName,
  className,
  type,
  ...props
}: InputProps) {
  return (
    <div className={containerClassName}>
      {label ? (
        <label className="mb-2 block font-body text-overline uppercase text-fg-muted">
          {label}
        </label>
      ) : null}
      <input
        type={type}
        className={cn(
          "h-12 w-full rounded-md border px-4 font-body text-body-md text-fg placeholder:text-fg-subtle focus:border-primary focus:outline-none focus:shadow-glow-focus",
          glass
            ? "border-glass-edge bg-glass-tint shadow-glass-sm backdrop-blur-glass-sm"
            : "border-border-strong bg-surface-sunken",
          error && "border-danger",
          className,
        )}
        {...props}
      />
      {error || hint ? (
        <p className={cn("mt-2 font-body text-caption", error ? "text-danger" : "text-fg-subtle")}>
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}
