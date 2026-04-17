# Epic: Notifications

**Epic ID:** NTF
**Status:** TODO

---

## Overview

Transactional email notifications covering the full buyer and organiser lifecycle: order confirmations, OXXO payment flows, event reminders, payout notifications, and cancellation alerts. All emails use Resend + React Email with branding from Phase 3.

Phase 2 refs: C1–C6 (all communications), § 8.2 (QR delivery), Phase 4 § 8.4 (email templates), Phase 3 Appendix B (all template specs).

---

## Tickets

| Ticket ID | Title | Status |
|-----------|-------|--------|
| NTF-001 | Order Confirmation Email | TODO |
| NTF-002 | OXXO Email Sequence (Reference + Confirmed + Expiry) | TODO |
| NTF-003 | Event Reminder Email (24h before) | TODO |
| NTF-004 | Organiser Payout Notification | TODO |

---

## Email Template Inventory

| Template | Trigger | Phase 3 Ref |
|----------|---------|-------------|
| Order confirmation | Card / Mercado Pago payment confirmed | E-01 |
| OXXO reference | OXXO PaymentIntent created | E-02 |
| OXXO confirmed | OXXO webhook fires | E-03 |
| OXXO expired | OXXO 72h cron job | E-04 |
| Event reminder | Cron: 24h before event | E-05 |
| Payout notification | Stripe Connect payout sent | E-06 |

---

## Technical Implementation

### Email Package

All templates live in `@boletify/email`:

```
packages/email/src/
├── order-confirmation.tsx    # E-01
├── oxxo-reference.tsx        # E-02
├── oxxo-confirmed.tsx        # E-03
├── oxxo-expired.tsx          # E-04
├── event-reminder.tsx        # E-05
└── payout-notification.tsx   # E-06
```

Templates use React Email + Tailwind (via `@boletify/config/tailwind`) for branded HTML matching Phase 3 design tokens.

### Sending

- Resend API via `resend` npm package
- From: `Boletify <noreply@boletify.com>`
- Subject lines in Spanish (es-MX)
- QR code images embedded as attachments or CID (Content-ID) references
- Unsubscribe link in all non-transactional emails (marketing opt-in consent)

### Cron Jobs (Vercel Cron)

| Cron | Schedule | Purpose |
|------|----------|---------|
| Event reminder | Every 15 min | Check events starting in 24±15min; send E-05 |
| OXXO expiry | Every 15 min | Check OXXO payments past 72h; release inventory; send E-04 |

Cron routes: `/api/cron/event-reminders`, `/api/cron/oxxo-expiry`

---

## Dependencies

- `@boletify/email` — email templates package (structure exists; templates are TODO)
- Resend: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- Vercel Cron: `vercel.json` or `app/api/cron/*` routes
- `@boletify/api` — webhook handlers trigger email sending on payment confirmation
- `@boletify/db` — `orders`, `tickets` tables for email data

---

## Notes

- All email copy must be reviewed for Spanish tone and brand voice (Phase 2 § 6.3).
- Event reminder should only fire if the buyer hasn't already checked in.
- OXXO expiry email should include a link to re-initiate purchase if the event isn't sold out.
- Payout notification email should show gross sales, fees deducted, and net payout amount (matching ORG-004 dashboard).
- Consider adding email open tracking (Resend supports it) for analytics (Phase 2 § 7.4).
