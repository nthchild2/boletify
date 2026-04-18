import { FlatList, View } from "react-native";
import { Badge, GlassCard, Text as UIText } from "@repo/ui";
import { HeroHeader, ScreenShell } from "../../components/brutal-mobile";
import { mobileTickets } from "../../lib/mock-data";

export default function TicketsScreen() {
  return (
    <ScreenShell padded={false}>
      <FlatList
        data={mobileTickets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 }}
        ListHeaderComponent={
          <HeroHeader
            kicker="MIS TICKETS"
            title={"Tu boleto es\nun objeto."}
            body="Aquí viven tus accesos activos, con status visible y datos en mono tabular."
          />
        }
        renderItem={({ item }) => (
          <GlassCard className="mb-5">
            <UIText variant="overline" className="text-ink-300">
              {item.section}
            </UIText>
            <UIText variant="heading-md" className="mt-2">
              {item.eventName}
            </UIText>
            <UIText variant="mono-md" className="mt-3 text-signal-500">
              {item.date}
            </UIText>
            <View className="mt-4 flex-row items-center justify-between">
              <Badge variant="leaf">{item.status}</Badge>
              <UIText variant="mono-sm" className="text-ink-300">
                {item.id}
              </UIText>
            </View>
          </GlassCard>
        )}
      />
    </ScreenShell>
  );
}
