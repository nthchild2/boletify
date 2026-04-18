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
          backgroundColor: "#08080C",
          borderTopColor: "#1F1F2B",
          borderTopWidth: 1,
          height: 86,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#F6F2EA",
        tabBarInactiveTintColor: "#787891",
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
