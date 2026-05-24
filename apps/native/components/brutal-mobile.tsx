import { View, Text, Pressable, ImageBackground } from "react-native";
import { Badge, Card, GlassCard, Input, Text as UIText } from "@repo/ui";
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
  return <View className={cn("flex-1 bg-bg", padded && "px-4")}>{children}</View>;
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
      <View className="self-start rounded-xs border border-border-strong px-3 py-2">
        <Text className="font-body text-overline uppercase text-fg-muted">{kicker}</Text>
      </View>
      <Text className="mt-4 font-display text-[44px] font-black leading-[42px] tracking-[-0.03em] text-fg">
        {title}
      </Text>
      {body ? <Text className="mt-3 text-body-md text-fg-secondary">{body}</Text> : null}
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
  // Honor the derived sale-status from @boletify/routes when present.
  // Mock entries that don't set these fields keep the previous behavior
  // (always-visible signal badge) for backwards compatibility.
  const showStatus = event.showStatus !== false && Boolean(event.status);
  const statusVariant = event.statusVariant ?? "signal";

  return (
    <Pressable onPress={onPress} className="mb-5">
      <Card padding="none" className="overflow-hidden">
        {coverUrl ? (
          <ImageBackground
            source={{ uri: coverUrl }}
            className="aspect-[4/5] w-full justify-between"
            // Top corners match the Card's rounded-lg (14px) so the image
            // hugs the card edge on Android too — RN's overflow:hidden
            // doesn't reliably clip child Images at rounded parent corners.
            imageStyle={{ borderTopLeftRadius: 14, borderTopRightRadius: 14 }}
          >
            {/* Dark scrim is intentional — posters carry their own imagery
                and the dark wash gives consistent contrast for the badges
                regardless of the active theme. */}
            <View className="absolute inset-0 bg-black/40" />
            <View className="absolute top-2 left-2 right-2 flex-row items-start justify-between">
              {showStatus ? (
                <Badge variant={statusVariant}>{event.status}</Badge>
              ) : (
                <View />
              )}
              <Badge variant="ink">{event.category}</Badge>
            </View>
            <View className="absolute bottom-2 left-2 right-2">
              <Text className="font-display text-[38px] font-black uppercase leading-[36px] tracking-[-0.03em] text-white">
                {event.title}
              </Text>
            </View>
          </ImageBackground>
        ) : (
        <View
          className="aspect-[4/5]"
          style={{ backgroundColor: "#0a0a0a" }}
        >
          <View className="absolute top-2 left-2 right-2 flex-row items-start justify-between">
            {showStatus ? (
              <Badge variant={statusVariant}>{event.status}</Badge>
            ) : (
              <View />
            )}
            <Badge variant="ink">{event.category}</Badge>
          </View>
          <View className="absolute bottom-2 left-2 right-2">
            <Text className="font-display text-[38px] font-black uppercase leading-[36px] tracking-[-0.03em] text-white">
              {event.title}
            </Text>
          </View>
        </View>
        )}
        <View className="p-5">
          {/* Eyebrow = date + time (tabular mono per docs §8.6).
              The title is intentionally NOT repeated here — the poster
              overlay above is the title. The venue is in the detail row,
              not duplicated in the eyebrow. */}
          <UIText variant="mono-sm" className="text-fg-muted">
            {event.date}
            {event.access ? ` · ${event.access}` : ""}
          </UIText>
          <View className="mt-3 flex-row items-center justify-between">
            <UIText variant="body-sm" className="text-fg-secondary">
              {event.venue} · {event.location}
            </UIText>
            <UIText variant="mono-md" className="text-primary">
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
  // Uses explicit `dark:` variants instead of the `bg-primary` semantic
  // token. NativeWind v4's CSS-variable resolution can be inconsistent for
  // background utilities under runtime colorScheme changes, so we pin both
  // halves of the swap here. Result matches docs §9: light = ink-on-cream
  // CTA with signal-lime text; dark = signal-lime CTA with ink text.
  return (
    <Pressable className="mt-6 h-[52px] rounded-xl items-center justify-center shadow-brick-md bg-ink-950 dark:bg-signal-500">
      <Text className="font-body text-label font-semibold uppercase text-signal-500 dark:text-ink-950">
        Explorar shows →
      </Text>
    </Pressable>
  );
}
