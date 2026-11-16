/**
 * GET /api/dev/email-preview?order=BOL-XXXXXXXX
 * Development only: renders the order confirmation email in the browser.
 */

import { getPaidOrder, renderOrderConfirmation } from '@boletify/api/tickets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not found', { status: 404 });
  }
  const orderNumber = new URL(request.url).searchParams.get('order') ?? '';
  const order = orderNumber ? await getPaidOrder(orderNumber) : null;
  if (!order) {
    return new Response('Paid order not found. Use ?order=BOL-XXXXXXXX', { status: 404 });
  }
  const email = await renderOrderConfirmation(order);
  return new Response(email.html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
