import * as React from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  src?: string;
  initials?: string;
  size?: AvatarSize;
  className?: string;
}

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-lg",
};

export function Avatar({ src, initials, size = "md", className, ...props }: AvatarProps) {
  const sizeClassName = sizeStyles[size];
  if (src) {
    return (
      <img
        src={src}
        alt={initials ?? "avatar"}
        className={cn(
          "rounded-full border border-glass-edge bg-surface-raised object-cover shadow-glass-sm",
          sizeClassName,
          className,
        )}
      />
    );
  }
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-glass-edge bg-surface-raised font-body font-semibold text-fg-secondary shadow-glass-sm",
        sizeClassName,
        className,
      )}
      {...props}
    >
      {initials?.slice(0, 2).toUpperCase() || "?"}
    </div>
  );
}
