# TKT-002: QR Code Generation (HMAC-signed)

**Epic:** Tickets
**Ticket ID:** TKT-002
**Type:** feature
**Status:** TODO

---

## Description

Generate unique QR codes for each ticket at purchase confirmation. Each QR contains an HMAC-signed token that the organiser's check-in scanner validates server-side. The QR image is pre-rendered as a PNG and stored (or generated on-demand).

Phase 2 refs: B8 (order confirmation + QR ticket delivery), § 8.2 (QR mechanics), Phase 4 § 4.3 (QR token security).

---

## Acceptance Criteria

- [ ] **AC1:** Each ticket gets a unique `qrToken`: `HMAC-SHA256(ticketId + eventId + orderId, QR_SECRET_KEY)`.
- [ ] **AC2:** QR codes are pre-rendered as PNG images (200×200px, high contrast) and stored in Vercel Blob. URL stored in `Ticket.qrImageUrl`.
- [ ] **AC3:** QR codes are generated server-side immediately after payment confirmation (webhook fires).
- [ ] **AC4:** The QR code is embedded in the order confirmation email (as an image attachment or CID reference).
- [ ] **AC5:** The QR code is displayed on the full-screen ticket detail page in My Tickets.
- [ ] **AC6:** QR tokens are single-use: first scan marks ticket as `checkedIn`; subsequent scans return "already checked in."
- [ ] **AC7:** Cancelled tickets have their QR codes invalidated (token still valid but ticket status checked in scanner).

---

## Figma Link

[Placeholder]

---

## Technical Notes

### Token Generation

```typescript
import crypto from 'crypto';

function generateQrToken(ticketId: string, eventId: string, orderId: string): string {
  const data = `${ticketId}:${eventId}:${orderId}`;
  return crypto
    .createHmac('sha256', process.env.QR_SECRET_KEY!)
    .update(data)
    .digest('hex');
}
```

### QR Image Generation

```typescript
import QRCode from 'qrcode';

async function generateQrImage(token: string): Promise<Buffer> {
  return QRCode.toBuffer(token, {
    type: 'png',
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });
}
```

### Token Validation (Check-in)

```typescript
// In checkinRouter.validate:
// 1. Look up ticket by qrToken from DB
// 2. Check ticket.eventId matches the event being checked into
// 3. Check ticket.status !== 'cancelled'
// 4. If status === 'checkedIn': return duplicate
// 5. Otherwise: set status = 'checkedIn', record checkIn log
```

### Storage

- QR PNG images: Vercel Blob at `qr-tickets/{ticketId}.png`
- Store the public URL in `Ticket.qrImageUrl`
- Fallback: generate on-demand if image is missing (e.g., after DB restore without blobs)

### Packages Touched
- [ ] `@boletify/api` — QR generation logic (called from webhook handlers)
- [ ] `@boletify/db` — `tickets.qrToken`, `tickets.qrImageUrl` columns
- [ ] `packages/email` — embed QR in order confirmation email
- [ ] Vercel Blob: `BLOB_READ_WRITE_TOKEN`
- [ ] Environment: `QR_SECRET_KEY`

---

## Dependencies

- PAY-001 / PAY-003 / PAY-004 (payment webhooks) — QR generation is triggered on payment confirmation

---

## Notes

- The QR token is the source of truth — the PNG image is a rendering of it. If the image is lost, re-generate from the stored token.
- QR tokens are stored in the DB (not just derived on-the-fly) to allow audit logging: we can see exactly what tokens were issued.
- The scanner should also verify `ticket.eventId === scannedEventId` — if someone tries to use a ticket at the wrong event, reject it.
- WakeLock API (Phase 3 § B-09): on the full-screen QR display page, request `navigator.wakeLock.requestSreen('screen')` to prevent the phone from dimming. Graceful degradation on unsupported browsers.
