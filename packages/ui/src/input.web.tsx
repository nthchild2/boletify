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
        <label className="mb-2 block font-body text-overline uppercase text-ink-300">
          {label}
        </label>
      ) : null}
      <input
        type={type}
        className={cn(
          "h-12 w-full rounded-md border px-4 font-body text-body-md text-bone-50 placeholder:text-ink-400 focus:border-signal-500 focus:outline-none focus:shadow-glow-focus",
          glass
            ? "border-white/10 bg-white/5 shadow-glass-sm backdrop-blur-glass-sm"
            : "border-ink-700 bg-ink-850",
          error && "border-oxblood-500",
          className,
        )}
        {...props}
      />
      {error || hint ? (
        <p className={cn("mt-2 font-body text-caption", error ? "text-oxblood-400" : "text-ink-400")}>
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}
