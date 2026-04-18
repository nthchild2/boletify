import { View, Text, ScrollView } from "react-native";
import { Button, Input, Badge, Card, GlassCard, Text as TextNative } from "@repo/ui";

export default function DebugPage() {
  return (
    <ScrollView className="flex-1 bg-ink-950 p-4">
      <Text className="text-display-md text-bone-50 font-display mb-6">
        Debug - Componentes
      </Text>

      <View className="space-y-6">
        <View>
          <Text className="text-lg text-bone-50 font-medium mb-3">Button</Text>
          <View className="gap-3">
            <Button text="Primary" onPress={() => console.log("primary")} />
            <Button text="Secondary" variant="secondary" onPress={() => console.log("secondary")} />
          </View>
        </View>

        <View>
          <Text className="text-lg text-bone-50 font-medium mb-3">Input</Text>
          <View className="gap-3">
            <Input label="Default" placeholder="Placeholder..." />
            <Input label="With Error" placeholder="Error" error="Error message" />
            <Input label="Secure" placeholder="Password" secureTextEntry />
          </View>
        </View>

        <View>
          <Text className="text-lg text-bone-50 font-medium mb-3">Badge</Text>
          <View className="flex flex-wrap gap-2">
            <Badge variant="signal">Available</Badge>
            <Badge variant="sun">Low Stock</Badge>
            <Badge variant="oxblood">Sold Out</Badge>
          </View>
        </View>

        <View>
          <Text className="text-lg text-bone-50 font-medium mb-3">Card</Text>
          <Card>
            <Text className="text-bone-300">Card content</Text>
          </Card>
        </View>

        <View>
          <Text className="text-lg text-bone-50 font-medium mb-3">GlassCard</Text>
          <GlassCard>
            <Text className="text-bone-300">Glass card content</Text>
          </GlassCard>
        </View>

        <View>
          <Text className="text-lg text-bone-50 font-medium mb-3">Text</Text>
          <View className="gap-1">
            <TextNative variant="display">Display</TextNative>
            <TextNative variant="heading">Heading</TextNative>
            <TextNative variant="body">Body</TextNative>
            <TextNative variant="caption">Caption</TextNative>
          </View>
        </View>

        <View>
          <Text className="text-lg text-bone-50 font-medium mb-3">Colors - Ink</Text>
          <View className="flex flex-wrap flex-row gap-2">
            {["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"].map((shade) => (
              <View key={shade} className={`w-8 h-8 bg-ink-${shade} rounded items-center justify-center`}>
                <Text className="text-[10px] text-white">{shade}</Text>
              </View>
            ))}
          </View>
        </View>

        <View>
          <Text className="text-lg text-bone-50 font-medium mb-3">Colors - Bone</Text>
          <View className="flex flex-wrap flex-row gap-2">
            {["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"].map((shade) => (
              <View key={shade} className={`w-8 h-8 bg-bone-${shade} rounded items-center justify-center`}>
                <Text className="text-[10px] text-ink-900">{shade}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}