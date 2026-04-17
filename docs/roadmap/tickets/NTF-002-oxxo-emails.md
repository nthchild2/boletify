# NTF-002: OXXO Email Sequence

**Epic:** Notifications
**Ticket ID:** NTF-002
**Type:** feature
**Status:** TODO

---

## Description

Three OXXO-specific emails: reference email (sent immediately after OXXO order), confirmed email (sent when OXXO payment clears), and expiry email (sent when 72h window expires without payment).

Phase 2 refs: C2 (OXXO reference), C3 (OXXO confirmed), C4 (OXXO expiry), Phase 3 Appendix B (E-02, E-03, E-04).

---

## Acceptance Criteria

- [ ] **AC2:** **OXXO Reference Email** (E-02): Sent immediately after OXXO PaymentIntent is created. Includes: event name, date/time, venue, ticket tier(s), barcode image, reference number (large, readable font), "Tienes 72 horas para pagar," instructions, link to view pending order.
- [ ] **AC3:** **OXXO Confirmed Email** (E-03): Sent when OXXO webhook fires (payment approved). Same layout as NTF-001 but with "¡Tu pago fue confirmado!" header and QR codes.
- [ ] **AC4:** **OXXO Expiry Email** (E-04): Sent when cron job detects expired OXXO payment. Includes: apology message, event name + date, "Tus boletos fueron liberados para otros asistentes," link to re-purchase if event isn't sold out.

---

## Figma Link

[Placeholder — Phase 3 Appendix B § E-02, E-03, E-04]

---

## Technical Notes

### OXXO Reference Email (E-02)

```typescript
// Key content:
// - "¡Tu orden está pendiente de pago!"
// - Large reference number display: "Referencia: 1234 5678 9012 3456"
// - Barcode image (from Stripe PaymentIntent oxxoBarcodeUrl)
// - "Tienes hasta el [date] a las [time] para pagar"
// - Step-by-step instructions: (1) Go to OXXO, (2) Give the reference number, (3) Pay the total
// - "Si no pagas a tiempo, tus boletos serán liberados"
```

### OXXO Confirmed Email (E-03)

Reuses the `order-confirmation.tsx` template with minor copy change: "¡Tu pago en OXXO fue confirmado" instead of "¡Listo!"

### OXXO Expiry Email (E-04)

```typescript
// Key content:
// - "Tu pago en OXXO expiró"
// - "Lo sentimos, el período de pago de 72 horas terminó"
// - "Tu orden ha sido cancelada"
// - "Si el evento aún tiene boletos disponibles, puedes intentar de nuevo"
// - CTA: "Comprar de nuevo" → event page
```

### Triggering

| Email | Trigger |
|-------|---------|
| OXXO Reference (E-02) | `payment.createIntent` with `method: 'oxxo'` succeeds |
| OXXO Confirmed (E-03) | `payment_intent.succeeded` webhook fires for OXXO |
| OXXO Expiry (E-04) | Cron job `/api/cron/oxxo-expiry` finds expired payments |

### Packages Touched
- [ ] `packages/email` — `oxxo-reference.tsx`, `oxxo-confirmed.tsx`, `oxxo-expired.tsx` templates
- [ ] `apps/web` — webhook handler sends E-03; cron route sends E-04

---

## Dependencies

- PAY-003 (OXXO async payment) — OXXO reference email is triggered from OXXO flow
- PAY-002 (webhooks) — OXXO confirmed email triggered from webhook
- PAY-003 (OXXO cron) — OXXO expiry email triggered from cron

---

## Notes

- The OXXO reference email is arguably more important than the confirmation email — many buyers pay at OXXO stores hours after purchasing. The reference email must be crystal clear about where to pay and what reference number to give.
- Stripe provides the barcode image URL directly in the PaymentIntent response. Use it — don't generate a separate barcode.
- The expiry email is a recovery opportunity: include a "re-purchase" link if tickets are still available.
- OXXO reference emails have a high open rate (buyers are actively waiting). This is a good opportunity to cross-sell: include a "Tell your friends" or social share prompt.
