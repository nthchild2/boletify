import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import {
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from "@expo-google-fonts/bricolage-grotesque";
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { JetBrainsMono_500Medium } from "@expo-google-fonts/jetbrains-mono";

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
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#08080C" },
          headerTintColor: "#F6F2EA",
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: "#08080C" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ title: "Eventos", headerShown: false }} />
        <Stack.Screen name="search" options={{ title: "Buscar", headerShown: false }} />
        <Stack.Screen name="tickets" options={{ title: "Mis Tickets", headerShown: false }} />
        <Stack.Screen name="account" options={{ title: "Cuenta", headerShown: false }} />
        <Stack.Screen name="auth/signin" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="event/[id]" options={{ title: "Evento", headerShown: false }} />
        <Stack.Screen name="checkout/[id]" options={{ title: "Checkout" }} />
        <Stack.Screen name="debug" options={{ title: "Debug", headerShown: false }} />
      </Stack>
    </>
  );
}
