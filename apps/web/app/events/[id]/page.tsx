import { Routes } from "@boletify/routes";
import Link from "next/link";
import {
  BrutalButton,
  Container,
  PageShell,
  SiteNav,
  TicketArtifact,
} from "../../../components/brutal-glass";
import { featuredEvents } from "../../../lib/mock-data";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = featuredEvents.find((entry) => entry.id === id) ?? featuredEvents[0];

  return (
    <PageShell mesh="hero">
      <SiteNav />
      <section className="border-t border-ink-800 py-20">
        <Container className="grid items-start gap-12 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            <div className="font-body text-overline uppercase text-ink-300">
              {event.eyebrow} · {event.venue}
            </div>
            <h1 className="mt-4 font-display text-[56px] font-black leading-[0.92] tracking-[-0.03em] text-bone-50 md:text-[96px]">
              {event.title}
            </h1>
            <p className="mt-5 max-w-[720px] text-body-lg leading-8 text-ink-200">
              {event.description}
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-ink-800 bg-ink-900/80 p-5 shadow-brick-sm">
                <div className="font-body text-overline uppercase text-ink-300">Fecha</div>
                <div className="mt-2 font-mono text-[20px] text-bone-50">{event.date}</div>
              </div>
              <div className="rounded-lg border border-ink-800 bg-ink-900/80 p-5 shadow-brick-sm">
                <div className="font-body text-overline uppercase text-ink-300">Acceso</div>
                <div className="mt-2 font-mono text-[20px] text-bone-50">{event.access}</div>
              </div>
              <div className="rounded-lg border border-ink-800 bg-ink-900/80 p-5 shadow-brick-sm">
                <div className="font-body text-overline uppercase text-ink-300">Precio</div>
                <div className="mt-2 font-mono text-[20px] text-signal-500">{event.price}</div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <BrutalButton href={Routes.CHECKOUT("1")} size="xl">
                Comprar boletos
              </BrutalButton>
              <BrutalButton variant="accent">Guardar evento</BrutalButton>
              <BrutalButton variant="glass">Compartir</BrutalButton>
            </div>

            <div className="mt-10 rounded-[22px] border border-white/10 bg-white/5 p-6 shadow-glass-md backdrop-blur-glass-sm">
              <div className="font-body text-overline uppercase text-ink-300">Lineup</div>
              <p className="mt-3 text-body-md leading-7 text-bone-50">{event.lineup}</p>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-body-sm text-ink-300">
                  {event.venue} · {event.location}
                </span>
                <Link href={Routes.EVENTS} className="font-mono text-mono-md text-signal-500">
                  Ver más fechas
                </Link>
              </div>
            </div>
          </div>

          <TicketArtifact event={event} />
        </Container>
      </section>
    </PageShell>
  );
}
