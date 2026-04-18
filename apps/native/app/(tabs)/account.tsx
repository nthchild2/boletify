import { View } from "react-native";
import { useRouter } from "expo-router";
import { Routes } from "@boletify/routes";
import { Avatar, Button, GlassCard, Text as UIText } from "@repo/ui";
import { HeroHeader, ScreenShell } from "../../components/brutal-mobile";

export default function AccountScreen() {
  const router = useRouter();

  return (
    <ScreenShell>
      <HeroHeader
        kicker="CUENTA · PERFIL"
        title={"Tu perfil,\npero con filo."}
        body="Accesos rápidos, CTA claros y superficies glass para el lado más personal del producto."
      />

      <GlassCard className="mt-8">
        <View className="flex-row items-center gap-4">
          <Avatar initials="CC" size="lg" />
          <View className="flex-1">
            <UIText variant="heading-md">Carlos Cortes</UIText>
            <UIText variant="body-sm" className="mt-1 text-ink-300">
              nth.child.1@gmail.com
            </UIText>
          </View>
        </View>
      </GlassCard>

      <View className="mt-6 gap-3">
        <Button text="Iniciar sesión" onPress={() => router.push(Routes.AUTH_SIGNIN)} />
        <Button text="Crear cuenta" variant="secondary" onPress={() => router.push(Routes.AUTH_SIGNUP)} />
        <Button
          text="Panel de organizador"
          variant="glass"
          onPress={() => router.push(Routes.ORGANIZER_DASHBOARD)}
        />
      </View>
    </ScreenShell>
  );
}
