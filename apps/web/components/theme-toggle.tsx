"use client";

/**
 * Two-state theme toggle (Light / Dark) — web.
 *
 * Defaults to the device setting on first load. Clicking the opposite
 * segment overrides the OS preference and persists to localStorage.
 *
 * Brutal-Glass styling: 1px border, brick-shadow active pill,
 * signal-lime fill that flips to ink-on-bone in light mode.
 */

import * as React from "react";
import { useTheme, type ResolvedTheme } from "../lib/theme";

const OPTIONS: ReadonlyArray<{
  value: ResolvedTheme;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    value: "light",
    label: "Claro",
    icon: (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="3.25" />
        <path d="M8 1.5v1.5M8 13v1.5M14.5 8H13M3 8H1.5M12.6 3.4l-1.05 1.05M4.45 11.55L3.4 12.6M12.6 12.6l-1.05-1.05M4.45 4.45L3.4 3.4" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Oscuro",
    icon: (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M9.5 1.2A6.4 6.4 0 0 0 14.8 9 6.4 6.4 0 1 1 7 1.2c.83 0 1.65.16 2.5 0z" />
      </svg>
    ),
  },
];

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Tema visual"
      className={`inline-flex items-center gap-0 rounded-md border border-border-strong bg-surface p-0.5 ${className}`}
    >
      {OPTIONS.map((opt) => {
        const active = resolvedTheme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => setTheme(opt.value)}
            className={[
              "inline-flex h-7 w-7 items-center justify-center rounded-sm transition duration-fast ease-motion-fast focus-visible:outline-none focus-visible:shadow-glow-focus",
              active
                ? "bg-primary text-primary-fg shadow-brick-sm"
                : "text-fg-muted hover:text-fg",
            ].join(" ")}
          >
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
}
