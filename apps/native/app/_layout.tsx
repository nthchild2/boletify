import "../global.css";
import * as React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import {
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from "@expo-google-fonts/bricolage-grotesque";
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { JetBrainsMono_500Medium } from "@expo-google-fonts/jetbrains-mono";
import { ThemeProvider, useTheme } from "../lib/theme";

/**
 * StatusBar is the only theme-aware piece at this level. It's a separate
 * subcomponent so it can re-render on theme changes without dragging the
 * navigator with it.
 */
function ThemedStatusBar() {
  const { resolvedTheme } = useTheme();
  return <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />;
}

/**
 * <Stack> wrapper memoized with React.memo so it is rendered exactly
 * ONCE — never again when ThemeProvider's state changes.
 *
 * Why this matters: when ThemeProvider re-renders (e.g. on toggle press),
 * React would normally re-render its children too. Even though our
 * <Stack> has no theme-derived props anymore, the act of re-rendering
 * the Stack element causes expo-router's internal navigator wrapper to
 * re-evaluate its config, which transiently invalidates the navigation
 * context. Any descendant that calls useRouter() during that window —
 * Account, Index, auth/signin, auth/signup, event/[id] — throws
 * "Couldn't find a navigation context".
 *
 * React.memo with no props skips the re-render entirely, so the navigator
 * is mounted exactly once on app start and stays put forever.
 */
const StableStack = React.memo(function StableStack() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth/signin" options={{ headerShown: false }} />
      <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
      <Stack.Screen name="event/[id]" options={{ title: "Evento", headerShown: false }} />
      <Stack.Screen name="checkout/[id]" options={{ title: "Checkout" }} />
      <Stack.Screen name="debug" options={{ title: "Debug", headerShown: false }} />
    </Stack>
  );
});

export default function AppLayout() {
  const [fontsLoaded] = useFonts({
    "Bricolage Grotesque": BricolageGrotesque_800ExtraBold,
    "Bricolage Grotesque Bold": BricolageGrotesque_700Bold,
    Inter: Inter_400Regular,
    "Inter SemiBold": Inter_600SemiBold,
    "Inter Bold": Inter_700Bold,
    "JetBrains Mono": JetBrainsMono_500Medium,
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <ThemedStatusBar />
      <StableStack />
    </ThemeProvider>
  );
}
