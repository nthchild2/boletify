import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function TabItem({
  label,
  focused,
  icon,
  iconFocused,
}: {
  label: string;
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
}) {
  const colorClass = focused ? "text-signal-500" : "text-ink-300";
  const currentIcon = focused ? iconFocused : icon;
  const iconSize = focused ? 26 : 22;

  return (
    <View className="items-center justify-center w-[78px]">
      <Ionicons name={currentIcon} size={iconSize} color={focused ? "#C6FF2E" : "#787891"} />
      <Text className={`text-[10px] leading-3.5 mt-0.5 ${colorClass}`}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "rgba(15,16,20,0.6)",
          borderTopWidth: 1,
          borderTopColor: "rgba(245,242,235,0.08)",
          height: 82,
          paddingTop: 17,
          paddingBottom: 28,
        },
        tabBarActiveTintColor: "#C6FF2E",
        tabBarInactiveTintColor: "#787891",
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem label="Inicio" focused={focused} icon="home-outline" iconFocused="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem label="Buscar" focused={focused} icon="search-outline" iconFocused="search" />
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem label="Mis boletos" focused={focused} icon="ticket-outline" iconFocused="ticket" />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem label="Cuenta" focused={focused} icon="person-outline" iconFocused="person" />
          ),
        }}
      />
    </Tabs>
  );
}