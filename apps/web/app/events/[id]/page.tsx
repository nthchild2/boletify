import { notFound } from "next/navigation";
import Link from "next/link";
import { neon } from "@neondatabase/serverless";
import { Routes, deriveSaleStatus, formatMxnPrice } from "@boletify/routes";
import {
  BrutalButton,
  Container,
  PageShell,
  SiteNav,
  TicketArtifact,
} from "../../../components/brutal-glass";
import type { EventRecord } from "../../../lib/mock-data";

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

function parseTags(raw: any): string[] {
  if (Array.isArray(raw)) return raw;
  try {
    const s = String(raw || "{}");
    if (s === "{}") return [];
    return s.replace(/[{}"]/g, "").split(",").filter(Boolean);
  } catch {
    return [];
  }
}

async function fetchEvent(id: string): Promise<EventRecord | null> {
  try {
    const sql = neon(process.env.BOLETIFY_DATABASE_URL!);
    const isNumeric = /^\d+$/.test(id);

    const rows = isNumeric
      ? await sql`
          SELECT
            e.id, e.title, e.slug, e.description,
            e.venue_name, e.venue_address, e.city,
            e.genre_tags, e.status, e.start_date, e.end_date,
            e.cancelled_at, e.cover_image_url,
            MIN(t.price)                AS min_price_cents,
            COALESCE(SUM(t.quantity), 0) AS total_quantity,
            COALESCE(SUM(t.sold), 0)     AS total_sold,
            MIN(t.sale_start_date)      AS sale_starts_at,
            MAX(t.sale_end_date)        AS sale_ends_at
          FROM events e
          LEFT JOIN ticket_tiers t ON t.event_id = e.id
          WHERE e.id = ${Number(id)}
            AND e.status IN ('published', 'cancelled', 'ended')
          GROUP BY e.id
          LIMIT 1
        `
      : await sql`
          SELECT
            e.id, e.title, e.slug, e.description,
            e.venue_name, e.venue_address, e.city,
            e.genre_tags, e.status, e.start_date, e.end_date,
            e.cancelled_at, e.cover_image_url,
            MIN(t.price)                AS min_price_cents,
            COALESCE(SUM(t.quantity), 0) AS total_quantity,
            COALESCE(SUM(t.sold), 0)     AS total_sold,
            MIN(t.sale_start_date)      AS sale_starts_at,
            MAX(t.sale_end_date)        AS sale_ends_at
          FROM events e
          LEFT JOIN ticket_tiers t ON t.event_id = e.id
          WHERE e.slug = ${id}
            AND e.status IN ('published', 'cancelled', 'ended')
          GROUP BY e.id
          LIMIT 1
        `;

    if (rows.length === 0) return null;

    const data: any = rows[0];
    const tags = parseTags(data.genre_tags);

    const sale = deriveSaleStatus({
      status: data.status,
      startDate: data.start_date,
      endDate: data.end_date,
      saleStartDate: data.sale_starts_at,
      saleEndDate: data.sale_ends_at,
      totalQuantity: Number(data.total_quantity ?? 0),
      totalSold: Number(data.total_sold ?? 0),
      minPriceCents: data.min_price_cents != null ? Number(data.min_price_cents) : null,
    });

    return {
      id: String(data.id),
      title: data.title,
      eyebrow: tags.map((t: string) => t.toUpperCase()).join(" · ") || "EVENTO",
      venue: data.venue_name,
      location: data.city || "CDMX",
      date: formatDate(data.start_date),
      access: formatTime(data.start_date) || "POR CONFIRMAR",
      price: formatMxnPrice(data.min_price_cents != null ? Number(data.min_price_cents) : null),
      priceValue: data.min_price_cents ? Number(data.min_price_cents) / 100 : 0,
      status: sale.label,
      category: (tags[0]?.toUpperCase() || "INDIE") as EventRecord["category"],
      posterTitle: data.title.split(" ").slice(0, 2).join("\n"),
      posterClassName:
        "bg-[radial-gradient(circle_at_50%_50%,rgba(198,255,46,0.18),transparent_60%),linear-gradient(180deg,#161620_0%,#08080C_100%)]",
      posterImage: data.cover_image_url || undefined,
      accent: "signal",
      lineup: "",
      description: data.description || "",
    };
  } catch (err) {
    console.error("[events/[id]] DB error:", err);
    return null;
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await fetchEvent(id);
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
