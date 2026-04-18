import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Routes } from "@boletify/routes";
import { Badge, Button, GlassCard, Text as UIText } from "@repo/ui";
import { mobileEvents } from "../../lib/mock-data";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const event = mobileEvents.find((entry) => entry.id === id) ?? mobileEvents[0];

  return (
    <ScrollView className="flex-1 bg-ink-950">
      <View className="p-4 pb-16">
        <View className={`aspect-[4/5] rounded-[28px] p-4 ${event.gradientClassName}`}>
          <View className="flex-row items-start justify-between">
            <Badge variant="signal">{event.status}</Badge>
            <Badge variant="ink">{event.category}</Badge>
          </View>
          <View className="mt-auto">
            <Text className="font-display text-[40px] font-black leading-[38px] tracking-[-0.03em] text-bone-50">
              {event.title}
            </Text>
          </View>
        </View>

        <UIText variant="overline" className="mt-6 text-ink-300">
          {event.eyebrow}
        </UIText>
        <UIText variant="display-sm" className="mt-2">
          {event.title}
        </UIText>
        <UIText variant="body-md" className="mt-4 text-ink-200">
          {event.description}
        </UIText>

        <GlassCard className="mt-6">
          <View className="flex-row flex-wrap gap-4">
            <View className="min-w-[140px] flex-1">
              <UIText variant="overline" className="text-ink-300">
                Fecha
              </UIText>
              <UIText variant="mono-md" className="mt-2">
                {event.date}
              </UIText>
            </View>
            <View className="min-w-[140px] flex-1">
              <UIText variant="overline" className="text-ink-300">
                Acceso
              </UIText>
              <UIText variant="mono-md" className="mt-2">
                {event.access}
              </UIText>
            </View>
            <View className="min-w-[140px] flex-1">
              <UIText variant="overline" className="text-ink-300">
                Venue
              </UIText>
              <UIText variant="mono-md" className="mt-2">
                {event.venue}
              </UIText>
            </View>
            <View className="min-w-[140px] flex-1">
              <UIText variant="overline" className="text-ink-300">
                Precio
              </UIText>
              <UIText variant="mono-md" className="mt-2 text-signal-500">
                {event.price}
              </UIText>
            </View>
          </View>
        </GlassCard>

        <View className="mt-6 gap-3">
          <Button text="Comprar boletos" size="xl" onPress={() => router.push(Routes.CHECKOUT(id))} />
          <Button text="Guardar evento" variant="accent" />
          <Button text="Compartir" variant="glass" />
        </View>
      </View>
    </ScrollView>
  );
}
