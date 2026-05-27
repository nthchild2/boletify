import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Routes, deriveSaleStatus, formatMxnPrice, type SaleStatusVariant } from "@boletify/routes";
import { Badge, Button, GlassCard, Text as UIText } from "@repo/ui";
import { useThemeColors } from "../../lib/theme";

interface EventDetail {
  id: string;
  title: string;
  description: string;
  venueName: string;
  venueAddress: string | null;
  city: string;
  date: string;
  access: string;
  price: string;
  status: string;
  statusVariant: SaleStatusVariant;
  showStatus: boolean;
  category: string;
  coverImageUrl: string | null;
  genreTags: string[];
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "POR CONFIRMAR";
  const d = new Date(dateStr);
  return d
    .toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" })
    .toUpperCase();
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  if (d.getHours() === 0 && d.getMinutes() === 0) return "";
  return (
    d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }) +
    " hrs"
  );
}

function mapApiEvent(e: any): EventDetail {
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

  let tags: string[] = [];
  if (Array.isArray(e.genre_tags)) {
    tags = e.genre_tags;
  }

  return {
    id: String(e.id),
    title: e.title,
    description: e.description || "",
    venueName: e.venue_name,
    venueAddress: e.venue_address || null,
    city: e.city || "CDMX",
    date: formatDate(e.start_date),
    access: formatTime(e.start_date),
    price: formatMxnPrice(e.min_price_cents),
    status: sale.label,
    statusVariant: sale.variant,
    showStatus: !sale.hidden,
    category: tags[0]?.toUpperCase() || "",
    coverImageUrl: e.cover_image_url || null,
    genreTags: tags,
  };
}

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useThemeColors();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
    fetch(`${API_URL}/api/events/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setEvent(mapApiEvent(data));
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Event API unreachable:", err.message);
        setError("No se pudo cargar el evento");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top"]} className="bg-bg">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !event) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top"]} className="bg-bg">
        <View className="flex-1 items-center justify-center px-6">
          <UIText variant="heading-md" className="text-fg">
            {error || "Evento no encontrado"}
          </UIText>
          <Button
            text="Volver al inicio"
            variant="secondary"
            className="mt-6"
            onPress={() => router.back()}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]} className="bg-bg">
    <ScrollView className="flex-1">
      <View className="p-4 pb-16">
        {/* Cover image or gradient fallback */}
        {event.coverImageUrl ? (
          <View className="aspect-[4/5] overflow-hidden rounded-[28px]">
            <Image
              source={{ uri: event.coverImageUrl }}
              className="h-full w-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 p-4">
              <View className="flex-row items-start justify-between">
                {event.showStatus && (
                  <Badge variant={event.statusVariant}>{event.status}</Badge>
                )}
                {event.category ? <Badge variant="ink">{event.category}</Badge> : null}
              </View>
            </View>
          </View>
        ) : (
          <View className="aspect-[4/5] rounded-[28px] bg-surface-raised p-4">
            <View className="flex-row items-start justify-between">
              {event.showStatus && (
                <Badge variant={event.statusVariant}>{event.status}</Badge>
              )}
              {event.category ? <Badge variant="ink">{event.category}</Badge> : null}
            </View>
          </View>
        )}

        <UIText variant="overline" className="mt-6 text-fg-muted">
          {event.genreTags.map((t) => t.toUpperCase()).join(" · ") || event.category}
        </UIText>
        <UIText variant="display-sm" className="mt-2">
          {event.title}
        </UIText>
        <UIText variant="body-md" className="mt-4 text-fg-secondary">
          {event.description}
        </UIText>

        <GlassCard className="mt-6">
          <View className="flex-row flex-wrap gap-4">
            <View className="min-w-[140px] flex-1">
              <UIText variant="overline" className="text-fg-muted">
                Fecha
              </UIText>
              <UIText variant="mono-md" className="mt-2">
                {event.date}
              </UIText>
            </View>
            <View className="min-w-[140px] flex-1">
              <UIText variant="overline" className="text-fg-muted">
                Acceso
              </UIText>
              <UIText variant="mono-md" className="mt-2">
                {event.access || "—"}
              </UIText>
            </View>
            <View className="min-w-[140px] flex-1">
              <UIText variant="overline" className="text-fg-muted">
                Venue
              </UIText>
              <UIText variant="mono-md" className="mt-2">
                {event.venueName}
              </UIText>
            </View>
            <View className="min-w-[140px] flex-1">
              <UIText variant="overline" className="text-fg-muted">
                Precio
              </UIText>
              <UIText variant="mono-md" className="mt-2 text-primary">
                {event.price}
              </UIText>
            </View>
          </View>
        </GlassCard>

        <View className="mt-6 gap-3">
          <Button
            text="Comprar boletos"
            size="xl"
            onPress={() => router.push(Routes.CHECKOUT(event.id))}
          />
          <Button text="Guardar evento" variant="accent" />
          <Button text="Compartir" variant="glass" />
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
