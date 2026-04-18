import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, Input } from "@repo/ui";

export default function Native() {
  return (
    <View className="flex-1 bg-ink-950 p-8 items-center justify-center">
      <View className="w-full max-w-md space-y-6">
        <Text className="text-display-md text-bone-50 font-display mb-8">
          Boletify
        </Text>
        
        <Button 
          text="Primary Button" 
          onPress={() => console.log("pressed!")} 
        />
        
        <Button 
          text="Secondary Button" 
          variant="secondary"
          onPress={() => console.log("pressed!")} 
        />
        
        <Input 
          label="Email"
          placeholder="correo@ejemplo.com"
        />
        
        <Input 
          label="Password"
          placeholder="Contraseña"
          secureTextEntry
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}