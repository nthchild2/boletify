# PAY-002: Stripe Webhooks

**Epic:** Payments
**Ticket ID:** PAY-002
**Type:** feature
**Status:** TODO

---

## Description

Implement Stripe webhook handlers to receive and process asynchronous payment events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`, and Stripe Connect events. Webhooks are the authoritative source of truth for payment state — never update payment state based solely on client-side confirmation.

Phase 4 refs: § 5.2 (webhook API), § 8.2 (webhook security), § 8.3 (OXXO webhook).

---

## Acceptance Criteria

- [ ] **AC1:** `/api/webhooks/stripe` endpoint receives POST requests, verifies Stripe signature using `stripe.webhooks.constructEvent()`, and rejects requests with invalid signatures (returns 400).
- [ ] **AC2:** On `payment_intent.succeeded`: find order by `metadata.orderId`, set `Order.status = 'confirmed'`, generate QR tickets, send confirmation email.
- [ ] **AC3:** On `payment_intent.payment_failed`: log the failure, notify buyer (optional), keep order in `pending` state for retry.
- [ ] **AC4:** On `charge.refunded`: set `Order.status = 'refunded'`, cancel tickets (`status = 'cancelled'`), decrement `TicketTier.sold` to release inventory.
- [ ] **AC5:** On `account.updated` (Stripe Connect): sync organiser's `payoutReady` status from Stripe Connect onboarding state.
- [ ] **AC6:** All webhook handlers are idempotent: re-processing the same event produces the same result (check `Payment.stripePaymentIntentId` before processing).
- [ ] **AC7:** Mercado Pago webhook (`/api/webhooks/mercadopago`) also uses HMAC signature verification and is handled in a separate route.

---

## Figma Link

[Placeholder]

---

## Technical Notes

### Webhook Security

```typescript
// apps/web/app/api/webhooks/stripe/route.ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  // Process event...
}
```

### Idempotency Pattern

```typescript
// For each event type:
const existingPayment = await db.query.payments.findFirst({
  where: eq(payments.stripePaymentIntentId, paymentIntentId),
});
if (existingPayment && existingPayment.status === 'completed') {
  return new Response('Already processed', { status: 200 }); // Idempotent
}
// ... process event
```

### Events to Handle

| Event | Action |
|-------|--------|
| `payment_intent.succeeded` | Confirm order, generate tickets, send email |
| `payment_intent.payment_failed` | Log, optionally notify buyer |
| `payment_intent.canceled` | Release inventory, cancel order |
| `charge.refunded` | Cancel tickets, release inventory, send refund email |
| `account.updated` | Sync Stripe Connect onboarding status |
| `payout.paid` | Trigger payout notification email (NTF-004) |

### Database Changes
- `payments.stripePaymentIntentId` — must be stored on PaymentIntent creation
- `payments.status` — track payment status transitions

### Environment Variables
- [ ] `STRIPE_WEBHOOK_SECRET` — Webhook signing secret from Stripe Dashboard

### Packages Touched
- [ ] `apps/web` — `/api/webhooks/stripe/route.ts`, `/api/webhooks/mercadopago/route.ts`
- [ ] `@boletify/api` — `paymentRouter`, `orderRouter` called from webhook handlers
- [ ] `@boletify/db` — payment and order status updates
- [ ] TKT-002 — QR ticket generation called from webhook
- [ ] NTF-001 — confirmation email called from webhook

---

## Dependencies

- PAY-001 (Stripe card flow) — webhook fires after PaymentIntent is created
- TKT-002 (QR generation) — called from `payment_intent.succeeded` handler
- NTF-001 (confirmation email) — called from `payment_intent.succeeded` handler

---

## Notes

- Webhook endpoint MUST verify the Stripe signature before processing ANY event. Never trust the raw body.
- Use `req.text()` not `req.json()` — Stripe signature verification requires the raw body string.
- Test webhooks locally using the Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
- Mercado Pago webhooks use a different signature mechanism (HMAC SHA-256). Implement separately and test with MP sandbox.
- Vercel Cron (for OXXO expiry) is a separate mechanism from webhooks — see PAY-003.
