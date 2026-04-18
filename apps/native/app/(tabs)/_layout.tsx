import { Tabs } from "expo-router";
import { View, Text } from "react-native";

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    index: "🎫",
    search: "🔍",
    tickets: "🎟️",
    account: "👤",
  };
  
  return (
    <View className="items-center">
      <Text className="text-2xl">{icons[name] || "•"}</Text>
      <Text className={`text-xs mt-1 ${focused ? "text-bone-50" : "text-bone-500"}`}>
        {name === "index" ? "Eventos" : name === "account" ? "Cuenta" : name === "tickets" ? "Tickets" : name}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#0c0a09",
          borderTopColor: "#1c1917",
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#f5f0e6",
        tabBarInactiveTintColor: "#78716c",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="index" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="search" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="tickets" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="account" focused={focused} />,
        }}
      />
    </Tabs>
  );
}