/**
 * Native ThemeProvider — Brutal-Glass v2.0 (vars-based)
 *
 * Instead of toggling a `.dark` class (which relies on the flaky
 * Appearance.setColorScheme() → listener → observable chain), this
 * provider uses NativeWind's `vars()` API to directly set every
 * `--color-*` CSS variable on a root View.
 *
 * When the user flips the toggle, we swap the full set of CSS variable
 * values. Every descendant using Tailwind utilities like `bg-bg`,
 * `text-fg`, `border-border`, etc. picks up the new values immediately
 * because those utilities reference `rgb(var(--color-bg) / <alpha>)`.
 *
 * This approach works identically on physical devices, Expo Go, and the
 * iOS simulator — no dependency on Appearance listeners.
 */

import * as React from "react";
import { Appearance, View } from "react-native";
import { vars } from "nativewind";
import {
  themeColors,
  themeCSSVars,
  nextTheme,
  STORAGE_KEY,
  type ThemePreference,
  type ResolvedTheme,
  type ThemePalette,
  type ThemeContextValue,
} from "@repo/ui";

// Re-export types so existing imports from "../lib/theme" keep working.
export type { ThemePreference, ResolvedTheme, ThemePalette, ThemeContextValue };
export { themeColors };

// ---------------------------------------------------------------------------
// Async-storage helper (defensive — works even if native module is missing)
// ---------------------------------------------------------------------------
type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

let _storagePromise: Promise<StorageLike | null> | null = null;
function getStorage(): Promise<StorageLike | null> {
  if (_storagePromise) return _storagePromise;
  _storagePromise = (async () => {
    try {
      const mod = require("@react-native-async-storage/async-storage");
      const AsyncStorage: StorageLike = mod?.default ?? mod;
      await AsyncStorage.getItem(STORAGE_KEY);
      return AsyncStorage;
    } catch (err) {
      if (__DEV__) {
        console.warn(
          "[theme] AsyncStorage unavailable — preference won't persist.",
          err,
        );
      }
      return null;
    }
  })();
  return _storagePromise;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const ThemeContext = React.createContext<ThemeContextValue | null>(null);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getSystemTheme(): ResolvedTheme {
  return Appearance.getColorScheme() === "light" ? "light" : "dark";
}

function resolve(pref: ThemePreference): ResolvedTheme {
  return pref === "system" ? getSystemTheme() : pref;
}

// ---------------------------------------------------------------------------
// ThemeProvider
// ---------------------------------------------------------------------------
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<ThemePreference>("system");
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>(
    getSystemTheme,
  );

  // Ref so the Appearance listener always sees the latest preference.
  const themeRef = React.useRef(theme);
  themeRef.current = theme;

  // ------------------------------------------------------------------
  // setTheme: the public setter.
  // ------------------------------------------------------------------
  const setTheme = React.useCallback((next: ThemePreference) => {
    setThemeState(next);
    const resolved = resolve(next);
    setResolvedTheme(resolved);
    // Update status bar style.
    try { Appearance.setColorScheme(resolved); } catch {}
    // Persist (fire-and-forget).
    getStorage().then((s) => s?.setItem(STORAGE_KEY, next).catch(() => {}));
  }, []);

  const cycleTheme = React.useCallback(() => {
    setTheme(nextTheme(themeRef.current));
  }, [setTheme]);

  // ------------------------------------------------------------------
  // Hydrate from storage on mount.
  // ------------------------------------------------------------------
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const storage = await getStorage();
      if (!storage || cancelled) return;
      try {
        const stored = await storage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (stored === "light" || stored === "dark" || stored === "system") {
          setThemeState(stored);
          const resolved = resolve(stored);
          setResolvedTheme(resolved);
          try { Appearance.setColorScheme(resolved); } catch {}
        }
      } catch {
        /* keep default */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ------------------------------------------------------------------
  // Follow OS theme changes when preference is "system".
  // ------------------------------------------------------------------
  React.useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeRef.current !== "system") return;
      const next: ResolvedTheme = colorScheme === "light" ? "light" : "dark";
      setResolvedTheme((prev) => (prev === next ? prev : next));
    });
    return () => sub.remove();
  }, []);

  // ------------------------------------------------------------------
  // Build the vars() style for the current resolved theme.
  // This is what actually makes NativeWind utilities see the right colors.
  // ------------------------------------------------------------------
  const themeVarsStyle = React.useMemo(
    () => vars(themeCSSVars[resolvedTheme]),
    [resolvedTheme],
  );

  // ------------------------------------------------------------------
  // Context value.
  // ------------------------------------------------------------------
  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, cycleTheme }),
    [theme, resolvedTheme, setTheme, cycleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1 }, themeVarsStyle]}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------
export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return ctx;
}

export function useThemeColors(): ThemePalette {
  const { resolvedTheme } = useTheme();
  return themeColors[resolvedTheme];
}
