import { View } from "react-native";
import { Badge, Card, Input, Text as UIText } from "@repo/ui";
import { HeroHeader, ScreenShell } from "../../components/brutal-mobile";

export default function SearchScreen() {
  return (
    <ScreenShell>
      <HeroHeader
        kicker="BUSCAR · EXPLORAR"
        title={"Busca por\nsonido."}
        body="Explora artistas, recintos y géneros desde una superficie glass pensada para móvil."
      />
      <Input
        label="Búsqueda"
        placeholder="¿Qué vas a ver esta noche?"
        glass
        containerClassName="mt-6"
      />
      <View className="mt-4 flex-row flex-wrap gap-2">
        <Badge variant="signal">HOY</Badge>
        <Badge variant="ink">INDIE</Badge>
        <Badge variant="ink">CUMBIA</Badge>
        <Badge variant="ink">ELECTRÓNICA</Badge>
      </View>
      <Card className="mt-8">
        <UIText variant="heading-md">Sugerencias</UIText>
        <UIText variant="body-sm" className="mt-3 text-ink-300">
          Foro Puebla · Salón Los Ángeles · Terraza Condesa
        </UIText>
      </Card>
    </ScreenShell>
  );
}
