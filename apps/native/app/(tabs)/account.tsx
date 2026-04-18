import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Routes } from "@boletify/routes";

export default function AccountScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-ink-950 p-4">
      <Text className="text-display-md text-bone-50 font-display mb-4">
        Cuenta
      </Text>

      <View className="space-y-3">
        <TouchableOpacity
          className="bg-ink-900 rounded-lg p-4 border border-ink-800"
          onPress={() => router.push(Routes.AUTH_SIGNIN)}
        >
          <Text className="text-bone-50 font-medium">Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-ink-900 rounded-lg p-4 border border-ink-800"
          onPress={() => router.push(Routes.AUTH_SIGNUP)}
        >
          <Text className="text-bone-50 font-medium">Crear Cuenta</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-8">
        <Text className="text-bone-500 text-sm mb-2">También en web:</Text>
        <TouchableOpacity
          className="bg-bone-900 rounded-lg p-3"
          onPress={() => router.push(Routes.ORGANIZER_DASHBOARD)}
        >
          <Text className="text-ink-950 font-medium">Panel de Organizador</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}