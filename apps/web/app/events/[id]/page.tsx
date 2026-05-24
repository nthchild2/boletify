import { notFound } from "next/navigation";
import Link from "next/link";
import { Routes, deriveSaleStatus, formatMxnPrice } from "@boletify/routes";
import {
  BrutalButton,
  Container,
  PageShell,
  SiteNav,
  TicketArtifact,
} from "../../../components/brutal-glass";
import type { EventRecord } from "../../../lib/mock-data";
import { featuredEvents } from "../../../lib/mock-data";

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

async function fetchEvent(id: string): Promise<EventRecord | null> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/events/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (data.error) return null;

    const sale = deriveSaleStatus({
      status: data.status,
      startDate: data.start_date,
      endDate: data.end_date,
      saleStartDate: data.sale_starts_at,
      saleEndDate: data.sale_ends_at,
      totalQuantity: data.total_quantity,
      totalSold: data.total_sold,
      minPriceCents: data.min_price_cents,
    });

    const tags: string[] = Array.isArray(data.genre_tags) ? data.genre_tags : [];

    return {
      id: String(data.id),
      title: data.title,
      eyebrow: tags.map((t: string) => t.toUpperCase()).join(" · ") || "EVENTO",
      venue: data.venue_name,
      location: data.city || "CDMX",
      date: formatDate(data.start_date),
      access: formatTime(data.start_date) || "POR CONFIRMAR",
      price: formatMxnPrice(data.min_price_cents),
      priceValue: data.min_price_cents ? data.min_price_cents / 100 : 0,
      status: sale.label,
      category: (tags[0]?.toUpperCase() || "INDIE") as EventRecord["category"],
      posterTitle: data.title.split(" ").slice(0, 2).join("\n"),
      posterClassName:
        "bg-[radial-gradient(circle_at_50%_50%,rgba(198,255,46,0.18),transparent_60%),linear-gradient(180deg,#161620_0%,#08080C_100%)]",
      posterImage: data.cover_image_url || undefined,
      accent: "signal",
      lineup: "", // Will be derived from ticket tiers or description
      description: data.description || "",
    };
  } catch (err) {
    console.warn("Failed to fetch event from API:", err);
    return null;
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Try API first, fall back to mock data
  let event = await fetchEvent(id);
  if (!event) {
    event = featuredEvents.find((entry) => entry.id === id) ?? null;
  }

  if (!event) {
    notFound();
  }

  return (
    <PageShell mesh="hero">
      <SiteNav />
      <section className="border-t border-border py-20">
        <Container className="grid items-start gap-12 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            <div className="font-body text-overline uppercase text-fg-muted">
              {event.eyebrow} · {event.venue}
            </div>
            <h1 className="mt-4 font-display text-[56px] font-black leading-[0.92] tracking-[-0.03em] text-fg md:text-[96px]">
              {event.title}
            </h1>
            <p className="mt-5 max-w-[720px] text-body-lg leading-8 text-fg-secondary">
              {event.description}
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-surface/80 p-5 shadow-brick-sm">
                <div className="font-body text-overline uppercase text-fg-muted">Fecha</div>
                <div className="mt-2 font-mono text-[20px] text-fg">{event.date}</div>
              </div>
              <div className="rounded-lg border border-border bg-surface/80 p-5 shadow-brick-sm">
                <div className="font-body text-overline uppercase text-fg-muted">Acceso</div>
                <div className="mt-2 font-mono text-[20px] text-fg">{event.access}</div>
              </div>
              <div className="rounded-lg border border-border bg-surface/80 p-5 shadow-brick-sm">
                <div className="font-body text-overline uppercase text-fg-muted">Precio</div>
                <div className="mt-2 font-mono text-[20px] text-primary">{event.price}</div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <BrutalButton href={Routes.CHECKOUT(event.id)} size="xl">
                Comprar boletos
              </BrutalButton>
              <BrutalButton variant="accent" size="xl">
                Guardar evento
              </BrutalButton>
              <BrutalButton variant="glass" size="xl">
                Compartir
              </BrutalButton>
            </div>

            <div className="mt-10 rounded-[22px] border border-glass-edge bg-glass-tint p-6 shadow-glass-md backdrop-blur-glass-sm">
              <div className="font-body text-overline uppercase text-fg-muted">Detalles</div>
              <p className="mt-3 text-body-md leading-7 text-fg">{event.description}</p>
              <div className="mt-6 flex items-center justify-between border-t border-glass-edge pt-4">
                <span className="text-body-sm text-fg-muted">
                  {event.venue} · {event.location}
                </span>
                <Link href={Routes.EVENTS} className="font-mono text-mono-md text-primary">
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
