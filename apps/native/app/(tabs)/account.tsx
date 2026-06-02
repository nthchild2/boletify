import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Routes } from "@boletify/routes";
import { Avatar, Button, GlassCard, Text as UIText } from "@repo/ui";
import { HeroHeader, ScreenShell } from "../../components/brutal-mobile";
import { ThemeToggle } from "../../components/theme-toggle";
import { useAuth } from "../../lib/auth";

export default function AccountScreen() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]} className="bg-bg">
      <ScreenShell>
        <HeroHeader
          kicker="CUENTA · PERFIL"
          title={"Tu perfil,\npero con filo."}
          body="Accesos rapidos, CTA claros y superficies glass para el lado mas personal del producto."
        />

        <GlassCard className="mt-8">
          <View className="flex-row items-center gap-4">
            <Avatar initials={initials} size="lg" />
            <View className="flex-1">
              <UIText variant="heading-md">
                {user?.name || "Invitado"}
              </UIText>
              <UIText variant="body-sm" className="mt-1 text-fg-muted">
                {user?.email || "No autenticado"}
              </UIText>
            </View>
          </View>
        </GlassCard>

        <View className="mt-6">
          <UIText variant="overline" className="mb-3 text-fg-muted">
            Apariencia
          </UIText>
          <ThemeToggle />
        </View>

        <View className="mt-6 gap-3">
          {user ? (
            <>
              {user.role === "organiser" && (
                <Button
                  text="Panel de organizador"
                  onPress={() => router.push("/org")}
                />
              )}
              <Button
                text="Cerrar sesion"
                variant="secondary"
                onPress={async () => {
                  await logout();
                }}
              />
            </>
          ) : (
            <>
              <Button
                text="Iniciar sesion"
                onPress={() => router.push(Routes.AUTH_SIGNIN)}
              />
              <Button
                text="Crear cuenta"
                variant="secondary"
                onPress={() => router.push(Routes.AUTH_SIGNUP)}
              />
            </>
          )}
        </View>
      </ScreenShell>
    </SafeAreaView>
  );
}
