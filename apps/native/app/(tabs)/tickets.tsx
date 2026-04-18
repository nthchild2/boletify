import { View, Text, FlatList } from "react-native";

interface Ticket {
  id: string;
  eventName: string;
  date: string;
  status: "valid" | "used" | "expired";
}

const MOCK_TICKETS: Ticket[] = [
  { id: "1", eventName: "Tech Conference 2026", date: "15 May 2026", status: "valid" },
];

export default function TicketsScreen() {
  return (
    <View className="flex-1 bg-ink-950">
      <View className="p-4">
        <Text className="text-display-md text-bone-50 font-display mb-2">
          Mis Tickets
        </Text>
        <Text className="text-bone-400">
          Tus tickets comprados
        </Text>
      </View>

      <FlatList
        data={MOCK_TICKETS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <View className="bg-ink-900 rounded-lg p-4 border border-ink-800">
            <Text className="text-lg text-bone-50 font-medium">
              {item.eventName}
            </Text>
            <Text className="text-bone-400 text-sm mt-1">{item.date}</Text>
            <View className="mt-2 bg-emerald-900/50 self-start px-2 py-1 rounded">
              <Text className="text-emerald-400 text-xs font-medium">
                {item.status === "valid" ? "Válido" : item.status}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}