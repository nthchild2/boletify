import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0c0a09" },
        headerTintColor: "#f5f0e6",
        headerTitleStyle: { fontWeight: "600" },
        contentStyle: { backgroundColor: "#0c0a09" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Eventos", headerShown: false }} />
      <Stack.Screen name="search" options={{ title: "Buscar", headerShown: false }} />
      <Stack.Screen name="tickets" options={{ title: "Mis Tickets", headerShown: false }} />
      <Stack.Screen name="account" options={{ title: "Cuenta", headerShown: false }} />
      <Stack.Screen name="auth/signin" options={{ headerShown: false }} />
      <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
      <Stack.Screen name="event/[id]" options={{ title: "Evento" }} />
      <Stack.Screen name="checkout/[id]" options={{ title: "Checkout" }} />
      <Stack.Screen name="debug" options={{ title: "Debug" }} />
    </Stack>
  );
}