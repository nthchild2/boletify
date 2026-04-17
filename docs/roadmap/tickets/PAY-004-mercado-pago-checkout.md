# PAY-004: Mercado Pago Checkout

**Epic:** Payments
**Ticket ID:** PAY-004
**Type:** feature
**Status:** TODO

---

## Description

Implement Mercado Pago checkout for buyers who prefer to pay with their Mercado Pago balance or linked card. Unlike Stripe (card/OXXO), Mercado Pago uses a redirect-based flow: create a payment preference server-side, redirect the buyer to Mercado Pago, and handle the result via webhook and redirect URLs.

Phase 2 refs: B7 (Mercado Pago payment), Phase 4 § 8.3 (MP integration).

---

## Acceptance Criteria

- [ ] **AC1:** When buyer selects "Mercado Pago" at checkout, a Mercado Pago preference is created server-side and the buyer is redirected to `init_point` (Mercado Pago checkout page).
- [ ] **AC2:** After payment on Mercado Pago, the buyer is redirected back to Boletify success/failure/pending URLs.
- [ ] **AC3:** On payment approval (webhook `payment.approved`), order is confirmed, tickets generated, confirmation email sent.
- [ ] **AC4:** The Mercado Pago webhook handler verifies the HMAC signature before processing events.
- [ ] **AC5:** If buyer closes Mercado Pago without paying, they are redirected to the pending page and can retry.
- [ ] **AC6:** The service fee display and total calculation follow the same rules as Stripe payments.
- [ ] **AC7:** Mercado Pago payment method is available in both web and mobile checkout flows.

---

## Figma Link

[Placeholder]

---

## Technical Notes

### Mercado Pago Flow

```
1. Buyer selects Mercado Pago → tRPC order.create → hold inventory
2. tRPC payment.createMpPreference:
   - Create MP Preference via API:
     items: [{ title, quantity, unit_price, currency_id: 'MXN' }]
     back_urls: { success, failure, pending }
     notification_url: '/api/webhooks/mercadopago'
     external_reference: orderId
     marketplace_fee: serviceFee
   - Return preference.init_point (redirect URL)
3. Client redirects to Mercado Pago
4. Buyer pays with MP balance or linked card
5. MP fires webhook → /api/webhooks/mercadopago:
   - Verify HMAC signature
   - Check payment status via MP API
   - If approved: confirm order + issue tickets
6. Buyer redirected back to success URL → confirmation page
```

### API Changes
- `packages/api/src/routers/payment.ts` — `createMpPreference` mutation
- `apps/web/app/api/webhooks/mercadopago/route.ts` — MP webhook handler

### HMAC Verification (Mercado Pago Webhook)

```typescript
// apps/web/app/api/webhooks/mercadopago/route.ts
import crypto from 'crypto';

function verifyMpSignature(body: string, signature: string, secret: string): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return expected === signature;
}
```

### Environment Variables
- [ ] `MERCADOPAGO_ACCESS_TOKEN` — MP API access token
- [ ] `MERCADOPAGO_CLIENT_ID` — OAuth client ID
- [ ] `MERCADOPAGO_CLIENT_SECRET` — OAuth client secret
- [ ] `MERCADOPAGO_WEBHOOK_SECRET` — HMAC verification key

### Marketplace vs. Simple Checkout

We use **Mercado Pago Checkout Pro** (redirect model). Mercado Pago handles the payment UI. This is simpler than building embedded MP fields and covers MP wallet + all linked cards in one integration.

### Back URLs (Redirect After Payment)

| Result | URL |
|--------|-----|
| Success | `boletify.com/checkout/success?orderId=<id>` |
| Failure | `boletify.com/checkout/failure?orderId=<id>` |
| Pending | `boletify.com/checkout/pending?orderId=<id>` |

### Packages Touched
- [ ] `@boletify/api` — `paymentRouter.createMpPreference`
- [ ] `apps/web` — MP webhook handler, success/failure/pending redirect pages
- [ ] `apps/mobile` — MP redirect handling (open MP URL in browser, handle return)
- [ ] `@boletify/screens` — MP payment method option in checkout

---

## Dependencies

- PAY-002 (webhooks) — MP confirmation uses webhook infrastructure
- TKT-002 (QR generation) — called from MP approval webhook
- NTF-001 (confirmation email) — triggered by MP approval

---

## Notes

- Mercado Pago does not support Boletify receiving a marketplace fee directly through their standard API. Instead, Boletify's service fee is added to the ticket price shown to the buyer (same as Stripe). The organiser receives the ticket price; Boletify charges its fee separately.
- MP webhooks can be unreliable — use the redirect back URL as a fallback for confirmation, with webhook as the authoritative source.
- Test with Mercado Pago Sandbox (`sandbox.mercadopago.com`) before going live.
- MP has a different refund model than Stripe — refunds must be initiated via the MP API, not webhook. Plan accordingly for ORG-005 (organiser-initiated refunds).
