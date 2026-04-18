import { ScrollView, Text, View } from "react-native";
import { Avatar, Badge, Button, Card, GlassCard, Input, Text as TextNative } from "@repo/ui";

export default function DebugPage() {
  return (
    <ScrollView className="flex-1 bg-ink-950 px-4 pt-4">
      <Text className="font-display text-[44px] font-black leading-[42px] tracking-[-0.03em] text-bone-50">
        Native
        {"\n"}specimen.
      </Text>

      <View className="gap-6 py-6">
        <GlassCard>
          <Text className="mb-3 font-display text-heading-md text-bone-50">Buttons</Text>
          <View className="gap-3">
            <Button text="Primary" onPress={() => console.log("primary")} />
            <Button text="Accent" variant="accent" onPress={() => console.log("accent")} />
            <Button text="Secondary" variant="secondary" onPress={() => console.log("secondary")} />
            <Button text="Glass" variant="glass" onPress={() => console.log("glass")} />
            <Button text="Encontrar boletos" size="xl" onPress={() => console.log("xl")} />
          </View>
        </GlassCard>

        <Card>
          <Text className="mb-3 font-display text-heading-md text-bone-50">Inputs</Text>
          <View className="gap-3">
            <Input label="Correo electrónico" placeholder="Placeholder..." hint="Te mandamos el boleto aquí." />
            <Input label="Con error" placeholder="Error" error="Máximo 10 por compra." />
            <Input label="Búsqueda glass" placeholder="¿Qué vas a ver esta noche?" glass />
          </View>
        </Card>

        <View>
          <Text className="mb-3 font-display text-heading-md text-bone-50">Badges + avatar</Text>
          <View className="flex-row flex-wrap items-center gap-2">
            <Badge variant="signal">EN VENTA</Badge>
            <Badge variant="sun">PENDIENTE</Badge>
            <Badge variant="oxblood">AGOTADO</Badge>
            <Badge variant="ink">INDIE</Badge>
            <Avatar initials="CC" size="lg" />
          </View>
        </View>

        <View>
          <Text className="mb-3 font-display text-heading-md text-bone-50">Cards</Text>
          <Card>
            <TextNative variant="mono-sm" className="text-ink-300">
              FORO INDIE ROCK
            </TextNative>
            <TextNative variant="heading-md" className="mt-2">
              Noche de Indie Rock
            </TextNative>
            <TextNative variant="body-sm" className="mt-2 text-ink-300">
              Foro Puebla · Roma Nte
            </TextNative>
          </Card>
        </View>

        <View>
          <Text className="mb-3 font-display text-heading-md text-bone-50">GlassCard</Text>
          <GlassCard>
            <TextNative variant="heading-md">El boleto es un objeto.</TextNative>
            <TextNative variant="body-sm" className="mt-2 text-ink-300">
              Glass card content
            </TextNative>
          </GlassCard>
        </View>

        <View>
          <Text className="mb-3 font-display text-heading-md text-bone-50">Text</Text>
          <View className="gap-1">
            <TextNative variant="display-lg">La noche</TextNative>
            <TextNative variant="heading-lg">Foro Puebla · Sábado 17</TextNative>
            <TextNative variant="body-md">Body</TextNative>
            <TextNative variant="caption">Caption</TextNative>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
