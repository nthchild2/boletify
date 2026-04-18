import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Routes } from "@boletify/routes";
import { Button, GlassCard, Input, Text as UIText } from "@repo/ui";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      router.replace(Routes.MY_TICKETS);
    }, 1000);
  };

  return (
    <View className="flex-1 bg-ink-950 p-4 pt-8">
      <UIText variant="overline" className="text-ink-300">
        CUENTA · ACCESO
      </UIText>
      <UIText variant="display-sm" className="mt-3">
        Inicia y sal.
      </UIText>
      <UIText variant="body-md" className="mt-3 text-ink-200">
        Accede a tu cuenta para comprar tickets y revisar tu QR en segundos.
      </UIText>

      <GlassCard className="mt-8">
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="correo@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          containerClassName="mt-4"
        />
        <View className="mt-5">
          <Button text={loading ? "Iniciando..." : "Iniciar sesión"} size="xl" onPress={handleSubmit} />
        </View>
      </GlassCard>

      <View className="mt-6">
        <Button text="Crear cuenta" variant="secondary" onPress={() => router.push(Routes.AUTH_SIGNUP)} />
      </View>
    </View>
  );
}
