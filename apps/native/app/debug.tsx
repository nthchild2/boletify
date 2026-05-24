import { ScrollView, Text, View } from "react-native";
import { Avatar, Badge, Button, Card, GlassCard, Input, Text as TextNative } from "@repo/ui";

export default function DebugPage() {
  return (
    <ScrollView className="flex-1 bg-bg px-4 pt-4">
      <View className="mb-6">
        <View className="mb-5 self-start rounded-xs border border-border-strong px-3 py-2">
          <Text className="font-body text-overline uppercase text-fg-muted">shared components</Text>
        </View>
        <Text className="font-display text-[44px] font-black leading-[42px] tracking-[-0.03em] text-fg">
          Debug ya no
          {"\n"}parece placeholder.
        </Text>
        <Text className="mt-3 text-body-md text-fg-secondary">
          Esta página ahora funciona como una hoja de estilo viva para revisar si los componentes compartidos realmente siguen el brutal glass del preview.
        </Text>
      </View>

      <View className="gap-6 pb-6">
        <GlassCard>
          <TextNative variant="heading-lg" className="mb-5">Buttons</TextNative>
          <View className="flex-row flex-wrap gap-3">
            <Button text="Primary" onPress={() => console.log("primary")} />
            <Button text="Accent" variant="accent" onPress={() => console.log("accent")} />
            <Button text="Secondary" variant="secondary" onPress={() => console.log("secondary")} />
            <Button text="Ghost" variant="ghost" onPress={() => console.log("ghost")} />
            <Button text="Glass" variant="glass" onPress={() => console.log("glass")} />
            <Button text="Danger" variant="danger" onPress={() => console.log("danger")} />
            <Button text="Disabled" disabled onPress={() => console.log("disabled")} />
          </View>
          <View className="mt-4 flex-row flex-wrap items-center gap-3">
            <Button text="SM" size="sm" />
            <Button text="MD" size="md" />
            <Button text="LG" size="lg" />
            <Button text="Encontrar boletos" size="xl" />
          </View>
        </GlassCard>

        <View className="gap-6 lg:grid lg:grid-cols-2">
          <Card className="gap-4">
            <TextNative variant="heading-md">Forms</TextNative>
            <Input label="Correo electrónico" placeholder="tu@correo.com" hint="Te mandamos el boleto aquí." />
            <Input label="Código de promoción" placeholder="INSERTA CÓDIGO" />
            <Input label="Número de boletos" placeholder="11" error="Máximo 10 por compra." />
            <Input label="Password" placeholder="••••••••" secureTextEntry />
          </Card>

          <GlassCard className="gap-4">
            <TextNative variant="heading-md">Glass Surface</TextNative>
            <Input
              label="Búsqueda"
              placeholder="¿Qué vas a ver esta noche?"
              glass
              hint="Variante pensada para overlays y hero surfaces."
            />
            <View className="flex-row flex-wrap gap-3">
              <Badge variant="signal">EN VENTA</Badge>
              <Badge variant="ink">INDIE</Badge>
              <Badge variant="sun">PENDIENTE</Badge>
            </View>
          </GlassCard>
        </View>

        <View className="gap-6 lg:grid lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="gap-5">
            <TextNative variant="heading-md">Card / Event Shell</TextNative>
            <View className="overflow-hidden rounded-lg border border-border bg-bg shadow-brick-md">
              <View className="aspect-[4/5] justify-between p-4 bg-gradient-to-br from-[#24112B] via-[#140C1A] to-[#140C1A]">
                <View className="flex-row justify-between">
                  <Badge variant="signal">EN VENTA</Badge>
                  <Badge variant="ink">INDIE</Badge>
                </View>
              </View>
              <View className="gap-2 p-5">
                <TextNative variant="mono-sm" className="text-fg-muted">FORO INDIE ROCK</TextNative>
                <TextNative variant="heading-md">Noche de Indie Rock · CDMX</TextNative>
                <View className="flex-row justify-between">
                  <TextNative variant="body-sm" className="text-fg-muted">Foro Puebla · Roma Nte</TextNative>
                  <TextNative variant="mono-md" className="text-primary">$450 MXN</TextNative>
                </View>
              </View>
            </View>
          </Card>

          <GlassCard className="gap-5">
            <TextNative variant="heading-md">People / Status</TextNative>
            <View className="flex-row items-center gap-4">
              <Avatar initials="CC" size="lg" />
              <View className="gap-1">
                <TextNative variant="heading-sm">Carlos Cortes</TextNative>
                <TextNative variant="body-sm" className="text-fg-muted">Organizador · Roma Nte</TextNative>
              </View>
            </View>
            <View className="flex-row flex-wrap gap-3">
              <Badge variant="leaf">PAGADO</Badge>
              <Badge variant="cenote">INFO</Badge>
              <Badge variant="oxblood">CANCELADO</Badge>
            </View>
          </GlassCard>
        </View>

        <View className="rounded-lg border border-border bg-surface p-6 shadow-brick-md">
          <TextNative variant="heading-lg" className="mb-5">Typography</TextNative>
          <View className="gap-3">
            <TextNative variant="display-lg">La noche</TextNative>
            <TextNative variant="heading-lg">Foro Puebla · Sábado 17 de mayo</TextNative>
            <TextNative variant="heading-md">Triplete · Las Nubes · Fuente de Juventud</TextNative>
            <TextNative variant="body-lg" className="text-fg-secondary">
              Compra tu boleto sin cargos ocultos y recibe tu QR al correo en segundos.
            </TextNative>
            <TextNative variant="overline" className="text-fg-muted">DESCUBRE · NOCHES · SONIDOS · CDMX</TextNative>
            <TextNative variant="mono-md" className="text-primary">$450.00 MXN · TCK-0412-0091</TextNative>
            <TextNative variant="caption" className="text-fg-subtle">Caption para ayuda y microcopy.</TextNative>
          </View>
        </View>
      </View>
      </ScrollView>
  );
}
