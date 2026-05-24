"use client";

/**
 * Web ThemeProvider — Brutal-Glass v2.0
 *
 * Three-state preference (light / dark / system) persisted to localStorage,
 * applied as `.dark` class on <html>. The provider also keeps a `data-theme`
 * attribute in sync for any CSS that wants to scope to an explicit theme
 * value (rather than the negative-space `:not(.dark)` selector).
 *
 * To prevent a flash of incorrect theme on first paint, render
 * <ThemeNoFlashScript /> inside <head> in app/layout.tsx. It runs the same
 * resolution synchronously before React hydrates.
 */

import * as React from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "boletify-theme";
const DARK_CLASS = "dark";
const ATTR = "data-theme";

interface ThemeContextValue {
  /** The user's explicit preference. */
  theme: ThemePreference;
  /** What's actually rendering right now (system → light or dark). */
  resolvedTheme: ResolvedTheme;
  /** Set the user preference. Persists to localStorage. */
  setTheme: (theme: ThemePreference) => void;
  /** Cycle preference: light → dark → system → light. */
  cycleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // localStorage may be blocked (privacy mode, sandboxed iframes); fall through.
  }
  return "system";
}

function applyTheme(resolved: ResolvedTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle(DARK_CLASS, resolved === "dark");
  root.setAttribute(ATTR, resolved);
  root.style.colorScheme = resolved;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: {
  children: React.ReactNode;
  defaultTheme?: ThemePreference;
}) {
  // Initialize from storage synchronously so the first paint matches the
  // no-flash script's decision. SSR returns the default; client overrides
  // immediately on mount via the layoutEffect below.
  const [theme, setThemeState] = React.useState<ThemePreference>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>(
    defaultTheme === "light" ? "light" : "dark",
  );

  // Hydrate from localStorage + OS pref on mount, before paint.
  React.useLayoutEffect(() => {
    const stored = readStoredPreference();
    setThemeState(stored);
    const resolved = stored === "system" ? getSystemTheme() : stored;
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []);

  // When preference changes, recompute resolved + apply.
  React.useEffect(() => {
    const resolved = theme === "system" ? getSystemTheme() : theme;
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, [theme]);

  // When theme === "system", listen for OS-level changes and live-update.
  React.useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const next: ResolvedTheme = e.matches ? "dark" : "light";
      setResolvedTheme(next);
      applyTheme(next);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = React.useCallback((next: ThemePreference) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore — preference will reset on reload, which is acceptable.
    }
  }, []);

  const cycleTheme = React.useCallback(() => {
    setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light");
  }, [theme, setTheme]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, cycleTheme }),
    [theme, resolvedTheme, setTheme, cycleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return ctx;
}

/**
 * Inline script rendered in <head> to apply the resolved theme before
 * React hydrates. Uses the same logic as the provider, in plain ES5 so it
 * runs in any browser before any module-script work begins.
 */
export function ThemeNoFlashScript() {
  const code = `(function(){try{var k=${JSON.stringify(STORAGE_KEY)};var p=localStorage.getItem(k);var t=(p==='light'||p==='dark')?p:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var d=document.documentElement;if(t==='dark'){d.classList.add(${JSON.stringify(DARK_CLASS)})}else{d.classList.remove(${JSON.stringify(DARK_CLASS)})}d.setAttribute(${JSON.stringify(ATTR)},t);d.style.colorScheme=t;}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
