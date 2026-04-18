import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Routes } from "@boletify/routes";

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    // TODO: Call sign-up API
    setTimeout(() => {
      router.replace(Routes.MY_TICKETS);
    }, 1000);
  };

  return (
    <View className="flex-1 bg-ink-950 p-4">
      <Text className="text-display-md text-bone-50 font-display mb-2">
        Crear Cuenta
      </Text>
      <Text className="text-bone-400 mb-8">
        Regístrate para comprar tickets
      </Text>

      <View className="space-y-4">
        <View>
          <Text className="text-bone-300 text-sm mb-2">Nombre</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className="bg-ink-900 text-bone-50 p-4 rounded-lg border border-ink-800"
            placeholder="Tu nombre"
            placeholderTextColor="#78716c"
          />
        </View>

        <View>
          <Text className="text-bone-300 text-sm mb-2">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            className="bg-ink-900 text-bone-50 p-4 rounded-lg border border-ink-800"
            placeholder="correo@ejemplo.com"
            placeholderTextColor="#78716c"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-bone-300 text-sm mb-2">Contraseña</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            className="bg-ink-900 text-bone-50 p-4 rounded-lg border border-ink-800"
            placeholder="••••••••"
            placeholderTextColor="#78716c"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          className="bg-bone-50 py-4 rounded-lg"
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text className="text-ink-950 text-center font-medium">
            {loading ? "Creando..." : "Crear Cuenta"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-8">
        <TouchableOpacity onPress={() => router.push(Routes.AUTH_SIGNIN)}>
          <Text className="text-bone-400 text-center">
            ¿Ya tienes cuenta?{" "}
            <Text className="text-bone-50 underline">Iniciar sesión</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}