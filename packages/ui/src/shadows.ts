/**
 * Native shadow styles — inline ViewStyle objects that bypass NativeWind's
 * CSS-to-native shadow conversion.
 *
 * WHY: NativeWind v4's `cssInterop` layer parses CSS `box-shadow` strings
 * at runtime to produce React Native shadow props. During a color-scheme
 * change this parsing races with expo-router's NavigationStateContext
 * initialisation, causing "Couldn't find a navigation context" crashes.
 * (NativeWind issues #1536, #1557, #1432.)
 *
 * By providing the shadow props as plain ViewStyle objects we skip the
 * CSS parser entirely and the race disappears.
 *
 * NOTE: React Native does not support `inset` or multiple box-shadows.
 * The values below are simplified from the full CSS definitions in
 * tailwind.css — they look close enough on device.
 */

import { Platform, type ViewStyle } from "react-native";

// ---------------------------------------------------------------------------
// Brick shadows — hard-offset, always black, same in both themes
// ---------------------------------------------------------------------------

export const brickShadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    ...(Platform.OS === "android" ? { elevation: 2 } : {}),
  } as ViewStyle,

  md: {
    shadowColor: "#000",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    ...(Platform.OS === "android" ? { elevation: 4 } : {}),
  } as ViewStyle,

  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 0,
    ...(Platform.OS === "android" ? { elevation: 6 } : {}),
  } as ViewStyle,

  none: {} as ViewStyle,
};

// ---------------------------------------------------------------------------
// Glass shadows — softer, approximated for RN (no inset / multi-shadow)
// ---------------------------------------------------------------------------

export const glassShadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    ...(Platform.OS === "android" ? { elevation: 1 } : {}),
  } as ViewStyle,

  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    ...(Platform.OS === "android" ? { elevation: 3 } : {}),
  } as ViewStyle,

  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.3,
    shadowRadius: 64,
    ...(Platform.OS === "android" ? { elevation: 5 } : {}),
  } as ViewStyle,
};
