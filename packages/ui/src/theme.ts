/**
 * Shared theme tokens & types — Brutal-Glass v2.0 (Ánima Nocturna)
 *
 * This is the SINGLE SOURCE OF TRUTH for the Boletify design system's
 * colour palette. Both web (CSS variables) and native (imperative palette)
 * derive their concrete values from this file.
 *
 * Architecture:
 *   ┌─────────────────────────────┐
 *   │  packages/ui/src/theme.ts   │  ← shared types, hex palette, helpers
 *   └──────────┬──────────────────┘
 *        ┌─────┴─────┐
 *        ▼           ▼
 *   apps/web      apps/native
 *   CSS vars      useColorScheme (NativeWind)
 *   .dark class   + imperative palette from here
 *
 * CSS variable files (global.css / tailwind.css) are hand-authored to
 * match the hex values below. If you change a colour here, update both
 * CSS files to keep them in sync.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** What the user explicitly chose. */
export type ThemePreference = "light" | "dark" | "system";

/** What's actually rendering right now. */
export type ResolvedTheme = "light" | "dark";

/** The full semantic colour palette for imperative use (RN StyleSheet, etc.) */
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
  primaryHover: string;
  primaryPressed: string;
  accent: string;
  accentFg: string;
  accentHover: string;
  danger: string;
  dangerFg: string;
  success: string;
  warning: string;
  info: string;
  inverse: string;
  inverseFg: string;
}

/** Shared API returned by useTheme() on both platforms. */
export interface ThemeContextValue {
  /** The user's explicit preference. */
  theme: ThemePreference;
  /** What's actually rendering right now (system → light or dark). */
  resolvedTheme: ResolvedTheme;
  /** Set the user preference. Persists to storage. */
  setTheme: (t: ThemePreference) => void;
  /** Cycle preference: light → dark → system → light. */
  cycleTheme: () => void;
}

// ---------------------------------------------------------------------------
// Hex palette — single source of truth
// ---------------------------------------------------------------------------

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
    primaryHover: "#0F0F15",
    primaryPressed: "#161620",
    accent: "#D6005F",
    accentFg: "#F4F4F8",
    accentHover: "#FF2E88",
    danger: "#7A1020",
    dangerFg: "#F4F4F8",
    success: "#20D987",
    warning: "#FF9E00",
    info: "#00B3C7",
    inverse: "#08080C",
    inverseFg: "#F4F4F8",
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
    primaryHover: "#D7FF3A",
    primaryPressed: "#9FE600",
    accent: "#FF2E88",
    accentFg: "#08080C",
    accentHover: "#FF6AA9",
    danger: "#7A1020",
    dangerFg: "#F6F2EA",
    success: "#20D987",
    warning: "#FF9E00",
    info: "#00B3C7",
    inverse: "#F6F2EA",
    inverseFg: "#08080C",
  },
};

// ---------------------------------------------------------------------------
// CSS variable values — space-separated RGB triplets
//
// These MUST match the values in:
//   apps/web/styles/global.css
//   apps/native/tailwind.css
//
// On native, we pass these to NativeWind's `vars()` API to set the CSS
// variables directly on a root View. This bypasses the `.dark` class toggle
// mechanism which relies on Appearance.setColorScheme() → listener chain
// that doesn't work reliably on the iOS simulator.
// ---------------------------------------------------------------------------

/** CSS variable name → space-separated RGB triplet for each theme. */
export type ThemeCSSVars = Record<string, string>;

export const themeCSSVars: Record<ResolvedTheme, ThemeCSSVars> = {
  light: {
    // Surfaces
    "--color-bg": "244 244 248",
    "--color-surface": "255 255 255",
    "--color-surface-raised": "255 255 255",
    "--color-surface-sunken": "232 232 240",
    // Foreground
    "--color-fg": "8 8 12",
    "--color-fg-secondary": "46 46 62",
    "--color-fg-muted": "85 85 106",
    "--color-fg-subtle": "110 110 138",
    // Borders
    "--color-border": "221 221 230",
    "--color-border-strong": "184 184 203",
    "--color-border-ink": "0 0 0",
    // Primary
    "--color-primary": "8 8 12",
    "--color-primary-fg": "198 255 46",
    "--color-primary-hover": "15 15 21",
    "--color-primary-pressed": "22 22 32",
    // Accent
    "--color-accent": "214 0 95",
    "--color-accent-fg": "244 244 248",
    "--color-accent-hover": "255 46 136",
    // States
    "--color-danger": "122 16 32",
    "--color-danger-fg": "244 244 248",
    "--color-danger-hover": "163 36 56",
    "--color-success": "32 217 135",
    "--color-warning": "255 158 0",
    "--color-info": "0 179 199",
    // Inverse
    "--color-inverse": "8 8 12",
    "--color-inverse-fg": "244 244 248",
    // Glass / translucent surfaces
    "--color-glass-tint": "rgba(255, 255, 255, 0.60)",
    "--color-glass-edge": "rgba(0, 0, 0, 0.06)",
    "--color-nav-tint": "rgba(244, 244, 248, 0.72)",
    // Brick shadow
    "--color-brick": "#000000",
  },
  dark: {
    // Surfaces
    "--color-bg": "8 8 12",
    "--color-surface": "15 15 21",
    "--color-surface-raised": "22 22 32",
    "--color-surface-sunken": "22 22 32",
    // Foreground
    "--color-fg": "246 242 234",
    "--color-fg-secondary": "194 194 208",
    "--color-fg-muted": "155 155 179",
    "--color-fg-subtle": "120 120 145",
    // Borders
    "--color-border": "31 31 43",
    "--color-border-strong": "46 46 62",
    "--color-border-ink": "0 0 0",
    // Primary
    "--color-primary": "198 255 46",
    "--color-primary-fg": "8 8 12",
    "--color-primary-hover": "215 255 58",
    "--color-primary-pressed": "159 230 0",
    // Accent
    "--color-accent": "255 46 136",
    "--color-accent-fg": "8 8 12",
    "--color-accent-hover": "255 106 169",
    // States
    "--color-danger": "122 16 32",
    "--color-danger-fg": "246 242 234",
    "--color-danger-hover": "163 36 56",
    "--color-success": "32 217 135",
    "--color-warning": "255 158 0",
    "--color-info": "0 179 199",
    // Inverse
    "--color-inverse": "246 242 234",
    "--color-inverse-fg": "8 8 12",
    // Glass / translucent surfaces
    "--color-glass-tint": "rgba(255, 255, 255, 0.05)",
    "--color-glass-edge": "rgba(255, 255, 255, 0.10)",
    "--color-nav-tint": "rgba(8, 8, 12, 0.72)",
    // Brick shadow
    "--color-brick": "#000000",
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** The next theme in the cycle: light → dark → system → light. */
export function nextTheme(current: ThemePreference): ThemePreference {
  if (current === "light") return "dark";
  if (current === "dark") return "system";
  return "light";
}

/** AsyncStorage / localStorage key. */
export const STORAGE_KEY = "boletify-theme";
