# Epic: Tickets

**Epic ID:** TKT
**Status:** TODO

---

## Overview

Ticket lifecycle after payment confirmation: listing purchased tickets (My Tickets), QR code generation with HMAC-signed tokens, and real-time availability checks for event pages and checkout. Tickets are issued after payment is confirmed (or immediately for free events).

Phase 2 refs: B8 (order confirmation + QR ticket delivery), B9 (My Tickets page), B10 (free event RSVP), § 8.2 (QR mechanics).

---

## Tickets

| Ticket ID | Title | Status |
|-----------|-------|--------|
| TKT-001 | My Tickets List | TODO |
| TKT-002 | QR Code Generation (HMAC-signed) | TODO |
| TKT-003 | Ticket Availability Check | TODO |

---

## Ticket Lifecycle

```
Order confirmed (payment webhook fires)
  → Generate tickets (one per OrderItem)
  → Generate QR code (HMAC-signed qrToken + PNG image)
  → Store qrToken + qrImageUrl in Ticket record
  → Send confirmation email with QR (see NTF-001)
  → Ticket status: 'active'

Event day:
  → Organiser scans QR (see ORG-003 / ORG-004)
  → Ticket status: 'checkedIn' (single-use)

Event cancelled / refund issued:
  → Ticket status: 'cancelled'
```

---

## QR Code Mechanics

### Token Format

```
qrToken = HMAC-SHA256(ticketId + eventId + orderId, SECRET_KEY)
```

Tokens are unique per ticket and cannot be guessed or forged. Verified server-side on every scan.

### QR Image

- Pre-rendered PNG (server-side, using `qrcode` npm package)
- Minimum 200×200 px, high contrast
- Stored in `Ticket.qrImageUrl` (Vercel Blob)
- Displayed on My Tickets page and embedded in confirmation email
- Also rendered on-demand for fast display (pre-rendered is preferred for email)

### QR Scan Result States

| Result | Display | Action |
|--------|---------|--------|
| Valid, not checked in | Green screen + attendee name + ticket tier | Mark ticket as `checkedIn` |
| Already checked in | Red screen + "Already checked in at [time]" | No action |
| Invalid token | Red screen + "Invalid ticket" | No action |
| Wrong event | Red screen + "Wrong event" | No action |
| Cancelled ticket | Red screen + "Ticket cancelled" | No action |

---

## Dependencies

- `@boletify/api` — `ticketRouter` has stubs; `getMyTickets`, `getQrData` need implementation
- `@boletify/api` — `checkinRouter` (ORG epic) validates QR tokens; TKT-002 must produce tokens consumable by ORG
- `@boletify/db` — `tickets` table; `qrToken`, `qrImageUrl` columns
- `@boletify/screens` — My Tickets screen exists as shell; QR display component needed
- `@boletify/features` — `useMyTickets`, `useQrData` hooks
- `qrcode` npm package
- Vercel Blob: ticket QR image storage
- `.env`: `QR_SECRET_KEY` (HMAC key)

---

## Notes

- Each ticket in a multi-ticket order gets its own unique QR code.
- QR display on mobile should request `WakeLock API` to prevent screen sleep (Phase 3 § B-09) — graceful degradation on unsupported browsers.
- My Tickets page must show both upcoming and past tickets (past tickets are read-only, no QR display).
- Free events issue tickets immediately on RSVP confirmation (no payment step).
