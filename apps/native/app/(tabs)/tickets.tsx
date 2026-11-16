import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Routes, formatMxnPrice } from "@boletify/routes";
import { Badge, Button, GlassCard, Text as UIText } from "@repo/ui";
import { HeroHeader, ScreenShell } from "../../components/brutal-mobile";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { useThemeColors } from "../../lib/theme";

type ApiTicket = {
  ticketNumber: string;
  tierName: string;
  status: string;
  qrImageUrl: string;
};
type ApiOrder = {
  orderNumber: string;
  total: number;
  past: boolean;
  event: {
    id: number;
    title: string;
    venueName: string;
    city: string;
    dateLabel: string;
  };
  tickets: ApiTicket[];
};

const INACTIVE: Record<string, string> = {
  used: "YA SE USÓ",
  refunded: "REEMBOLSADO",
  cancelled: "CANCELADO",
};

function summary(order: ApiOrder): string {
  const n = order.tickets.length;
  const tiers = Array.from(new Set(order.tickets.map((t) => t.tierName))).join(
    " · ",
  );
  return `${n} ${n === 1 ? "boleto" : "boletos"} · ${tiers}`;
}

/** Full-screen QR view for one order (B-09): swipe between tickets. */
function OrderQrView({
  order,
  onClose,
}: {
  order: ApiOrder;
  onClose: () => void;
}) {
  const { width, height } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  // As large as possible, but leave room for the header and ticket label on short screens.
  const qrSize = Math.max(200, Math.min(width - 48, height * 0.5, 420));

  return (
    <ScreenShell padded={false}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable onPress={onClose} accessibilityRole="button" hitSlop={12}>
          <UIText variant="mono-md" className="text-fg-secondary">
            ← Volver
          </UIText>
        </Pressable>
        <UIText variant="mono-sm" className="text-fg-muted">
          {order.orderNumber}
        </UIText>
      </View>
      <View className="items-center px-4">
        <UIText variant="heading-lg" className="text-center text-fg">
          {order.event.title}
        </UIText>
        <UIText variant="mono-md" className="mt-1 text-fg-secondary">
          {order.event.dateLabel}
        </UIText>
        <UIText variant="body-sm" className="text-fg-muted">
          {order.event.venueName} · {order.event.city}
        </UIText>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        className="mt-6 flex-grow-0"
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        onScroll={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        scrollEventThrottle={64}
      >
        {order.tickets.map((ticket, i) => (
          <View
            key={ticket.ticketNumber}
            style={{ width }}
            className="items-center px-6"
          >
            <View
              className="rounded-lg border border-border-ink bg-white p-3"
              style={{ opacity: INACTIVE[ticket.status] ? 0.3 : 1 }}
            >
              <Image
                source={{ uri: ticket.qrImageUrl }}
                style={{ width: qrSize - 24, height: qrSize - 24 }}
                accessibilityLabel={`Código QR del boleto ${ticket.ticketNumber}`}
              />
            </View>
            {INACTIVE[ticket.status] ? (
              <Badge variant="oxblood" className="mt-3">
                {INACTIVE[ticket.status]}
              </Badge>
            ) : null}
            <UIText variant="mono-md" className="mt-4 text-fg">
              Boleto {i + 1} de {order.tickets.length}
            </UIText>
            <UIText variant="heading-sm" className="text-fg">
              {ticket.tierName}
            </UIText>
            <UIText variant="mono-sm" className="mt-1 text-fg-muted">
              {ticket.ticketNumber}
            </UIText>
          </View>
        ))}
      </ScrollView>

      {order.tickets.length > 1 ? (
        <View className="mt-4 flex-row justify-center gap-2">
          {order.tickets.map((t, i) => (
            <View
              key={t.ticketNumber}
              className={
                i === index
                  ? "h-2.5 w-6 rounded-full bg-primary"
                  : "h-2.5 w-2.5 rounded-full bg-border-strong"
              }
            />
          ))}
        </View>
      ) : null}

      <UIText variant="caption" className="mt-6 px-6 text-center text-fg-muted">
        🔆 Sube el brillo de tu pantalla para que escaneen tu QR más rápido.
      </UIText>
    </ScreenShell>
  );
}

export default function TicketsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<ApiOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<ApiOrder | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const data = await apiFetch<{ orders: ApiOrder[] }>("/api/tickets");
      setOrders(data.orders);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No pudimos cargar tus boletos.",
      );
    }
  }, [user]);

  // Reload whenever the tab comes into focus (e.g. after buying on the web checkout).
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (selected) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top"]} className="bg-bg">
        <OrderQrView order={selected} onClose={() => setSelected(null)} />
      </SafeAreaView>
    );
  }

  const upcoming = orders?.filter((o) => !o.past) ?? [];
  const past = orders?.filter((o) => o.past) ?? [];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]} className="bg-bg">
      <ScreenShell padded>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 48 }}
          refreshControl={
            user ? (
              <RefreshControl
                refreshing={refreshing}
                tintColor={colors.primary}
                onRefresh={async () => {
                  setRefreshing(true);
                  await load();
                  setRefreshing(false);
                }}
              />
            ) : undefined
          }
        >
          <HeroHeader kicker="MIS BOLETOS" title={"Tu boleto es\nun objeto."} />

          {authLoading ? (
            <ActivityIndicator className="mt-12" color={colors.primary} />
          ) : !user ? (
            <GlassCard className="mt-8">
              <UIText variant="body-md" className="text-fg">
                Inicia sesión con el correo que usaste al comprar para ver tus
                boletos aquí.
              </UIText>
              <Button
                text="Iniciar sesión"
                className="mt-5"
                onPress={() => router.push(Routes.AUTH_SIGNIN)}
              />
            </GlassCard>
          ) : error ? (
            <GlassCard className="mt-8">
              <UIText variant="body-md" className="text-fg">
                {error}
              </UIText>
              <Button
                text="Reintentar"
                variant="secondary"
                className="mt-5"
                onPress={load}
              />
            </GlassCard>
          ) : orders === null ? (
            <ActivityIndicator className="mt-12" color={colors.primary} />
          ) : upcoming.length === 0 && past.length === 0 ? (
            <View className="mt-12 items-center">
              <UIText variant="body-lg" className="text-center text-fg-muted">
                Aún no tienes boletos.
              </UIText>
              <Button
                text="Explorar eventos"
                variant="secondary"
                className="mt-5"
                onPress={() => router.push(Routes.HOME)}
              />
            </View>
          ) : (
            <View className="mt-8 gap-4">
              {upcoming.map((order) => (
                <Pressable
                  key={order.orderNumber}
                  onPress={() => setSelected(order)}
                  accessibilityRole="button"
                  accessibilityLabel={`Ver boletos de ${order.event.title}`}
                >
                  <GlassCard>
                    <View className="w-full items-start">
                      <UIText variant="overline" className="text-fg-muted">
                        Pedido {order.orderNumber}
                      </UIText>
                      <UIText variant="heading-md" className="mt-1 text-fg">
                        {order.event.title}
                      </UIText>
                      <UIText
                        variant="mono-md"
                        className="mt-1 text-fg-secondary"
                      >
                        {order.event.dateLabel}
                      </UIText>
                      <UIText variant="body-sm" className="text-fg-muted">
                        {order.event.venueName} · {order.event.city}
                      </UIText>
                      <UIText variant="mono-md" className="mt-3 text-primary">
                        {summary(order)}
                      </UIText>
                      <UIText variant="label" className="mt-3 text-fg">
                        Ver boletos →
                      </UIText>
                    </View>
                  </GlassCard>
                </Pressable>
              ))}

              {past.length ? (
                <UIText variant="overline" className="mt-6 text-fg-muted">
                  Pasados
                </UIText>
              ) : null}
              {past.map((order) => (
                <View key={order.orderNumber} style={{ opacity: 0.55 }}>
                  <GlassCard>
                    <View className="w-full items-start">
                      <UIText variant="heading-sm" className="text-fg">
                        {order.event.title}
                      </UIText>
                      <UIText
                        variant="mono-sm"
                        className="mt-1 text-fg-secondary"
                      >
                        {order.event.dateLabel} · {summary(order)} ·{" "}
                        {formatMxnPrice(order.total)}
                      </UIText>
                    </View>
                  </GlassCard>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </ScreenShell>
    </SafeAreaView>
  );
}
