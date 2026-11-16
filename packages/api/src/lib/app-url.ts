/**
 * Public base URL of the web app, used in emails and QR image links.
 * APP_URL wins; on Vercel the production domain is set automatically.
 */
export function appUrl(): string {
  const explicit = process.env.APP_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.AUTH_URL) return process.env.AUTH_URL.replace(/\/$/, '');
  return 'http://localhost:3000';
}

/** Public PNG of a ticket's QR code (the route checks the QR signature). */
export function ticketQrImageUrl(qrPayload: string): string {
  return `${appUrl()}/api/tickets/qr?code=${encodeURIComponent(qrPayload)}`;
}
