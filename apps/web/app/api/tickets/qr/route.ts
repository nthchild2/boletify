/**
 * GET /api/tickets/qr?code=<signed QR payload>
 * PNG of a ticket's QR code, used by emails and the native app. Only renders
 * codes with a valid Boletify signature; the code itself is the ticket, so
 * this exposes nothing the holder doesn't already have.
 */

import QRCode from 'qrcode';
import { verifyTicketQr } from '@boletify/api/codes';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get('code') ?? '';
  if (!code || code.length > 200 || !verifyTicketQr(code)) {
    return new Response('Not found', { status: 404 });
  }

  const png = await QRCode.toBuffer(code, {
    type: 'png',
    width: 480,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: '#08080C', light: '#FFFFFF' },
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
