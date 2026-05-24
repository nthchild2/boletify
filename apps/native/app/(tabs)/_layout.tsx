import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../../lib/theme";

/**
 * Each TabItem subscribes to the theme directly, so Tabs' screenOptions
 * can stay 100% theme-independent. Putting `useThemeColors()` on the
 * <Tabs> layout itself caused screenOptions to be a new object every
 * theme change, which Expo Router treats as a navigator reset — that's
 * what was breaking useRouter() inside child screens with
 * "Couldn't find a navigation context".
 */
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
  const colors = useThemeColors();
  const activeColor = colors.primary;
  const inactiveColor = colors.fgSubtle;
  const currentIcon = focused ? iconFocused : icon;
  const iconSize = focused ? 26 : 22;

  return (
    <View className="items-center justify-center w-[78px]">
      <Ionicons name={currentIcon} size={iconSize} color={focused ? activeColor : inactiveColor} />
      <Text
        className="text-[10px] leading-3.5 mt-0.5"
        style={{ color: focused ? activeColor : inactiveColor }}
      >
        {label}
      </Text>
    </View>
  );
}

/**
 * Tab bar background — rendered via `tabBarBackground` instead of via
 * `tabBarStyle.backgroundColor`. NativeWind tracks the colorScheme
 * observable directly so this View redraws on every theme change without
 * mutating the navigator's screenOptions.
 */
function TabBarBackground() {
  return <View className="flex-1 bg-surface border-t border-border" />;
}

// Static screenOptions — no theme dependencies. Defining outside the
// component guarantees the same object identity across re-renders, so
// Expo Router never treats a render as a config change.
const SCREEN_OPTIONS = {
  tabBarBackground: () => <TabBarBackground />,
  tabBarStyle: {
    backgroundColor: "transparent" as const,
    borderTopWidth: 0,
    height: 82,
    paddingTop: 17,
    paddingBottom: 28,
    elevation: 0,
  },
  headerShown: false,
  tabBarShowLabel: false,
} as const;

export default function TabLayout() {
  return (
    <Tabs screenOptions={SCREEN_OPTIONS}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              label="Inicio"
              focused={focused}
              icon="home-outline"
              iconFocused="home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              label="Buscar"
              focused={focused}
              icon="search-outline"
              iconFocused="search"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              label="Mis boletos"
              focused={focused}
              icon="ticket-outline"
              iconFocused="ticket"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              label="Cuenta"
              focused={focused}
              icon="person-outline"
              iconFocused="person"
            />
          ),
        }}
      />
    </Tabs>
  );
}
