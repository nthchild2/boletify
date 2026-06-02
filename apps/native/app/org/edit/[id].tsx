/**
 * Edit event screen for organisers.
 * Fetches existing event data, lets the user modify fields,
 * PATCHes /api/org/events/:id on save.
 */

import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenShell } from "../../../components/brutal-mobile";
import { useThemeColors } from "../../../lib/theme";
import { apiFetch } from "../../../lib/api";

export default function EditEventScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const eventId = parseInt(id!, 10);
  const colors = useThemeColors();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [city, setCity] = useState("CDMX");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [genreTags, setGenreTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const event = await apiFetch<any>(`/api/org/events/${eventId}`);
        setTitle(event.title || "");
        setDescription(event.description || "");
        setVenueName(event.venueName || "");
        setVenueAddress(event.venueAddress || "");
        setCity(event.city || "CDMX");
        setCoverImageUrl(event.coverImageUrl || "");
        setGenreTags(event.genreTags?.join(", ") || "");
        if (event.startDate) {
          const d = new Date(event.startDate);
          setStartDate(d.toISOString().split("T")[0]);
          const h = d.getHours().toString().padStart(2, "0");
          const m = d.getMinutes().toString().padStart(2, "0");
          if (h !== "00" || m !== "00") setStartTime(`${h}:${m}`);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const dateTime = `${startDate}T${startTime || "00:00"}`;
      const parsedDate = new Date(dateTime);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Fecha invalida");
      }

      await apiFetch(`/api/org/events/${eventId}`, {
        method: "PATCH",
        body: {
          title,
          description: description || undefined,
          venueName,
          venueAddress: venueAddress || undefined,
          city,
          startDate: parsedDate.toISOString(),
          coverImageUrl: coverImageUrl || undefined,
          genreTags: genreTags
            ? genreTags.split(",").map((t) => t.trim().toLowerCase())
            : undefined,
        },
      });

      router.back();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
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

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <ScreenShell>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between">
              <Pressable onPress={() => router.back()}>
                <Text className="font-body text-[13px] uppercase text-fg-muted">
                  Cancelar
                </Text>
              </Pressable>
              <Text className="font-display text-[20px] font-black text-fg">
                Editar evento
              </Text>
              <Pressable onPress={handleSave} disabled={saving}>
                <Text
                  className="font-body text-[13px] font-semibold uppercase text-primary"
                  style={saving ? { opacity: 0.5 } : {}}
                >
                  {saving ? "Guardando..." : "Guardar"}
                </Text>
              </Pressable>
            </View>

            {error && (
              <View className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3">
                <Text className="text-[13px] text-danger">{error}</Text>
              </View>
            )}

            <View className="mt-6 gap-5">
              <FormField label="Nombre del evento *">
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  className="rounded-lg border border-border bg-surface px-3.5 py-3 font-body text-[14px] text-fg"
                  placeholderTextColor={colors.fgSubtle}
                />
              </FormField>

              <FormField label="Descripcion">
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                  className="rounded-lg border border-border bg-surface px-3.5 py-3 font-body text-[14px] text-fg"
                  placeholderTextColor={colors.fgSubtle}
                  style={{ minHeight: 80, textAlignVertical: "top" }}
                />
              </FormField>

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <FormField label="Venue *">
                    <TextInput
                      value={venueName}
                      onChangeText={setVenueName}
                      className="rounded-lg border border-border bg-surface px-3.5 py-3 font-body text-[14px] text-fg"
                      placeholderTextColor={colors.fgSubtle}
                    />
                  </FormField>
                </View>
                <View className="flex-1">
                  <FormField label="Ciudad">
                    <TextInput
                      value={city}
                      onChangeText={setCity}
                      className="rounded-lg border border-border bg-surface px-3.5 py-3 font-body text-[14px] text-fg"
                      placeholderTextColor={colors.fgSubtle}
                    />
                  </FormField>
                </View>
              </View>

              <FormField label="Direccion del venue">
                <TextInput
                  value={venueAddress}
                  onChangeText={setVenueAddress}
                  className="rounded-lg border border-border bg-surface px-3.5 py-3 font-body text-[14px] text-fg"
                  placeholderTextColor={colors.fgSubtle}
                />
              </FormField>

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <FormField label="Fecha (YYYY-MM-DD) *">
                    <TextInput
                      value={startDate}
                      onChangeText={setStartDate}
                      className="rounded-lg border border-border bg-surface px-3.5 py-3 font-mono text-[14px] text-fg"
                      placeholderTextColor={colors.fgSubtle}
                    />
                  </FormField>
                </View>
                <View className="flex-1">
                  <FormField label="Hora (HH:MM)">
                    <TextInput
                      value={startTime}
                      onChangeText={setStartTime}
                      className="rounded-lg border border-border bg-surface px-3.5 py-3 font-mono text-[14px] text-fg"
                      placeholderTextColor={colors.fgSubtle}
                    />
                  </FormField>
                </View>
              </View>

              <FormField label="URL imagen de portada">
                <TextInput
                  value={coverImageUrl}
                  onChangeText={setCoverImageUrl}
                  autoCapitalize="none"
                  keyboardType="url"
                  className="rounded-lg border border-border bg-surface px-3.5 py-3 font-body text-[14px] text-fg"
                  placeholderTextColor={colors.fgSubtle}
                />
              </FormField>

              <FormField label="Tags de genero (separados por coma)">
                <TextInput
                  value={genreTags}
                  onChangeText={setGenreTags}
                  className="rounded-lg border border-border bg-surface px-3.5 py-3 font-body text-[14px] text-fg"
                  placeholderTextColor={colors.fgSubtle}
                />
              </FormField>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenShell>
    </SafeAreaView>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View>
      <Text className="mb-1.5 font-body text-[11px] font-semibold uppercase tracking-widest text-fg-muted">
        {label}
      </Text>
      {children}
    </View>
  );
}
