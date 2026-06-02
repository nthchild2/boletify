/**
 * Organiser event detail screen.
 * Shows event info, publish/delete actions, link to edit.
 */

import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Text as UIText } from "@repo/ui";
import { ScreenShell } from "../../../components/brutal-mobile";
import { useThemeColors } from "../../../lib/theme";
import { apiFetch } from "../../../lib/api";

type EventDetail = {
  id: number;
  title: string;
  description: string | null;
  venueName: string;
  venueAddress: string | null;
  city: string;
  status: string;
  startDate: string | null;
  coverImageUrl: string | null;
  genreTags: string[] | null;
  ticketTiers: any[];
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Borrador",
  published: "Publicado",
  cancelled: "Cancelado",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Sin fecha";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (d.getHours() === 0 && d.getMinutes() === 0) return "";
  return (
    d.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }) + " hrs"
  );
}

export default function OrgEventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const eventId = parseInt(id!, 10);
  const colors = useThemeColors();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const fetchEvent = useCallback(async () => {
    try {
      setError(null);
      const data = await apiFetch<EventDetail>(`/api/org/events/${eventId}`);
      setEvent(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  async function handlePublish() {
    setPublishing(true);
    try {
      await apiFetch(`/api/org/events/${eventId}/publish`, { method: "POST" });
      await fetchEvent();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setPublishing(false);
    }
  }

  function handleDelete() {
    Alert.alert(
      "Eliminar evento",
      "Esto es permanente. El evento sera eliminado.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await apiFetch(`/api/org/events/${eventId}`, {
                method: "DELETE",
              });
              router.replace("/org");
            } catch (err: any) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ],
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScreenShell>
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </ScreenShell>
      </SafeAreaView>
    );
  }

  if (error || !event) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScreenShell>
          <View className="flex-1 items-center justify-center">
            <Text className="text-[14px] text-fg-muted">
              {error || "Evento no encontrado"}
            </Text>
            <Pressable onPress={() => router.back()} className="mt-4">
              <Text className="text-primary">Volver</Text>
            </Pressable>
          </View>
        </ScreenShell>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <ScreenShell>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Back nav */}
          <Pressable
            onPress={() => router.back()}
            className="mb-3 flex-row items-center gap-1"
          >
            <Text className="text-[12px] text-fg-muted">{"<"}</Text>
            <Text className="font-body text-[12px] uppercase tracking-wider text-fg-muted">
              Mis eventos
            </Text>
          </Pressable>

          {/* Title + status */}
          <View className="flex-row items-center gap-3">
            <Text className="flex-1 font-display text-[28px] font-black tracking-[-0.03em] text-fg">
              {event.title}
            </Text>
            <View
              className="rounded-full border px-2.5 py-1"
              style={{
                borderColor:
                  event.status === "published"
                    ? colors.primary + "40"
                    : "#88888840",
                backgroundColor:
                  event.status === "published"
                    ? colors.primary + "15"
                    : "#88888815",
              }}
            >
              <Text
                className="font-body text-[10px] font-semibold uppercase"
                style={{
                  color:
                    event.status === "published" ? colors.primary : "#888",
                }}
              >
                {STATUS_LABELS[event.status] || event.status}
              </Text>
            </View>
          </View>

          {/* Action buttons */}
          <View className="mt-4 flex-row gap-2">
            {event.status === "draft" && (
              <Pressable
                onPress={handlePublish}
                disabled={publishing}
                className="rounded-lg bg-primary px-5 py-2.5"
                style={publishing ? { opacity: 0.5 } : {}}
              >
                <Text className="font-body text-[12px] font-semibold uppercase text-primary-fg">
                  {publishing ? "Publicando..." : "Publicar"}
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => router.push(`/org/edit/${event.id}`)}
              className="rounded-lg border border-border px-5 py-2.5"
            >
              <Text className="font-body text-[12px] font-semibold uppercase text-fg">
                Editar
              </Text>
            </Pressable>
          </View>

          {/* Info cards */}
          <View className="mt-6 flex-row flex-wrap gap-3">
            <InfoCard label="Fecha" value={formatDate(event.startDate)} />
            <InfoCard label="Hora" value={formatTime(event.startDate) || "—"} />
            <InfoCard label="Venue" value={event.venueName} />
            <InfoCard label="Ciudad" value={event.city} />
          </View>

          {/* Cover image */}
          {event.coverImageUrl && (
            <Image
              source={{ uri: event.coverImageUrl }}
              className="mt-6 h-[200px] w-full rounded-xl"
              resizeMode="cover"
            />
          )}

          {/* Description */}
          {event.description && (
            <View className="mt-6">
              <Text className="mb-1 font-body text-[11px] font-semibold uppercase tracking-widest text-fg-muted">
                Descripcion
              </Text>
              <Text className="text-[14px] leading-relaxed text-fg-secondary">
                {event.description}
              </Text>
            </View>
          )}

          {/* Genre tags */}
          {event.genreTags && event.genreTags.length > 0 && (
            <View className="mt-6">
              <Text className="mb-2 font-body text-[11px] font-semibold uppercase tracking-widest text-fg-muted">
                Genero
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {event.genreTags.map((tag) => (
                  <View
                    key={tag}
                    className="rounded-full border border-border bg-surface-raised px-3 py-1"
                  >
                    <Text className="text-[12px] text-fg-muted">{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Danger zone */}
          <View className="mt-12 border-t border-border pt-6">
            <Text className="mb-3 font-body text-[11px] font-semibold uppercase tracking-widest text-danger">
              Zona peligrosa
            </Text>
            <Pressable
              onPress={handleDelete}
              className="self-start rounded-lg border border-danger/30 px-4 py-2.5"
            >
              <Text className="font-body text-[12px] font-semibold uppercase text-danger">
                Eliminar evento
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenShell>
    </SafeAreaView>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <View className="min-w-[45%] flex-1 rounded-lg border border-border bg-surface p-3">
      <Text className="font-body text-[11px] uppercase tracking-widest text-fg-muted">
        {label}
      </Text>
      <Text className="mt-1 font-mono text-[13px] text-fg">{value}</Text>
    </View>
  );
}
