/**
 * Stripe webhook (PAY-002).
 *
 * Local dev:  stripe listen --forward-to localhost:3001/api/webhooks/stripe
 *             (prints the whsec_… value for STRIPE_WEBHOOK_SECRET)
 * Production: add an endpoint in the Stripe dashboard for
 *             https://<domain>/api/webhooks/stripe with the events below.
 */

import type Stripe from 'stripe';
import { getStripe } from '@boletify/api/stripe';
import {
  handleIntentCanceled,
  markOrderPaid,
  recordPaymentFailed,
} from '@boletify/api/checkout';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get('stripe-signature');
  if (!secret || !signature) {
    return new Response('Webhook not configured', { status: 400 });
  }

  // Signature verification needs the exact raw body.
  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error('[stripe webhook] signature verification failed', err);
    return new Response('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await markOrderPaid(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await recordPaymentFailed(event.data.object);
        break;
      case 'payment_intent.canceled':
        await handleIntentCanceled(event.data.object);
        break;
      default:
        break; // ignore everything else
    }
  } catch (err) {
    // A 500 makes Stripe retry; every handler is safe to run twice.
    console.error(`[stripe webhook] ${event.type} failed`, err);
    return new Response('Handler error', { status: 500 });
  }

  return Response.json({ received: true });
}
