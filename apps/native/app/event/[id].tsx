import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Routes } from "@boletify/routes";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-ink-950">
      <View className="p-4">
        <Text className="text-display-md text-bone-50 font-display mb-2">
          Tech Conference 2026
        </Text>
        <Text className="text-bone-400 mb-4">
          15 May 2026 • CDMX
        </Text>

        <View className="bg-ink-900 rounded-lg p-4 mb-4">
          <Text className="text-bone-300">
            Join us for the most exciting tech event of the year...
          </Text>
        </View>

        <TouchableOpacity
          className="bg-bone-50 py-4 rounded-lg"
          onPress={() => router.push(Routes.CHECKOUT(id))}
        >
          <Text className="text-ink-950 text-center font-medium">
            Comprar Tickets
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}