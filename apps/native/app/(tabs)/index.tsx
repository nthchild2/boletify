import { FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { Text as UIText } from "@repo/ui";
import {
  CTAStack,
  EventTile,
  HeroHeader,
  ScreenShell,
  SearchPanel,
} from "../../components/brutal-mobile";
import { mobileEvents, mobileStats } from "../../lib/mock-data";

export default function EventsScreen() {
  const router = useRouter();

  return (
    <ScreenShell padded={false}>
      <FlatList
        data={mobileEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 140 }}
        ListHeaderComponent={
          <View>
            <HeroHeader
              kicker="DESCUBRE · NOCHES · SONIDOS"
              title={"La noche\nes de quien la vive."}
              body="El mejor feed de eventos en vivo en CDMX. Brutal por fuera, glass donde importa."
            />
            <CTAStack />
            <View className="mt-8 flex-row gap-3">
              {mobileStats.map((stat) => (
                <View key={stat.label} className="flex-1 rounded-lg border border-ink-800 bg-ink-900 p-3">
                  <UIText variant="overline" className="text-ink-300">
                    {stat.label}
                  </UIText>
                  <UIText variant="mono-md" className="mt-2 text-signal-500">
                    {stat.value}
                  </UIText>
                </View>
              ))}
            </View>
            <SearchPanel />
            <UIText variant="heading-lg" className="mt-8">
              Cartelera.
            </UIText>
          </View>
        }
        renderItem={({ item }) => (
          <EventTile event={item} onPress={() => router.push(`/event/${item.id}`)} />
        )}
      />
    </ScreenShell>
  );
}
