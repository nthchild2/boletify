import { FlatList, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { useThemeColors } from "../../lib/theme";
import {
  deriveSaleStatus,
  formatMxnPrice,
  type SaleStatusVariant,
} from "@boletify/routes";

type MobileEvent = {
  id: string;
  title: string;
  eyebrow: string;
  venue: string;
  location: string;
  date: string;
  access: string;
  price: string;
  status: string;
  statusVariant: SaleStatusVariant;
  showStatus: boolean;
  category: string;
  description: string;
  coverImageUrl?: string;
  /** Raw ISO start date — used for "Esta semana" stat filtering. */
  startDateRaw: string | null;
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "POR CONFIRMAR";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" }).toUpperCase();
}

// Extracts the time portion from an ISO timestamp like "2026-05-17T21:00:00Z".
// Returns "" if the source has no time component or fails to parse — the
// EventTile then degrades gracefully to date-only.
function formatTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  // Skip rendering for midnight (likely date-only payloads).
  if (d.getHours() === 0 && d.getMinutes() === 0) return "";
  return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function EventsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [events, setEvents] = useState<MobileEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
    fetch(`${API_URL}/api/events`)
      .then(r => r.json())
      .then(data => {
        const mapped = data.map((e: any): MobileEvent => {
          // Same derivation the web uses — DB-level "status" is internal.
          const sale = deriveSaleStatus({
            status: e.status,
            startDate: e.start_date,
            endDate: e.end_date,
            saleStartDate: e.sale_starts_at,
            saleEndDate: e.sale_ends_at,
            totalQuantity: e.total_quantity,
            totalSold: e.total_sold,
            minPriceCents: e.min_price_cents,
          });

          return {
            id: String(e.id),
            title: e.title,
            // Eyebrow no longer carries the venue (avoids the dup with the
            // detail row) — the EventTile uses date+access for the eyebrow.
            eyebrow: "",
            venue: e.venue_name,
            location: e.city || "CDMX",
            date: formatDate(e.start_date),
            access: formatTime(e.start_date),
            price: formatMxnPrice(e.min_price_cents),
            status: sale.label,
            statusVariant: sale.variant,
            showStatus: !sale.hidden,
            category: e.genre_tags?.[0]?.toUpperCase() || "INDIE",
            description: e.description || "",
            coverImageUrl: e.cover_image_url || "",
            startDateRaw: e.start_date || null,
          };
        });
        console.log("Fetched events:", mapped.length, "First image:", mapped[0]?.coverImageUrl);
        setEvents(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("API unreachable:", err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{flex:1}} edges={["top"]}>
        <ScreenShell padded={false}>
          <View className="flex-1 items-center justify-center">
            {/* Spinner uses the resolved primary so it pops on either page bg. */}
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </ScreenShell>
      </SafeAreaView>
    );
  }

  if (events.length === 0) {
    return (
      <SafeAreaView style={{flex:1}} edges={["top"]}>
        <ScreenShell padded={false}>
          <FlatList<MobileEvent>
          data={[]}
          keyExtractor={(item) => item.id}
          renderItem={() => null}
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
      </SafeAreaView>
    );
  }

  const thisWeekCount = (() => {
    const now = new Date();
    // Monday as start of week
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((day + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 7);

    return events.filter((e) => {
      if (!e.startDateRaw) return false;
      const d = new Date(e.startDateRaw);
      return d >= monday && d < sunday;
    }).length;
  })();

  const stats = [
    { label: "Eventos", value: String(events.length) },
    { label: "Esta semana", value: String(thisWeekCount) },
    { label: "Ciudad", value: "CDMX" },
  ];

  return (
    <SafeAreaView style={{flex: 1}} edges={["top"]}>
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
                <View key={stat.label} className="flex-1 rounded-lg border border-border bg-surface p-3">
                  <UIText variant="overline" className="text-fg-muted">
                    {stat.label}
                  </UIText>
                  <UIText variant="mono-md" className="mt-2 text-primary">
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
              // Eyebrow stays empty — the tile renders date+access there.
              eyebrow: "",
              venue: item.venue,
              location: item.location,
              date: item.date,
              access: item.access,
              price: item.price,
              status: item.status,
              statusVariant: item.statusVariant,
              showStatus: item.showStatus,
              category: item.category,
              lineup: item.description,
              description: item.description,
              gradientClassName: "bg-surface",
              coverImageUrl: item.coverImageUrl,
            }}
            onPress={() => router.push(`/event/${item.id}`)}
          />
        )}
      />
      </ScreenShell>
    </SafeAreaView>
  );
}
