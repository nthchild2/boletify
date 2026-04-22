"use client";

"use client";

import { useState, useEffect } from "react";
import { trpc } from "../lib/trpc";
import {
  BrutalButton,
  Container,
  EventCard,
  HeroKicker,
  PageShell,
  SiteNav,
  Footer,
} from "../components/brutal-glass";

const FILTER_CATEGORIES = [
  "ELECTRONICA",
  "ROCK",
  "INDIE",
  "CUMBIA",
  "JAZZ",
  "TECHNO",
  "METAL",
  "POP",
  "REGGAETON",
  "FOLK",
] as const;

type EventRecord = {
  id: string;
  title: string;
  eyebrow: string;
  venue: string;
  location: string;
  date: string;
  access: string;
  price: string;
  priceValue: number;
  status: string;
  category: string;
  posterTitle: string;
  posterClassName: string;
  posterImage: string;
  accent: "signal" | "rosa";
  lineup: string;
  description: string;
};

function formatDate(date: Date | string | null): string {
  if (!date) return "POR CONFIRMAR";
  return new Date(date).toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" }).toUpperCase();
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(data => {
        const mapped = data.map((e: any) => ({
          id: String(e.id),
          title: e.title,
          eyebrow: e.venue_name,
          venue: e.venue_name,
          location: e.city || "CDMX",
          date: formatDate(e.start_date),
          access: "",
          price: "POR CONFIRMAR",
          priceValue: 0,
          status: e.status,
          category: (e.genre_tags?.[0] || "INDIE").toUpperCase(),
          posterTitle: e.title,
          posterClassName: e.cover_image_url ? "bg-cover bg-center" : "bg-ink-900",
          posterImage: e.cover_image_url || "",
          accent: "signal" as const,
          lineup: e.description || "",
          description: e.description || "",
        }));
        setEvents(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const featured = events[0];
  const filteredEvents = activeFilter
    ? events.filter((e) => {
        const cat = e.category?.toLowerCase() || "";
        const filter = activeFilter.toLowerCase();
        return cat.includes(filter) || cat === filter;
      })
    : events;

  if (loading) {
    return <PageShell mesh="hero"><SiteNav /><Container><div className="pt-20 text-center text-ink-300">Cargando...</div></Container></PageShell>;
  }

  if (events.length === 0) {
    return (
      <PageShell mesh="hero">
        <SiteNav />
        <Container>
          <section className="pt-16">
            <HeroKicker>Próximamente</HeroKicker>
          </section>
          <section className="mt-6">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h1 className="font-display text-5xl md:text-8xl text-bone-50">La noche<br/>es de<br/>quien la vive</h1>
                <p className="mt-4 text-lg text-ink-200">Los mejores eventos de música en vivo en CDMX.</p>
              </div>
            </div>
          </section>
        </Container>
      </PageShell>
    );
  }

  return (
    <PageShell mesh="hero">
      <SiteNav />

      <Container>
        <section className="pt-16">
          <HeroKicker>Esta semana · CDMX</HeroKicker>
        </section>

        <section className="mt-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center">
              <span className="font-mono text-mono-sm uppercase tracking-widest text-signal-500">
                Evento destacado
              </span>
              <h1 className="mt-4 font-display text-5xl font-black leading-none tracking-tight text-bone-50 md:text-8xl">
                {featured?.title}
              </h1>
              <p className="mt-4 max-w-md text-lg text-ink-200">
                {featured?.description}
              </p>
              <div className="mt-6 flex items-center gap-4">
                <span className="font-mono text-mono-md text-signal-500">
                  {featured?.price}
                </span>
                <span className="text-ink-300">·</span>
                <span className="text-ink-300">{featured?.date}</span>
                <span className="text-ink-300">·</span>
                <span className="text-ink-300">{featured?.venue}</span>
              </div>
              <div className="mt-8">
                <BrutalButton href={`/events/${featured?.id}`} size="lg">
                  Ver detalles
                </BrutalButton>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
              {featured?.posterImage ? (
                <img src={featured.posterImage} alt={featured.title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className={`absolute inset-0 ${featured?.posterClassName}`} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="font-mono text-mono-sm uppercase tracking-widest text-ink-300">
                  {featured?.lineup}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 border-t border-ink-800 pt-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveFilter(null)}
              className={`rounded-full border px-4 py-2 font-body text-label font-semibold uppercase tracking-wider transition duration-fast ${
                activeFilter === null
                  ? "border-ink-950 bg-signal-500 text-ink-950"
                  : "border-ink-700 bg-transparent text-bone-50 hover:border-ink-500"
              }`}
            >
              Todos ({events.length})
            </button>
            {FILTER_CATEGORIES.map((cat) => {
              const catLower = cat.toLowerCase();
              const count = events.filter(e => {
                const eCat = (e.category || "").toLowerCase().replace(/áéíóú/g, "").replace(/"/g, "");
                return eCat.includes(catLower) || eCat === catLower;
              }).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`rounded-full border px-4 py-2 font-body text-label font-semibold uppercase tracking-wider transition duration-fast ${
                    activeFilter === cat
                      ? "border-ink-950 bg-signal-500 text-ink-950"
                      : "border-ink-700 bg-transparent text-bone-50 hover:border-ink-500"
                  }`}
                >
                  {cat.replace(/([A-Z])/g, " $1").trim()} ({count})
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8 pb-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

      </Container>
      <Footer />
    </PageShell>
  );
}