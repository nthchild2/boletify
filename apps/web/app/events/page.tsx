import {
  BrutalButton,
  Container,
  EventCard,
  PageShell,
  SectionHeading,
  SiteNav,
} from "../../components/brutal-glass";
import { featuredEvents } from "../../lib/mock-data";

export const metadata = {
  title: "Eventos - Boletify",
  description: "Explora los próximos eventos",
};

export default function EventsPage() {
  return (
    <PageShell mesh="ambient">
      <SiteNav />
      <section className="border-t border-ink-800 py-20">
        <Container>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="font-body text-overline uppercase text-ink-300">Feed · CDMX</div>
              <h1 className="mt-3 font-display text-[40px] font-[850] leading-[0.95] tracking-[-0.03em] text-bone-50 md:text-[72px]">
                Tu próximo
                <br />
                show.
              </h1>
            </div>
            <div className="max-w-[420px] text-body-sm leading-7 text-ink-300">
              Carteles densos, datos claros y una sola acción protagonista. El feed ya
              respira con el mismo brutal glass del preview.
            </div>
          </div>

          <div className="mb-10 flex flex-wrap gap-4">
            <BrutalButton>Este fin</BrutalButton>
            <BrutalButton variant="secondary">Indie</BrutalButton>
            <BrutalButton variant="secondary">Cumbia</BrutalButton>
            <BrutalButton variant="secondary">Electrónica</BrutalButton>
          </div>

          <SectionHeading
            kicker="Eventos destacados"
            title="Cartelera."
            description="Mismo sistema, pero desplegado como un catálogo real para navegación y descubrimiento."
          />

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
