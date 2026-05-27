import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Routes } from "@boletify/routes";
import { Button, GlassCard, Input, Text as UIText } from "@repo/ui";
import { useAuth } from "../../lib/auth";

export default function SignUpScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      router.replace(Routes.MY_TICKETS);
    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]} className="bg-bg">
    <View className="flex-1 p-4 pt-4">
      <UIText variant="overline" className="text-fg-muted">
        CUENTA · REGISTRO
      </UIText>
      <UIText variant="display-sm" className="mt-3">
        Haz perfil,
        {"\n"}arma plan.
      </UIText>
      <UIText variant="body-md" className="mt-3 text-fg-secondary">
        Regístrate para comprar tickets, seguir venues y guardar eventos favoritos.
      </UIText>

      {error ? (
        <View className="mt-4 rounded-lg px-4 py-3" style={{ borderWidth: 1, borderColor: 'rgba(220,38,38,0.3)', backgroundColor: 'rgba(220,38,38,0.1)' }}>
          <UIText variant="body-sm" className="text-danger">
            {error}
          </UIText>
        </View>
      ) : null}

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
    </SafeAreaView>
  );
}
