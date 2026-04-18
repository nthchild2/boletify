import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
}

const MOCK_EVENTS: Event[] = [
  { id: "1", name: "Tech Conference 2026", date: "15 May 2026", venue: "CDMX" },
  { id: "2", name: "Music Festival", date: "20 Jun 2026", venue: "GDL" },
  { id: "3", name: "Art Expo", date: "10 Jul 2026", venue: "MTY" },
];

export default function EventsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-ink-950">
      <View className="p-4">
        <Text className="text-display-md text-bone-50 font-display mb-2">
          Eventos
        </Text>
        <Text className="text-bone-400">
          Descubre los próximos eventos
        </Text>
      </View>

      <FlatList
        data={MOCK_EVENTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-ink-900 rounded-lg p-4 border border-ink-800"
            onPress={() => router.push(`/event/${item.id}`)}
          >
            <Text className="text-lg text-bone-50 font-medium">
              {item.name}
            </Text>
            <Text className="text-bone-400 text-sm mt-1">
              {item.date} • {item.venue}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}