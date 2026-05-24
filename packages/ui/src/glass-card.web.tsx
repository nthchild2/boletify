import * as React from "react";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "sm" | "md" | "lg";
}

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const intensityStyles = {
  sm: "bg-glass-tint shadow-glass-sm backdrop-blur-glass-sm",
  md: "bg-glass-tint shadow-glass-md backdrop-blur-glass-md",
  lg: "bg-glass-tint shadow-glass-lg backdrop-blur-glass-lg",
} as const;

export function GlassCard({
  intensity = "md",
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-[28px] border border-glass-edge p-5 text-fg",
        intensityStyles[intensity],
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-glass-edge" />
      {children}
    </div>
  );
}
