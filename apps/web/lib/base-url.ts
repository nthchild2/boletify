/**
 * Returns the base URL for server-side API fetches.
 * VERCEL_URL is set automatically by Vercel — no manual config needed.
 */
export function getBaseUrl(): string {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
