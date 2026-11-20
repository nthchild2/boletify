import { neon, types } from "@neondatabase/serverless";

/**
 * Raw SQL client for pages and routes that query Neon directly.
 *
 * `timestamp` columns hold UTC instants (that's how Drizzle writes them), but
 * the driver reads them in the server's own time zone by default: UTC on
 * Vercel, Mexico City on a dev Mac. Reading them as UTC makes every
 * environment return the same instant.
 *
 * The driver (0.10) only takes custom parsers per call, not on tagged
 * templates, so this registers the parser on its shared type registry.
 * Drizzle passes its own parsers per query and isn't affected.
 */
const TIMESTAMP_OID = 1114;

function parseUtcTimestamp(value: string): Date | string {
  const d = new Date(`${value.replace(" ", "T")}Z`);
  return Number.isNaN(d.getTime()) ? value : d; // e.g. 'infinity'
}

types.setTypeParser(TIMESTAMP_OID, parseUtcTimestamp);

export function getSql() {
  return neon(process.env.BOLETIFY_DATABASE_URL!);
}
