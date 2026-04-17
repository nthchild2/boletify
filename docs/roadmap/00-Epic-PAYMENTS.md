# Epic: Payments

**Epic ID:** PAY
**Status:** ⬜ Not Started

---

## Overview

Full payment integration covering card payments (Stripe), async OXXO cash payments (Stripe), and Mercado Pago wallet checkout. This epic handles the payment flow end-to-end: creating payment intents, processing webhooks, managing async confirmation, and releasing inventory on failure/expiry.

Phase 2 refs: B5 (card), B6 (OXXO), B7 (Mercado Pago), P1 (fee calculation), P2 (OXXO async), P3 (payouts via Stripe Connect).

---

## Tickets

| Ticket ID | Title | Status |
|-----------|-------|--------|
| PAY-001 | Stripe Card Payment Flow | TODO |
| PAY-002 | Stripe Webhooks | TODO |
| PAY-003 | OXXO Async Payment (72h hold) | TODO |
| PAY-004 | Mercado Pago Checkout | TODO |

---

## Shared Technical Foundation

### Fee Calculation (Phase 2 § 8.4, Phase 4 § 8.4)

```typescript
SERVICE_FEE_PERCENT = 0.05    // 5%
SERVICE_FEE_FLAT = 1000        // MXN 10.00 in cents
LOW_PRICE_THRESHOLD = 10000    // MXN 100.00 — flat fee waived at or below this
OXXO_CONVENIENCE_FEE = 1300   // ~MXN 13.00 in cents (passed to buyer)
```

Fee calculation logic must be implemented once (in `@boletify/shared` or `@boletify/api`) and reused by checkout screens in both apps.

### Inventory Management (Phase 4 § 4.3)

- `TicketTier.sold` incremented atomically on order creation
- Decremented on OXXO expiry / refund
- Use Postgres `SELECT ... FOR UPDATE` for concurrent purchase safety
- OXXO: hold inventory for 72h; cron job releases on expiry

### Payment Status Flow

```
order.create (hold inventory)
  → payment.createIntent / createMpPreference
    → webhook: payment_intent.succeeded / payment.approved
      → confirm order + generate tickets + send email
    → webhook: payment_intent.payment_failed
      → show error, allow retry
  → OXXO only: cron (every 15 min)
      → expired orders → release inventory → send expiry email
```

---

## External Services

| Provider | Purpose |
|----------|---------|
| Stripe | Card + OXXO payments, Connect (payouts), webhooks |
| Mercado Pago | MP wallet + linked card payments |

---

## Dependencies

- `@boletify/api` — `paymentRouter`, `orderRouter` stubs exist but need implementation
- `@boletify/db` — `orders`, `payments`, `ticketTiers` tables
- `@boletify/screens` — checkout screen exists; payment method selection UI needs wiring
- `@boletify/features` — `useCheckout` hook needs payment mutation hooks
- Vercel Cron (webhook `/api/cron/oxxo-expiry`)
- `.env`: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET`

---

## Notes

- OXXO (PAY-003) is the highest-priority payment method — it unlocks the unbanked buyer segment (~40% of target market per Phase 2).
- Mercado Pago (PAY-004) covers MP balance users; it's the second most-used payment method per Phase 2.
- Both payment providers require webhook handlers — PAY-002 (webhooks) is a dependency of PAY-003 and PAY-004.
- Fee display must be transparent at every checkout step (Phase 2 § 6.9 PROFECO moment — this is a competitive differentiator while Ticketmaster's fine is fresh).
