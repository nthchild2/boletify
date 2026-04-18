"use client";

import { Avatar, Badge, Button, Card, GlassCard, Input, Text } from "@repo/ui";

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-mesh-gradient text-bone-50">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-ink-800 bg-[rgba(8,8,12,0.72)] px-5 py-3 backdrop-blur-[20px] md:px-12">
        <div className="font-display text-[22px] font-black tracking-[-0.03em]">
          bolet<span className="text-signal-500">ify</span>
        </div>
        <div className="font-mono text-mono-sm uppercase tracking-[0.08em] text-ink-300">
          debug · ui specimen
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-12 px-5 py-10 md:px-12">
        <header className="space-y-5">
          <div className="inline-flex items-center gap-3 rounded-xs border border-ink-700 px-[14px] py-2 font-body text-overline uppercase text-ink-300">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-500 shadow-glow-signal" />
            shared components
          </div>
          <h1 className="font-display text-[56px] font-black leading-[0.9] tracking-[-0.04em] md:text-[96px]">
            Debug ya no
            <br />
            parece placeholder.
          </h1>
          <p className="max-w-3xl text-body-lg text-ink-200">
            Esta página ahora funciona como una hoja de estilo viva para revisar si los
            componentes compartidos realmente siguen el brutal glass del preview.
          </p>
        </header>

        <section className="space-y-5 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-glass-lg backdrop-blur-glass-md">
          <Text variant="heading-lg">Buttons</Text>
          <div className="flex flex-wrap gap-4">
            <Button text="Primary" onPress={() => console.log("primary")} />
            <Button text="Accent" variant="accent" onPress={() => console.log("accent")} />
            <Button text="Secondary" variant="secondary" onPress={() => console.log("secondary")} />
            <Button text="Glass" variant="glass" onPress={() => console.log("glass")} />
            <Button text="Danger" variant="danger" onPress={() => console.log("danger")} />
            <Button text="Disabled" disabled onPress={() => console.log("disabled")} />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button text="SM" size="sm" />
            <Button text="MD" size="md" />
            <Button text="LG" size="lg" />
            <Button text="Encontrar boletos" size="xl" />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="space-y-4">
            <Text variant="heading-md">Forms</Text>
            <Input label="Correo electrónico" placeholder="tu@correo.com" hint="Te mandamos el boleto aquí." />
            <Input label="Código de promoción" placeholder="INSERTA CÓDIGO" />
            <Input label="Número de boletos" placeholder="11" error="Máximo 10 por compra." />
            <Input label="Password" placeholder="••••••••" secureTextEntry />
          </Card>

          <GlassCard className="space-y-4">
            <Text variant="heading-md">Glass Surface</Text>
            <Input
              label="Búsqueda"
              placeholder="¿Qué vas a ver esta noche?"
              glass
              hint="Variante pensada para overlays y hero surfaces."
            />
            <div className="flex flex-wrap gap-3">
              <Badge variant="signal">EN VENTA</Badge>
              <Badge variant="ink">INDIE</Badge>
              <Badge variant="sun">PENDIENTE</Badge>
            </div>
          </GlassCard>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="space-y-5">
            <Text variant="heading-md">Card / Event Shell</Text>
            <div className="overflow-hidden rounded-lg border border-ink-800 bg-ink-950 shadow-brick-md">
              <div className="aspect-[4/5] bg-[radial-gradient(circle_at_30%_80%,rgba(255,46,136,0.55),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(198,255,46,0.35),transparent_52%),linear-gradient(180deg,#24112B_0%,#140C1A_100%)] p-4">
                <div className="flex items-start justify-between">
                  <Badge variant="signal">EN VENTA</Badge>
                  <Badge variant="ink">INDIE</Badge>
                </div>
              </div>
              <div className="space-y-2 p-5">
                <Text variant="mono-sm" className="text-ink-300">FORO INDIE ROCK</Text>
                <Text variant="heading-md">Noche de Indie Rock · CDMX</Text>
                <div className="flex items-center justify-between">
                  <Text variant="body-sm" className="text-ink-300">Foro Puebla · Roma Nte</Text>
                  <Text variant="mono-md" className="text-signal-500">$450 MXN</Text>
                </div>
              </div>
            </div>
          </Card>

          <GlassCard className="space-y-5">
            <Text variant="heading-md">People / Status</Text>
            <div className="flex items-center gap-4">
              <Avatar initials="CC" size="lg" />
              <div className="space-y-1">
                <Text variant="heading-sm">Carlos Cortes</Text>
                <Text variant="body-sm" className="text-ink-300">Organizador · Roma Nte</Text>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="leaf">PAGADO</Badge>
              <Badge variant="cenote">INFO</Badge>
              <Badge variant="oxblood">CANCELADO</Badge>
            </div>
          </GlassCard>
        </section>

        <section className="space-y-5 rounded-lg border border-ink-800 bg-ink-900 p-6 shadow-brick-md">
          <Text variant="heading-lg">Typography</Text>
          <div className="space-y-3">
            <Text variant="display-lg">La noche</Text>
            <Text variant="heading-lg">Foro Puebla · Sábado 17 de mayo</Text>
            <Text variant="heading-md">Triplete · Las Nubes · Fuente de Juventud</Text>
            <Text variant="body-lg" className="text-ink-200">
              Compra tu boleto sin cargos ocultos y recibe tu QR al correo en segundos.
            </Text>
            <Text variant="overline" className="text-ink-300">DESCUBRE · NOCHES · SONIDOS · CDMX</Text>
            <Text variant="mono-md" className="text-signal-500">$450.00 MXN · TCK-0412-0091</Text>
            <Text variant="caption" className="text-ink-400">Caption para ayuda y microcopy.</Text>
          </div>
        </section>
      </div>
    </div>
  );
}
