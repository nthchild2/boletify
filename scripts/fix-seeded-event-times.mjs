/**
 * One-off data fix: convert the 12 events seeded by scripts/seed-events.mjs
 * (ids 79–90) from Mexico City clock time to UTC.
 *
 * Why: `timestamp` columns hold UTC (Drizzle writes and reads them as UTC,
 * and the app now always shows event times on a Mexico City clock), but the
 * original seed stored "21:00" for a 21:00 show because Postgres drops the
 * "-06:00" when casting to `timestamp`. Without this fix those events would
 * show six hours early (15:00).
 *
 * Converts each event's start/end date and its tiers' sale start/end dates
 * ("2026-06-02 21:00" -> "2026-06-03 03:00"). One SQL statement, so it's all
 * or nothing. Safe to re-run: an event is only touched while its start date
 * still has the seeded value, and only midnight (date-only) sale dates move.
 *
 * Usage (prints what would change; add --apply to write):
 *   BOLETIFY_DATABASE_URL=postgres://... node scripts/fix-seeded-event-times.mjs [--apply]
 */

import { neon } from "@neondatabase/serverless";

const url = process.env.BOLETIFY_DATABASE_URL;
if (!url) throw new Error("Set BOLETIFY_DATABASE_URL to the database to fix");
const apply = process.argv.includes("--apply");
const sql = neon(url);

// id -> start_date exactly as the seed stored it (Mexico City clock time).
const SEEDED = [
  [79, "2026-06-02 21:00:00"],
  [80, "2026-06-03 21:00:00"],
  [81, "2026-06-04 21:00:00"],
  [82, "2026-06-05 21:00:00"],
  [83, "2026-06-08 21:00:00"],
  [84, "2026-06-17 20:30:00"],
  [85, "2026-06-19 20:30:00"],
  [86, "2026-06-20 21:00:00"],
  [87, "2026-06-20 20:00:00"],
  [88, "2026-06-27 20:00:00"],
  [89, "2026-07-04 21:00:00"],
  [90, "2026-06-09 19:00:00"],
];
const ids = SEEDED.map(([id]) => id);
const starts = SEEDED.map(([, start]) => start);

console.log(`Database host: ${new URL(url).host}`);
console.log(apply ? "Mode: APPLY (writing)\n" : "Mode: dry run (add --apply to write)\n");

const pending = await sql`
  SELECT e.id, e.title, e.start_date::text AS stored,
         ((e.start_date AT TIME ZONE 'America/Mexico_City') AT TIME ZONE 'UTC')::text AS utc,
         (SELECT count(*) FROM ticket_tiers t WHERE t.event_id = e.id) AS tiers
  FROM events e
  JOIN unnest(${ids}::int[], ${starts}::timestamp[]) AS s(id, seeded_start)
    ON e.id = s.id AND e.start_date = s.seeded_start
  ORDER BY e.id
`;

if (pending.length === 0) {
  console.log("Nothing to do: no event still has its seeded start time.");
  process.exit(0);
}

for (const e of pending) {
  console.log(`  ${e.id}  ${e.stored} -> ${e.utc}  (${e.tiers} tiers)  ${e.title}`);
}

if (!apply) {
  console.log(`\n${pending.length} events would be converted. Re-run with --apply to write.`);
  process.exit(0);
}

const [result] = await sql`
  WITH moved AS (
    UPDATE events e
    SET start_date = (e.start_date AT TIME ZONE 'America/Mexico_City') AT TIME ZONE 'UTC',
        end_date   = (e.end_date   AT TIME ZONE 'America/Mexico_City') AT TIME ZONE 'UTC',
        updated_at = now()
    FROM unnest(${ids}::int[], ${starts}::timestamp[]) AS s(id, seeded_start)
    WHERE e.id = s.id AND e.start_date = s.seeded_start
    RETURNING e.id
  ),
  tiers AS (
    UPDATE ticket_tiers t
    SET sale_start_date = CASE WHEN t.sale_start_date::time = '00:00'
          THEN (t.sale_start_date AT TIME ZONE 'America/Mexico_City') AT TIME ZONE 'UTC'
          ELSE t.sale_start_date END,
        sale_end_date = CASE WHEN t.sale_end_date::time = '00:00'
          THEN (t.sale_end_date AT TIME ZONE 'America/Mexico_City') AT TIME ZONE 'UTC'
          ELSE t.sale_end_date END
    WHERE t.event_id IN (SELECT id FROM moved)
    RETURNING t.id
  )
  SELECT (SELECT count(*) FROM moved) AS events, (SELECT count(*) FROM tiers) AS tiers
`;

console.log(`\nConverted ${result.events} events and ${result.tiers} ticket tiers to UTC.`);
