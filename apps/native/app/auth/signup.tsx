import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Routes } from "@boletify/routes";
import { Button, GlassCard, Input, Text as UIText } from "@repo/ui";

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
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
        CUENTA · REGISTRO
      </UIText>
      <UIText variant="display-sm" className="mt-3">
        Haz perfil,
        {"\n"}arma plan.
      </UIText>
      <UIText variant="body-md" className="mt-3 text-ink-200">
        Regístrate para comprar tickets, seguir venues y guardar eventos favoritos.
      </UIText>

      <GlassCard className="mt-8">
        <Input label="Nombre" value={name} onChangeText={setName} placeholder="Tu nombre" />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="correo@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          containerClassName="mt-4"
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
          <Button text={loading ? "Creando..." : "Crear cuenta"} size="xl" onPress={handleSubmit} />
        </View>
      </GlassCard>

      <View className="mt-6">
        <Button text="Ya tengo cuenta" variant="secondary" onPress={() => router.push(Routes.AUTH_SIGNIN)} />
      </View>
    </View>
  );
}
