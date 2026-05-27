import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

/**
 * GET /api/events
 *
 * Returns published events for the buyer feed plus the aggregate
 * ticket-tier data needed by `deriveSaleStatus()` (min price, total
 * quantity, total sold, sale window, etc.). The previous version returned
 * only the raw event row, which leaked the DB-level "published" enum onto
 * user-facing badges.
 */
export async function GET() {
  try {
  const sql = neon(process.env.DATABASE_URL!);

  const events = await sql`
    SELECT
      e.id,
      e.title,
      e.description,
      e.venue_name,
      e.venue_address,
      e.city,
      e.genre_tags,
      e.status,
      e.start_date,
      e.end_date,
      e.cancelled_at,
      e.cover_image_url,
      -- Aggregates across all of this event's ticket tiers. NULL when no
      -- tier rows exist; the helper treats null as "unknown" (renders
      -- "EN VENTA" by default for published events).
      MIN(t.price)            AS min_price_cents,
      COALESCE(SUM(t.quantity), 0) AS total_quantity,
      COALESCE(SUM(t.sold), 0)     AS total_sold,
      MIN(t.sale_start_date) AS sale_starts_at,
      MAX(t.sale_end_date)   AS sale_ends_at
    FROM events e
    LEFT JOIN ticket_tiers t ON t.event_id = e.id
    WHERE e.status IN ('published', 'cancelled', 'ended')
    GROUP BY e.id
    ORDER BY e.start_date DESC
  `;

  const fixed = events.map((e: any) => {
    let tags: string[] = [];
    try {
      // PostgreSQL array as string: {tag1,tag2} or {"tag1","tag2"}
      const raw = String(e.genre_tags || '{}');
      if (raw && raw !== '{}') {
        tags = raw.replace(/[{}"]/g, '').split(',').filter(Boolean);
      }
    } catch (err) {
      console.log("Parse error:", err);
    }

    // Coerce SUM/MIN results — Neon returns numerics as strings.
    const totalQuantity = Number(e.total_quantity ?? 0);
    const totalSold = Number(e.total_sold ?? 0);
    const minPriceCents =
      e.min_price_cents === null || e.min_price_cents === undefined
        ? null
        : Number(e.min_price_cents);

    return {
      ...e,
      genre_tags: tags,
      cover_image_url: e.cover_image_url || null,
      total_quantity: totalQuantity,
      total_sold: totalSold,
      min_price_cents: minPriceCents,
    };
  });

  return NextResponse.json(fixed);
  } catch (err: any) {
    console.error('[GET /api/events] ERROR:', err);
    return NextResponse.json(
      { error: err.message, stack: err.stack?.split('\n').slice(0, 5) },
      { status: 500 },
    );
  }
}
