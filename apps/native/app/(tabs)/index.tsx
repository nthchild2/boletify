import { FlatList, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text as UIText } from "@repo/ui";
import {
  CTAStack,
  EventTile,
  HeroHeader,
  ScreenShell,
  SearchPanel,
} from "../../components/brutal-mobile";

type MobileEvent = {
  id: string;
  title: string;
  eyebrow: string;
  venue: string;
  location: string;
  date: string;
  price: string;
  status: string;
  category: string;
  description: string;
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "POR CONFIRMAR";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" }).toUpperCase();
}

export default function EventsScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<MobileEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
    fetch(`${API_URL}/api/events`)
      .then(r => r.json())
      .then(data => {
        const mapped = data.map((e: any) => ({
          id: String(e.id),
          title: e.title,
          eyebrow: e.venue_name,
          venue: e.venue_name,
          location: e.city || "CDMX",
          date: formatDate(e.start_date),
          price: "POR CONFIRMAR",
          status: e.status,
          category: e.genre_tags?.[0]?.toUpperCase() || "INDIE",
          description: e.description || "",
          coverImageUrl: e.cover_image_url || "",
        }));
        console.log("Fetched events:", mapped.length, "First image:", mapped[0]?.coverImageUrl);
        setEvents(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <ScreenShell padded={false}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C6FF2E" />
        </View>
      </ScreenShell>
    );
  }

  if (events.length === 0) {
    return (
      <ScreenShell padded={false}>
        <FlatList
          data={[]}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View>
              <HeroHeader
                kicker="PROXIMAMENTE"
                title={"La noche\nes de quien la vive."}
                body="Los mejores eventos en CDMX."
              />
            </View>
          }
        />
      </ScreenShell>
    );
  }

  const stats = [
    { label: "Eventos", value: String(events.length) },
    { label: "Esta semana", value: String(events.length) },
    { label: "Ciudad", value: "CDMX" },
  ];

  return (
    <ScreenShell padded={false}>
      <FlatList
        data={events}
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
              {stats.map((stat) => (
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
          <EventTile 
            event={{
              id: item.id,
              title: item.title,
              eyebrow: item.venue,
              venue: item.venue,
              location: item.location,
              date: item.date,
              access: "",
              price: item.price,
              status: item.status,
              category: item.category,
              lineup: item.description,
              description: item.description,
              gradientClassName: "bg-ink-900",
              coverImageUrl: item.coverImageUrl,
            }} 
            onPress={() => router.push(`/event/${item.id}`)} 
          />
        )}
      />
    </ScreenShell>
  );
}