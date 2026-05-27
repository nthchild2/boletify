/**
 * Two-state theme toggle (Light / Dark) — native.
 *
 * Defaults to the device setting on first launch. Tapping the opposite
 * segment overrides the OS preference and persists via AsyncStorage.
 *
 * Active-pill colors use inline styles with hardcoded values to avoid a
 * race where resolvedTheme can briefly disagree with the rendered palette.
 */

import * as React from "react";
import { View, Text, Pressable } from "react-native";
import { brickShadows } from "@repo/ui";
import {
  useTheme,
  useThemeColors,
  type ResolvedTheme,
} from "../lib/theme";

const OPTIONS: ReadonlyArray<{
  value: ResolvedTheme;
  label: string;
  icon: string;
}> = [
  { value: "light", label: "Claro", icon: "☀️" },
  { value: "dark", label: "Oscuro", icon: "🌙" },
];

// Hardcoded contrast pairs — active pill bg → text/icon color.
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
            style={active ? [{ backgroundColor: activePalette.bg }, brickShadows.sm] : undefined}
            className={`flex-row items-center justify-center rounded-sm ${
              showLabels ? "gap-2 px-3 py-2" : "h-8 w-8"
            }`}
          >
            <Text
              style={{ color: active ? activePalette.fg : colors.fgMuted, fontSize: 14 }}
            >
              {opt.icon}
            </Text>
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
