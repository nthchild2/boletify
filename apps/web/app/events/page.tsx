import { deriveSaleStatus, formatMxnPrice } from "@boletify/routes";
import { getBaseUrl } from "../../lib/base-url";
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

/** Default dark gradient for cards without a cover image. */
const FALLBACK_POSTER =
  "bg-[linear-gradient(180deg,#1A1A2E_0%,#0F0F1A_100%)]";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "POR CONFIRMAR";
  const d = new Date(dateStr);
  return d
    .toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" })
    .toUpperCase();
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  if (d.getHours() === 0 && d.getMinutes() === 0) return "";
  return (
    d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }) +
    " hrs"
  );
}

/**
 * Turns a full title like "Noche de Indie Rock" into a poster-friendly
 * line-broken string: "Noche de\nIndie Rock".
 */
function derivePosterTitle(title: string): string {
  const words = title.split(" ");
  if (words.length <= 2) return title;
  const mid = Math.ceil(words.length / 2);
  return words.slice(0, mid).join(" ") + "\n" + words.slice(mid).join(" ");
}

function mapApiEvent(e: any) {
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

  const tags: string[] = Array.isArray(e.genre_tags) ? e.genre_tags : [];

  return {
    id: String(e.id),
    title: e.title,
    posterTitle: derivePosterTitle(e.title),
    posterClassName: FALLBACK_POSTER,
    posterImage: e.cover_image_url || undefined,
    eyebrow: tags[0]?.toUpperCase() || "",
    venue: e.venue_name,
    location: e.city || "CDMX",
    date: formatDate(e.start_date),
    access: formatTime(e.start_date),
    price: formatMxnPrice(e.min_price_cents),
    status: sale.label,
    statusVariant: sale.variant,
    showStatus: !sale.hidden,
    category: tags[0]?.toUpperCase() || "EVENTO",
    description: e.description || "",
  };
}

async function fetchEvents() {
  const baseUrl = getBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/api/events`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data)) return null;
    return data.map(mapApiEvent);
  } catch {
    return null;
  }
}

export default async function EventsPage() {
  const apiEvents = await fetchEvents();
  // Fall back to mock data if API is unreachable
  const events = apiEvents ?? featuredEvents;

  return (
    <PageShell mesh="ambient">
      <SiteNav />
      <section className="border-t border-border py-20">
        <Container>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="font-body text-overline uppercase text-fg-muted">Feed · CDMX</div>
              <h1 className="mt-3 font-display text-[40px] font-[850] leading-[0.95] tracking-[-0.03em] text-fg md:text-[72px]">
                Tu próximo
                <br />
                show.
              </h1>
            </div>
            <div className="max-w-[420px] text-body-sm leading-7 text-fg-muted">
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
            description={`${events.length} evento${events.length !== 1 ? "s" : ""} en cartelera.`}
          />

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
