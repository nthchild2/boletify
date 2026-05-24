import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

/**
 * GET /api/events/:id
 *
 * Returns a single published event by numeric ID or slug, with its
 * ticket tiers and aggregate sale data. The response shape is a superset
 * of the list endpoint — same base fields plus a `ticket_tiers` array.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const sql = neon(process.env.DATABASE_URL!);

  // Accept both numeric IDs ("42") and slugs ("noche-indie-rock-2026-05-17-cdmx").
  const isNumeric = /^\d+$/.test(id);

  const rows = await sql`
    SELECT
      e.id,
      e.title,
      e.slug,
      e.description,
      e.venue_name,
      e.venue_address,
      e.venue_map_url,
      e.city,
      e.genre_tags,
      e.status,
      e.start_date,
      e.end_date,
      e.cancelled_at,
      e.cover_image_url,
      MIN(t.price)                AS min_price_cents,
      COALESCE(SUM(t.quantity), 0) AS total_quantity,
      COALESCE(SUM(t.sold), 0)     AS total_sold,
      MIN(t.sale_start_date)      AS sale_starts_at,
      MAX(t.sale_end_date)        AS sale_ends_at
    FROM events e
    LEFT JOIN ticket_tiers t ON t.event_id = e.id
    WHERE ${isNumeric ? sql`e.id = ${Number(id)}` : sql`e.slug = ${id}`}
      AND e.status IN ('published', 'cancelled', 'ended')
    GROUP BY e.id
    LIMIT 1
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  const e: any = rows[0];

  // Parse genre tags
  let tags: string[] = [];
  try {
    const raw = String(e.genre_tags || '{}');
    if (raw && raw !== '{}') {
      tags = raw.replace(/[{}"]/g, '').split(',').filter(Boolean);
    }
  } catch { /* swallow */ }

  // Coerce numeric aggregates
  const totalQuantity = Number(e.total_quantity ?? 0);
  const totalSold = Number(e.total_sold ?? 0);
  const minPriceCents =
    e.min_price_cents === null || e.min_price_cents === undefined
      ? null
      : Number(e.min_price_cents);

  // Fetch individual ticket tiers for the detail view
  const tiers = await sql`
    SELECT
      id, name, description, price, quantity, sold,
      max_per_order, sale_start_date, sale_end_date
    FROM ticket_tiers
    WHERE event_id = ${e.id}
    ORDER BY price ASC
  `;

  return NextResponse.json({
    ...e,
    genre_tags: tags,
    cover_image_url: e.cover_image_url || null,
    total_quantity: totalQuantity,
    total_sold: totalSold,
    min_price_cents: minPriceCents,
    ticket_tiers: tiers.map((t: any) => ({
      ...t,
      price: Number(t.price),
      quantity: Number(t.quantity),
      sold: Number(t.sold),
      max_per_order: Number(t.max_per_order),
    })),
  });
}
