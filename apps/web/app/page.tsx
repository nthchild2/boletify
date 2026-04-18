"use client";

import { Button, Input } from "@repo/ui";

export default function Web() {
  return (
    <div className="min-h-screen bg-ink-950 p-8">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-display-md text-bone-50 font-display">
          Boletify
        </h1>
        
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
        
        <Input 
          label="With Error"
          placeholder="Input with error"
          error="Este campo es requerido"
        />
      </div>
    </div>
  );
}