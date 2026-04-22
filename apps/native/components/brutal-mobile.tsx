import { View, Text, Pressable, Image, ImageBackground } from "react-native";
import { Badge, Button, Card, GlassCard, Input, Text as UIText } from "@repo/ui";
import type { MobileEvent } from "../lib/mock-data";

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function ScreenShell({
  children,
  padded = true,
}: {
  children: React.ReactNode;
  padded?: boolean;
}) {
  return <View className={cn("flex-1 bg-ink-950", padded && "px-4")}>{children}</View>;
}

export function HeroHeader({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body?: string;
}) {
  return (
    <View className="pt-4">
      <View className="self-start rounded-xs border border-ink-700 px-3 py-2">
        <Text className="font-body text-overline uppercase text-ink-300">{kicker}</Text>
      </View>
      <Text className="mt-4 font-display text-[44px] font-black leading-[42px] tracking-[-0.03em] text-bone-50">
        {title}
      </Text>
      {body ? <Text className="mt-3 text-body-md text-ink-200">{body}</Text> : null}
    </View>
  );
}

export function EventTile({
  event,
  onPress,
}: {
  event: MobileEvent;
  onPress?: () => void;
}) {
  const coverUrl = event.coverImageUrl;

  return (
    <Pressable onPress={onPress} className="mb-5">
      <Card className="overflow-hidden p-0">
        {coverUrl ? (
          <ImageBackground
            source={{ uri: coverUrl }}
            className="aspect-[4/5] w-full justify-between p-4"
            imageStyle={{ borderRadius: 0 }}
          >
            <View className="absolute inset-0 bg-black/40" />
            <View className="relative flex-row items-start justify-between">
              <Badge variant="signal">{event.status}</Badge>
              <Badge variant="ink">{event.category}</Badge>
            </View>
            <View className="mt-auto">
              <Text className="font-display text-[38px] font-black uppercase leading-[36px] tracking-[-0.03em] text-white">
                {event.title}
              </Text>
            </View>
          </ImageBackground>
        ) : (
        <View className={cn("aspect-[4/5] p-4", event.gradientClassName)}>
          <View className="flex-row items-start justify-between">
            <Badge variant="signal">{event.status}</Badge>
            <Badge variant="ink">{event.category}</Badge>
          </View>
          <View className="mt-auto">
            <Text className="font-display text-[38px] font-black uppercase leading-[36px] tracking-[-0.03em] text-bone-50">
              {event.title}
            </Text>
          </View>
        </View>
        )}
        <View className="p-5">
          <UIText variant="mono-sm" className="text-ink-300">
            {event.eyebrow}
          </UIText>
          <UIText variant="heading-md" className="mt-1">
            {event.title}
          </UIText>
          <View className="mt-3 flex-row items-center justify-between">
            <UIText variant="body-sm" className="text-ink-300">
              {event.venue} · {event.location}
            </UIText>
            <UIText variant="mono-md" className="text-signal-500">
              {event.price}
            </UIText>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

export function SearchPanel() {
  return (
    <GlassCard className="mt-6">
      <UIText variant="heading-md">Búsqueda</UIText>
      <Input
        label="¿Qué vas a ver esta noche?"
        placeholder="Busca artistas, venues o géneros"
        glass
        containerClassName="mt-4"
      />
      <View className="mt-4 flex-row flex-wrap gap-2">
        <Badge variant="signal">HOY</Badge>
        <Badge variant="ink">INDIE</Badge>
        <Badge variant="ink">CUMBIA</Badge>
      </View>
    </GlassCard>
  );
}

export function CTAStack() {
  return (
    <Pressable className="mt-6 bg-signal-500 h-[52px] rounded-xl items-center justify-center shadow-brick-md">
      <Text className="text-ink-950 font-body text-label font-semibold uppercase">
        Explorar shows →
      </Text>
    </Pressable>
  );
}
