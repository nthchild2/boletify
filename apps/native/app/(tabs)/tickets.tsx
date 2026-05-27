import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text as UIText } from "@repo/ui";
import { HeroHeader, ScreenShell } from "../../components/brutal-mobile";

export default function TicketsScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]} className="bg-bg">
      <ScreenShell padded>
        <HeroHeader
          kicker="MIS TICKETS"
          title={"Tu boleto es\nun objeto."}
          body="Aquí viven tus accesos activos, con status visible y datos en mono tabular."
        />
        <View className="mt-12 items-center">
          <UIText variant="body-lg" className="text-fg-muted text-center">
            Aún no tienes boletos.
          </UIText>
        </View>
      </ScreenShell>
    </SafeAreaView>
  );
}
