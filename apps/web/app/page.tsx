"use client";

import { Routes } from "@boletify/routes";
import {
  BrutalButton,
  BrutalInput,
  Container,
  EventCard,
  HeroKicker,
  MarqueeBand,
  PageShell,
  SectionHeading,
  SiteNav,
  StatStrip,
  TicketArtifact,
} from "../components/brutal-glass";
import { dashboardStats, featuredEvents } from "../lib/mock-data";

export default function Home() {
  return (
    <PageShell mesh="hero">
      <SiteNav />

      <section className="pt-24">
        <Container className="pb-16">
          <HeroKicker>Descubre · noches · sonidos · CDMX</HeroKicker>
          <h1 className="mt-8 font-display text-[64px] font-black leading-[0.88] tracking-[-0.045em] text-bone-50 md:text-[156px]">
            <span>La noche</span>
            <br />
            <span className="text-rosa-500">es de</span>{" "}
            <span className="text-signal-500">quien</span>
            <br />
            <span className="text-transparent [-webkit-text-stroke:2px_#C2C2D0]">la vive.</span>
          </h1>
          <p className="max-w-[640px] text-body-lg text-ink-200 md:text-[20px] md:leading-[1.5]">
            El mejor feed de eventos de música en vivo en la Ciudad de México. Sin cargos
            ocultos, sin letras chiquitas, sin mamadas.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <BrutalButton href={Routes.EVENTS} size="xl">
              Encontrar boletos
            </BrutalButton>
            <BrutalButton href={Routes.AUTH_SIGNIN} variant="secondary">
              Soy organizador →
            </BrutalButton>
          </div>
          <div className="mt-20 border-t border-ink-800 pt-6">
            <StatStrip
              stats={[
                { label: "Eventos esta semana", value: "284" },
                { label: "Recintos activos", value: "147" },
                { label: "Asistentes 2026", value: "1.2M" },
                { label: "Pago organizador", value: "T+3 días" },
              ]}
            />
          </div>
        </Container>
      </section>

      <MarqueeBand items={["Descubre", "Noches", "Sonidos", "CDMX", "2026"]} />

      <section className="border-t border-ink-800 py-24">
        <Container>
          <SectionHeading
            kicker="01 · ESTA SEMANA"
            title={
              <>
                Event card
                <br />
                grid.
              </>
            }
            description={
              <>
                Poster-ratio (4:5) imagery, 1.5px ink-800 border, brick shadow y precio en
                mono. Todo vive en el mismo brutal-glass chassis.
              </>
            }
          />
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-ink-800 bg-[radial-gradient(900px_500px_at_20%_0%,rgba(198,255,46,0.08),transparent_55%),radial-gradient(700px_600px_at_90%_30%,rgba(255,46,136,0.10),transparent_55%),#0F0F15] py-24">
        <Container>
          <SectionHeading
            kicker="02 · THE ARTIFACT"
            title={
              <>
                El boleto
                <br />
                es un objeto.
              </>
            }
            description="Die-cut silhouette, glass body, dotted perforation, glow en el QR y textura de papel. Este es el artefacto estrella del sistema."
          />
        </Container>
        <TicketArtifact event={featuredEvents[0]} />
      </section>

      <section className="border-t border-ink-800 py-24">
        <Container>
          <SectionHeading
            kicker="03 · COMPONENTS"
            title="Forms."
            description="Inputs de 48px, labels en overline, foco signal-lime y una variante glass para contextos sobre fondos atmosféricos."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <BrutalInput
              label="Correo electrónico"
              type="email"
              defaultValue="maria@example.mx"
              hint="Te mandamos el boleto aquí."
            />
            <BrutalInput
              label="Código de promoción"
              placeholder="INSERTA CÓDIGO"
              hint="Opcional. Se aplica al final."
            />
            <BrutalInput
              label="Número de boletos"
              type="number"
              defaultValue="11"
              hint="Máximo 10 por compra."
              error="Máximo 10 por compra."
            />
            <BrutalInput
              label="Búsqueda"
              type="search"
              placeholder="¿Qué vas a ver esta noche?"
              hint="Variante glass sobre hero."
              glass
            />
          </div>
        </Container>
      </section>

      <section className="border-t border-ink-800 py-24">
        <Container>
          <SectionHeading
            kicker="04 · ORGANIZER DASHBOARD"
            title={
              <>
                Tabular
                <br />
                numerics.
              </>
            }
            description="Todas las métricas viven en mono tabular para que ventas, cortes y estados se sientan como instrumentos, no como CMS."
          />
          <StatStrip stats={dashboardStats} />
          <div className="mt-10 flex flex-wrap gap-4">
            <BrutalButton href={Routes.EVENTS}>Obtener boletos</BrutalButton>
            <BrutalButton variant="accent">Guardar evento</BrutalButton>
            <BrutalButton variant="secondary">Soy organizador</BrutalButton>
            <BrutalButton variant="glass">Comparte en WhatsApp</BrutalButton>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
