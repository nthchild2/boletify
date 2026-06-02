/**
 * Organiser dashboard — lists the organiser's events.
 * Accessible from the Account tab when user.role === 'organiser'.
 */

import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text as UIText } from "@repo/ui";
import { ScreenShell } from "../../components/brutal-mobile";
import { useThemeColors } from "../../lib/theme";
import { useAuth } from "../../lib/auth";
import { apiFetch } from "../../lib/api";

type OrgEvent = {
  id: number;
  title: string;
  venueName: string;
  city: string;
  status: string;
  startDate: string | null;
  coverImageUrl: string | null;
  genreTags: string[] | null;
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Borrador",
  published: "Publicado",
  cancelled: "Cancelado",
  ended: "Finalizado",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "#888",
  published: "#22c55e",
  cancelled: "#ef4444",
  ended: "#6b7280",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Sin fecha";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OrgEventsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { user } = useAuth();
  const [events, setEvents] = useState<OrgEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setError(null);
      const data = await apiFetch<OrgEvent[]>("/api/org/events");
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEvents();
  }, [fetchEvents]);

  const published = events.filter((e) => e.status === "published").length;
  const drafts = events.filter((e) => e.status === "draft").length;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <ScreenShell padded={false}>
        <FlatList
          data={events}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListHeaderComponent={
            <View>
              {/* Header */}
              <View className="flex-row items-center justify-between">
                <Text className="font-display text-[32px] font-black tracking-[-0.03em] text-fg">
                  Mis eventos
                </Text>
                <Pressable
                  onPress={() => router.push("/org/create")}
                  className="rounded-lg bg-primary px-4 py-2.5"
                >
                  <Text className="font-body text-[12px] font-semibold uppercase tracking-wider text-primary-fg">
                    + Crear
                  </Text>
                </Pressable>
              </View>

              {/* Stats row */}
              <View className="mt-4 flex-row gap-3">
                <View className="flex-1 rounded-lg border border-border bg-surface p-3">
                  <UIText variant="overline" className="text-fg-muted">
                    Total
                  </UIText>
                  <UIText variant="mono-md" className="mt-1 text-fg">
                    {events.length}
                  </UIText>
                </View>
                <View className="flex-1 rounded-lg border border-border bg-surface p-3">
                  <UIText variant="overline" className="text-fg-muted">
                    Publicados
                  </UIText>
                  <UIText variant="mono-md" className="mt-1 text-primary">
                    {published}
                  </UIText>
                </View>
                <View className="flex-1 rounded-lg border border-border bg-surface p-3">
                  <UIText variant="overline" className="text-fg-muted">
                    Borradores
                  </UIText>
                  <UIText variant="mono-md" className="mt-1 text-fg-muted">
                    {drafts}
                  </UIText>
                </View>
              </View>

              {error && (
                <View className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3">
                  <Text className="text-[13px] text-danger">{error}</Text>
                </View>
              )}

              <UIText variant="heading-md" className="mt-6 mb-3">
                Eventos
              </UIText>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/org/event/${item.id}`)}
              className="mb-3 rounded-lg border border-border bg-surface p-4"
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-3">
                  <Text className="font-body text-[15px] font-semibold text-fg">
                    {item.title}
                  </Text>
                  <Text className="mt-1 font-body text-[12px] text-fg-muted">
                    {item.venueName} · {item.city}
                  </Text>
                  <Text className="mt-0.5 font-mono text-[11px] text-fg-muted">
                    {formatDate(item.startDate)}
                  </Text>
                </View>
                <View
                  className="rounded-full px-2.5 py-1"
                  style={{ backgroundColor: (STATUS_COLORS[item.status] || "#888") + "20" }}
                >
                  <Text
                    className="font-body text-[10px] font-semibold uppercase"
                    style={{ color: STATUS_COLORS[item.status] || "#888" }}
                  >
                    {STATUS_LABELS[item.status] || item.status}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            loading ? (
              <View className="items-center py-12">
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : (
              <View className="items-center py-12">
                <Text className="text-[14px] text-fg-muted">
                  No tienes eventos todavia.
                </Text>
                <Pressable
                  onPress={() => router.push("/org/create")}
                  className="mt-4 rounded-lg bg-primary px-6 py-3"
                >
                  <Text className="font-body text-[13px] font-semibold uppercase text-primary-fg">
                    Crear tu primer evento
                  </Text>
                </Pressable>
              </View>
            )
          }
        />
      </ScreenShell>
    </SafeAreaView>
  );
}
