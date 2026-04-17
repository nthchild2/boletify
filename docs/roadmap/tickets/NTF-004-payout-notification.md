# NTF-004: Organiser Payout Notification

**Epic:** Notifications
**Ticket ID:** NTF-004
**Type:** feature
**Status:** TODO

---

## Description

Send an email to the organiser whenever a payout is processed from their Stripe Connect account. The email shows gross sales, fees deducted, and net payout amount.

Phase 2 refs: C6 (organiser payout notification), O11 (payout summary), Phase 4 § 8.5.

---

## Acceptance Criteria

- [ ] **AC1:** Email is sent when Stripe fires the `payout.paid` webhook for the organiser's connected account.
- [ ] **AC2:** Email includes: payout amount (net), payout date, gross sales for the period, Boletify service fee deducted, Stripe processing fee deducted, number of events included in this payout, bank account last 4 digits.
- [ ] **AC3:** The email links to the payout history page in the organiser dashboard.
- [ ] **AC4:** If payout fails, a "Payout failed" email is sent with instructions to update banking details.
- [ ] **AC5:** Free events generate no payout — no email is sent for free events.

---

## Figma Link

[Placeholder — Phase 3 Appendix B § E-06]

---

## Technical Notes

### Stripe Webhook Event

```typescript
// In PAY-002 webhook handler:
if (event.type === 'payout.paid') {
  const payout = event.data.object as Stripe.Payout;
  // Find organiser by stripeAccountId
  const organiser = await db.query.organiserProfiles.findFirst({
    where: eq(organiserProfiles.stripeAccountId, payout.account),
  });
  if (organiser) {
    await sendPayoutNotificationEmail(organiser, payout);
  }
}
```

### Payout Email Content

```typescript
// packages/email/src/payout-notification.tsx
// Key content:
// - "¡Tienes un pago pendiente! / Tu pago ha sido procesado"
// - Net payout amount (large): "MXN 4,230.00"
// - Breakdown table:
//   Gross ticket sales: MXN 5,000
//   Cargo por servicio (5%): -MXN 250
//   Cargo por procesamiento: -MXN 100
//   ─────────────────────────────
//   Pago neto: MXN 4,650
// - "Depositado a la cuenta terminada en XXXX"
// - "Ver detalles" CTA → /org/payouts
```

### Payout Failure Email

Triggered on `payout.failed` event:

```typescript
// - "Tu depósito no pudo ser procesado"
// - Reason (if provided by Stripe)
// - "Actualiza tus datos bancarios" CTA → /org/profile
```

### Packages Touched
- [ ] `packages/email` — `payout-notification.tsx`, `payout-failed.tsx` templates
- [ ] `apps/web` — webhook handler (PAY-002) sends payout notification on `payout.paid`

---

## Dependencies

- ORG-001 (Organiser profile) — payout email goes to organiser's email
- PAY-002 (webhooks) — `payout.paid` and `payout.failed` events handled there
- Stripe Connect — organiser must have connected their Stripe account

---

## Notes

- The payout email should be one of the most polished transactional emails — it's the moment the organiser gets paid. It should feel like a mini "pay stub" and reinforce the value of using Boletify.
- Display payout speed: "Depositado a tu cuenta en 7 días hábiles" — this sets expectations correctly.
- If the organiser has multiple events in a payout period, aggregate them in one email rather than sending one email per event.
- For MXN amounts in emails: use MXN currency formatting (e.g., "MXN 4,230.00") — not "$4,230" which could be confused with USD.
