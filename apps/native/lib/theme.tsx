/**
 * Native ThemeProvider — Brutal-Glass v2.0
 *
 * Mirrors the web provider in apps/web/lib/theme.tsx: three-state preference
 * (light / dark / system), persisted to AsyncStorage when available, applied
 * via NativeWind's colorScheme controller. NativeWind handles live OS-following
 * automatically when set to "system".
 *
 * Resolved theme (light/dark — what's actually rendering) is exposed for
 * components that need to drive imperative colors (StatusBar, Stack header
 * tints, native modals, etc.) where Tailwind classes can't reach.
 *
 * Storage is intentionally defensive: AsyncStorage's native module may be
 * missing from a running Expo binary if the app hasn't been rebuilt after
 * the dependency was added. We fall back to in-memory persistence in that
 * case, so the toggle still works for the session.
 */

import * as React from "react";
import { Appearance } from "react-native";
import { colorScheme as nwColorScheme } from "nativewind";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "boletify-theme";

// Lazy + safe AsyncStorage access. Resolves to null if the package isn't
// installed in the current binary (which throws on first native call).
type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

let storagePromise: Promise<StorageLike | null> | null = null;
function getStorage(): Promise<StorageLike | null> {
  if (storagePromise) return storagePromise;
  storagePromise = (async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require("@react-native-async-storage/async-storage");
      const AsyncStorage: StorageLike = mod?.default ?? mod;
      // Verify by doing a no-op read — surfaces the "native module missing"
      // error early so we degrade gracefully instead of crashing later.
      await AsyncStorage.getItem(STORAGE_KEY);
      return AsyncStorage;
    } catch (err) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(
          "[theme] AsyncStorage unavailable — theme preference won't persist across launches.",
          err,
        );
      }
      return null;
    }
  })();
  return storagePromise;
}

interface ThemeContextValue {
  /** The user's explicit preference. */
  theme: ThemePreference;
  /** What's actually rendering right now (system → light or dark). */
  resolvedTheme: ResolvedTheme;
  /** Set the user preference. Persists to storage when available. */
  setTheme: (theme: ThemePreference) => void;
  /** Cycle preference: light → dark → system → light. */
  cycleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  return Appearance.getColorScheme() === "light" ? "light" : "dark";
}

function safeApplyToNativeWind(theme: ThemePreference) {
  try {
    nwColorScheme.set(theme);
  } catch (err) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn("[theme] nativewind.colorScheme.set failed", err);
    }
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: {
  children: React.ReactNode;
  defaultTheme?: ThemePreference;
}) {
  const [theme, setThemeState] = React.useState<ThemePreference>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>(
    defaultTheme === "system" ? getSystemTheme() : defaultTheme === "light" ? "light" : "dark",
  );

  // Resolve "system" to an explicit light/dark value. Used both for
  // resolvedTheme state and for NativeWind — passing "system" to
  // nwColorScheme.set() is unreliable on web.
  const resolveTheme = React.useCallback(
    (pref: ThemePreference): ResolvedTheme =>
      pref === "system" ? getSystemTheme() : pref,
    [],
  );

  // Hydrate persisted preference on mount. If the stored value is "system"
  // (legacy), resolve it to the current OS preference so the toggle and
  // NativeWind stay in sync.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const storage = await getStorage();
      if (!storage || cancelled) return;
      try {
        const stored = await storage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (stored === "light" || stored === "dark") {
          setThemeState(stored);
        } else if (stored === "system") {
          // Migrate legacy "system" to the actual OS preference.
          const resolved = getSystemTheme();
          setThemeState(resolved);
          storage.setItem(STORAGE_KEY, resolved).catch(() => {});
        }
      } catch {
        // Ignore — keep default.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Push preference into NativeWind's colorScheme controller. Always pass
  // an explicit "light" or "dark" — NativeWind's "system" mode is unreliable
  // on web where Appearance.getColorScheme() can return null.
  React.useEffect(() => {
    const resolved = resolveTheme(theme);
    safeApplyToNativeWind(resolved);
    setResolvedTheme(resolved);
  }, [theme, resolveTheme]);

  // When following system, react to OS-level changes for the imperative
  // resolved value (StatusBar / Stack headers).
  React.useEffect(() => {
    if (theme !== "system") return;
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      const resolved = colorScheme === "light" ? "light" : "dark";
      setResolvedTheme(resolved);
      safeApplyToNativeWind(resolved);
    });
    return () => sub.remove();
  }, [theme]);

  const setTheme = React.useCallback((next: ThemePreference) => {
    setThemeState(next);
    // Fire-and-forget persistence; failures already logged in getStorage().
    getStorage().then((storage) => {
      if (!storage) return;
      storage.setItem(STORAGE_KEY, next).catch(() => {});
    });
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
 * Resolved theme palette — for places that can't reach Tailwind classes
 * (Stack screenOptions, native APIs, third-party components, gradients).
 * Mirrors the CSS variables in apps/native/tailwind.css.
 */
export interface ThemePalette {
  bg: string;
  surface: string;
  surfaceRaised: string;
  surfaceSunken: string;
  fg: string;
  fgSecondary: string;
  fgMuted: string;
  fgSubtle: string;
  border: string;
  borderStrong: string;
  borderInk: string;
  primary: string;
  primaryFg: string;
  accent: string;
  accentFg: string;
  danger: string;
}

export const themeColors: Record<ResolvedTheme, ThemePalette> = {
  light: {
    bg: "#F4F4F8",
    surface: "#FFFFFF",
    surfaceRaised: "#FFFFFF",
    surfaceSunken: "#E8E8F0",
    fg: "#08080C",
    fgSecondary: "#2E2E3E",
    fgMuted: "#55556A",
    fgSubtle: "#6E6E8A",
    border: "#DDDDE6",
    borderStrong: "#B8B8CB",
    borderInk: "#000000",
    primary: "#08080C",
    primaryFg: "#C6FF2E",
    accent: "#D6005F",
    accentFg: "#F4F4F8",
    danger: "#7A1020",
  },
  dark: {
    bg: "#08080C",
    surface: "#0F0F15",
    surfaceRaised: "#161620",
    surfaceSunken: "#161620",
    fg: "#F6F2EA",
    fgSecondary: "#C2C2D0",
    fgMuted: "#9B9BB3",
    fgSubtle: "#787891",
    border: "#1F1F2B",
    borderStrong: "#2E2E3E",
    borderInk: "#000000",
    primary: "#C6FF2E",
    primaryFg: "#08080C",
    accent: "#FF2E88",
    accentFg: "#08080C",
    danger: "#7A1020",
  },
};

/** Convenience: returns the active theme's flat color palette. */
export function useThemeColors(): ThemePalette {
  const { resolvedTheme } = useTheme();
  return themeColors[resolvedTheme];
}
