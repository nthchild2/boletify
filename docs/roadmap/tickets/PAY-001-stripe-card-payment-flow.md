# PAY-001: Stripe Card Payment Flow

**Epic:** Payments
**Ticket ID:** PAY-001
**Type:** feature
**Status:** TODO

---

## Description

Implement the complete Stripe card payment flow: create PaymentIntent server-side, collect card details client-side via Stripe Elements (PCI SAQ-A compliant), confirm payment, and trigger order confirmation on success.

Phase 2 refs: B5 (card payment), Phase 4 § 8.2 (Stripe integration detail), § 8.4 (fee calculation).

---

## Acceptance Criteria

- [ ] **AC1:** When buyer selects "Card" payment method, Stripe Elements (card number, expiry, CVC) are rendered in the checkout form.
- [ ] **AC2:** On form submission, `stripe.confirmCardPayment(clientSecret)` is called with the PaymentIntent client secret.
- [ ] **AC3:** On payment success, buyer sees a confirmation screen and receives a confirmation email with QR tickets.
- [ ] **AC4:** On payment failure (declined card, insufficient funds), the buyer sees a clear error message and can retry with the same or different card. The order (with inventory hold) is preserved.
- [ ] **AC5:** The service fee is shown clearly at checkout: "Cargo por servicio: MXN XX" (calculated per Phase 4 § 8.4).
- [ ] **AC6:** The inventory hold (increment `TicketTier.sold`) is only released on payment failure or OXXO expiry — not on page navigation.
- [ ] **AC7:** The idempotency key on the PaymentIntent prevents duplicate charges on network retry.

---

## Figma Link

[Placeholder]

---

## Technical Notes

### Payment Flow (Card)

```
1. Buyer selects tickets → tRPC order.create → hold inventory (increment sold)
2. Client calls tRPC payment.createIntent:
   - Server creates Stripe PaymentIntent:
     amount: totalAmount (MXN cents)
     currency: 'mxn'
     payment_method_types: ['card']
     application_fee_amount: serviceFee (MXN cents)  ← Boletify's cut
     transfer_data: { destination: organiser.stripeAccountId }
     idempotency_key: order.idempotencyKey
     metadata: { orderId, eventId }
   - Returns clientSecret to browser
3. Client calls stripe.confirmCardPayment(clientSecret) with card details
4. Stripe fires webhook → /api/webhooks/stripe:
   - Verify signature
   - Find order by metadata.orderId
   - Set Order.status = 'confirmed'
   - Generate QR tickets (see TKT-002)
   - Send confirmation email (see NTF-001)
```

### API Changes
- `packages/api/src/routers/payment.ts` — `createIntent` needs full implementation
- `packages/api/src/routers/order.ts` — `create` needs atomic inventory hold

### Database Changes
- `orders` table: `idempotencyKey` column (unique, nullable)
- `payments` table: insert record on PaymentIntent creation

### Stripe Elements (Web)

```typescript
// apps/web/components/payment/CardPaymentForm.tsx
import { CardElement, useStripe, useElements };
// PCI SAQ-A: card details go directly to Stripe, never touch our server
```

### Stripe Elements (Mobile)

```typescript
// apps/mobile/components/payment/CardPaymentForm.tsx
// Stripe React Native SDK with CardField component
import { CardField } from '@stripe/stripe-react-native';
```

### Environment Variables
- [ ] `STRIPE_SECRET_KEY` — Server-side Stripe API key
- [ ] `STRIPE_PUBLISHABLE_KEY` — Client-side (web + mobile)
- [ ] `STRIPE_WEBHOOK_SECRET` — For webhook signature verification

### Packages Touched
- [ ] `@boletify/api` — `paymentRouter.createIntent`, `orderRouter.create`
- [ ] `@boletify/db` — `orders`, `payments`, `ticketTiers` tables
- [ ] `apps/web` — Stripe Elements form, webhook handler at `/api/webhooks/stripe/route.ts`
- [ ] `apps/mobile` — Stripe React Native card field
- [ ] `@boletify/screens` — checkout screen (wires up payment form)
- [ ] `@boletify/features` — `useCheckout`, `usePayment` hooks

---

## Dependencies

- EVT-001 (event creation) — event must exist before tickets can be purchased
- TKT-002 (QR generation) — called by webhook on payment confirmation
- NTF-001 (confirmation email) — triggered by webhook on payment confirmation
- `@boletify/api` — webhook handler infrastructure

---

## Notes

- PCI SAQ-A compliance: card details NEVER touch Boletify servers. Stripe Elements / CardField sends directly to Stripe. This is architecturally enforced — no code change needed, just verify the implementation.
- `application_fee_amount` and `transfer_data.destination` require the organiser to have a Stripe Connect account set up (ORG-001). If not set up, card payments for that event's organiser should fall back to Boletify receiving the funds directly.
- The idempotency key on the PaymentIntent must match the `order.idempotencyKey` to prevent duplicate charges if the client retries.
- Inventory hold: `TicketTier.sold` is incremented atomically in `order.create`. If payment fails, the order is cancelled and `sold` is decremented.
