/**
 * Create event screen for organisers.
 * Simple form → POST /api/org/events → navigate to event detail.
 */

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ScreenShell } from "../../components/brutal-mobile";
import { useThemeColors } from "../../lib/theme";
import { apiFetch } from "../../lib/api";

export default function CreateEventScreen() {
  const router = useRouter();
  const colors = useThemeColors();

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

  async function handleCreate() {
    if (!title || !venueName || !startDate) {
      setError("Nombre, venue y fecha son requeridos");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const dateTime = `${startDate}T${startTime || "00:00"}`;
      const parsedDate = new Date(dateTime);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Fecha invalida. Usa formato YYYY-MM-DD");
      }

      const event = await apiFetch<{ id: number }>("/api/org/events", {
        method: "POST",
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

      router.replace(`/org/event/${event.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
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
                Nuevo evento
              </Text>
              <Pressable onPress={handleCreate} disabled={saving}>
                <Text
                  className="font-body text-[13px] font-semibold uppercase text-primary"
                  style={saving ? { opacity: 0.5 } : {}}
                >
                  {saving ? "Creando..." : "Crear"}
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
                  placeholder="Ej: Noche Indie en Foro Sol"
                  className="rounded-lg border border-border bg-surface px-3.5 py-3 font-body text-[14px] text-fg"
                  placeholderTextColor={colors.fgSubtle}
                />
              </FormField>

              <FormField label="Descripcion">
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe tu evento..."
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
                      placeholder="Foro Sol"
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
                      placeholder="CDMX"
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
                  placeholder="Av. Viaducto Rio de la Piedad"
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
                      placeholder="2026-06-15"
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
                      placeholder="21:00"
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
                  placeholder="https://..."
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
                  placeholder="indie, electronica, rock"
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
