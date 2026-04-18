import { View, Text, TextInput } from "react-native";

export default function SearchScreen() {
  return (
    <View className="flex-1 bg-ink-950 p-4">
      <Text className="text-display-md text-bone-50 font-display mb-4">
        Buscar
      </Text>
      <TextInput
        className="bg-ink-900 text-bone-50 p-4 rounded-lg border border-ink-800"
        placeholder="Buscar eventos..."
        placeholderTextColor="#78716c"
      />
    </View>
  );
}