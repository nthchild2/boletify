/**
 * Two-state theme toggle (Claro / Oscuro) — native.
 *
 * The app defaults to following the OS theme on first launch. Once the
 * user taps a segment, their choice is persisted and overrides the system.
 * Uses Ionicons for the segment icons.
 *
 * Active-pill colors use inline styles with hardcoded values rather than
 * the useThemeColors() palette. This avoids a race where resolvedTheme
 * (and therefore the palette) can briefly disagree with NativeWind's
 * actual colorScheme — producing e.g. ink text on an ink pill.
 */

import * as React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, useThemeColors, type ResolvedTheme } from "../lib/theme";

const OPTIONS: ReadonlyArray<{
  value: ResolvedTheme;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { value: "light", label: "Claro", icon: "sunny-outline" },
  { value: "dark", label: "Oscuro", icon: "moon-outline" },
];

// Hardcoded contrast pairs — active pill bg → text/icon color.
// Light: ink pill (#08080C) → lime text (#C6FF2E)
// Dark:  lime pill (#C6FF2E) → ink text (#08080C)
const ACTIVE_COLORS: Record<ResolvedTheme, { bg: string; fg: string }> = {
  light: { bg: "#08080C", fg: "#C6FF2E" },
  dark: { bg: "#C6FF2E", fg: "#08080C" },
};

export function ThemeToggle({
  showLabels = true,
  className = "",
}: {
  showLabels?: boolean;
  className?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const colors = useThemeColors();

  // Which visual theme is the pill rendered against right now?
  const activePalette = ACTIVE_COLORS[resolvedTheme] ?? ACTIVE_COLORS.light;

  return (
    <View
      className={`flex-row items-center self-start rounded-md border border-border-strong bg-surface p-0.5 ${className}`}
      accessibilityRole="radiogroup"
    >
      {OPTIONS.map((opt) => {
        const active = resolvedTheme === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => setTheme(opt.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={opt.label}
            style={active ? { backgroundColor: activePalette.bg } : undefined}
            className={`flex-row items-center justify-center rounded-sm ${
              showLabels ? "gap-2 px-3 py-2" : "h-8 w-8"
            } ${active ? "shadow-brick-sm" : ""}`}
          >
            <Ionicons
              name={opt.icon}
              size={16}
              color={active ? activePalette.fg : colors.fgMuted}
            />
            {showLabels ? (
              <Text
                className="font-body text-overline uppercase"
                style={{ color: active ? activePalette.fg : colors.fgMuted }}
              >
                {opt.label}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
