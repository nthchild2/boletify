# Epic: Organiser Dashboard

**Epic ID:** ORG
**Status:** ⬜ Not Started

---

## Overview

Organiser-facing functionality: profile management, sales dashboard with real-time stats, buyer data export, and door check-in scanner. This is the organiser's primary interface for managing their events and understanding their audience.

Phase 2 refs: O1 (profile), O2 (payout setup / KYC), O8 (sales dashboard), O9 (buyer export), O10 (QR check-in scanner), O11 (payout summary).

---

## Tickets

| Ticket ID | Title | Status |
|-----------|-------|--------|
| ORG-001 | Organiser Profile Management | TODO |
| ORG-002 | Sales Dashboard Data | TODO |
| ORG-003 | Buyer Export (CSV) | TODO |
| ORG-004 | QR Door Check-In Scanner | TODO |

---

## Organiser Capabilities

### Profile (`/org/profile`)

- Edit business name, phone, bio, logo
- Connect payout method (Stripe Connect onboarding)
- View payout history and pending payouts

### Dashboard (`/org/dashboard`)

- List of all events (upcoming, live, past) with status
- Per-event stats: tickets sold / total, revenue (gross + net), sales over time
- Real-time polling every 30s (MVP approach; SSE deferred)

### Event Detail (`/org/events/[eventId]`)

- Sales chart (tickets over time)
- Revenue breakdown by tier
- Payment method distribution (card / OXXO / Mercado Pago)
- Check-in count (updated live)
- Buyer list (name, email, tier, payment method, check-in status)

### Buyer Export

- CSV download: name, email, tier, purchase date, check-in status
- Available per-event or across all events

### Check-In (`/org/events/[eventId]/checkin`)

- Camera-based QR scanner (browser-based via `html5-qrcode`)
- Green ✅ / Red ❌ result with attendee name + tier
- Manual search fallback (name, email, ticket ID)
- Real-time check-in counter: "47 / 200 checked in"
- Recent scan log

---

## Stripe Connect (Payout Setup)

- Account type: Express (Stripe-hosted onboarding)
- Onboarding: click "Configurar datos de pago" → Stripe Connect → return to dashboard
- Payout speed: T+7 business days (Stripe Mexico default)
- Display "Pago estimado en 7 días hábiles" in dashboard

---

## Dependencies

- `@boletify/api` — `organiserRouter` stubs exist; `getProfile`, `updateProfile`, `getSales`, `getBuyers`, `getPayouts` need implementation
- `@boletify/api` — `checkinRouter` exists and is functional
- `@boletify/db` — `organiserProfiles`, `events`, `orders`, `tickets`, `checkIns` tables
- `@boletify/screens` — organiser screens exist as shells (dashboard, events, payouts, profile, checkin)
- `@boletify/features` — hooks for organiser data
- `html5-qrcode` — browser-based QR scanner
- Stripe Connect: `STRIPE_SECRET_KEY`, `stripeAccountId` on organiser profiles

---

## Notes

- Polling every 30s is sufficient for MVP. If organisers demand faster updates, evaluate SSE or shorter cache TTL — but this is premature optimisation.
- Buyer export must respect privacy (LFPDPPP): only export data for events the organiser owns. Server-side enforcement via `organiserProcedure` ownership check.
- QR scanner must work on iOS Safari 15+ and Chrome Android 100+. Low-light venues may need flashlight toggle (camera torch API).
- Manual check-in fallback is required for damaged QR codes, glare, or no-internet scenarios.
