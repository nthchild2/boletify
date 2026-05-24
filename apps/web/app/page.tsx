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
import { FeaturedSlider } from "../components/featured-slider";
import { deriveSaleStatus, formatMxnPrice, type SaleStatusVariant } from "@boletify/routes";

// Number of events to show in the featured-event slider hero.
const FEATURED_COUNT = 5;

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
  /** Derived buyer-facing label (e.g. "EN VENTA", "AGOTADO"). "" when hidden. */
  status: string;
  /** Brand variant the EventCard / Badge should use for `status`. */
  statusVariant: SaleStatusVariant;
  /** When false the card should not render the badge at all. */
  showStatus: boolean;
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

// Extracts the time portion from an ISO timestamp. Returns "" for date-only
// payloads (midnight) or unparseable input — the EventCard then degrades
// gracefully to date-only in the eyebrow.
function formatTime(date: Date | string | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  if (d.getHours() === 0 && d.getMinutes() === 0) return "";
  return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(data => {
        const mapped = data.map((e: any): EventRecord => {
          // Convert raw DB fields → buyer-facing badge state. The previous
          // mapping piped the literal `status` enum onto the card, which
          // is why every card said "PUBLISHED".
          const sale = deriveSaleStatus({
            status: e.status,
            startDate: e.start_date,
            endDate: e.end_date,
            saleStartDate: e.sale_starts_at,
            saleEndDate: e.sale_ends_at,
            totalQuantity: e.total_quantity,
            totalSold: e.total_sold,
            minPriceCents: e.min_price_cents,
          });

          return {
            id: String(e.id),
            title: e.title,
            // Eyebrow is no longer the venue (avoids the dup with the
            // detail row) — the EventCard renders date+access there.
            eyebrow: "",
            venue: e.venue_name,
            location: e.city || "CDMX",
            date: formatDate(e.start_date),
            access: formatTime(e.start_date),
            price: formatMxnPrice(e.min_price_cents),
            priceValue: e.min_price_cents ?? 0,
            status: sale.label,
            statusVariant: sale.variant,
            showStatus: !sale.hidden,
            category: (e.genre_tags?.[0] || "INDIE").toUpperCase(),
            posterTitle: e.title,
            posterClassName: e.cover_image_url ? "bg-cover bg-center" : "bg-surface",
            posterImage: e.cover_image_url || "",
            accent: "signal" as const,
            lineup: e.description || "",
            description: e.description || "",
          };
        });
        setEvents(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const featured = events.slice(0, FEATURED_COUNT);
  const filteredEvents = activeFilter
    ? events.filter((e) => {
        const cat = e.category?.toLowerCase() || "";
        const filter = activeFilter.toLowerCase();
        return cat.includes(filter) || cat === filter;
      })
    : events;

  if (loading) {
    return <PageShell mesh="hero"><SiteNav /><Container><div className="pt-20 text-center text-fg-muted">Cargando...</div></Container></PageShell>;
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
                <h1 className="font-display text-5xl md:text-8xl text-fg">La noche<br/>es de<br/>quien la vive</h1>
                <p className="mt-4 text-lg text-fg-secondary">Los mejores eventos de música en vivo en CDMX.</p>
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
          <FeaturedSlider events={featured} />
        </section>

        <section className="mt-16 border-t border-border pt-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveFilter(null)}
              className={`rounded-full border px-4 py-2 font-body text-label font-semibold uppercase tracking-wider transition duration-fast ${
                activeFilter === null
                  ? "border-border-ink bg-primary text-primary-fg"
                  : "border-border-strong bg-transparent text-fg hover:border-fg-muted"
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
                      ? "border-border-ink bg-primary text-primary-fg"
                      : "border-border-strong bg-transparent text-fg hover:border-fg-muted"
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