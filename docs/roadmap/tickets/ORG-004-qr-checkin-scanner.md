# ORG-004: QR Door Check-In Scanner

**Epic:** Organiser Dashboard
**Ticket ID:** ORG-004
**Type:** feature
**Status:** TODO

---

## Description

Implement the browser-based QR check-in scanner for door staff: camera-based scanning, validation feedback, manual search fallback, and a real-time check-in counter. The scanner runs in the browser — no app install required.

Phase 2 refs: O10 (QR check-in scanner), Phase 4 § 1.1 (html5-qrcode), Phase 3 § O-11 (manual check-in fallback).

---

## Acceptance Criteria

- [ ] **AC1:** Organiser opens the check-in page for their event. "Iniciar check-in" activates the camera scanner.
- [ ] **AC2:** Pointing the camera at a QR code scans and validates it within 2 seconds. Result shown with full-screen color feedback: green (valid), red (invalid/duplicate/already used).
- [ ] **AC3:** Valid scan: green screen + attendee name + ticket tier name + timestamp. Ticket marked as `checkedIn`.
- [ ] **AC4:** Duplicate scan: red screen + "Ya registró acceso a las [HH:MM]". Same attendee name shown.
- [ ] **AC5:** Invalid token: red screen + "Boleto no válido."
- [ ] **AC6:** Wrong event: red screen + "Este boleto es para otro evento."
- [ ] **AC7:** Real-time counter: "47 / 200 registrados" updated after every scan.
- [ ] **AC8:** Manual search: staff can search by attendee name or email and check in manually.
- [ ] **AC9:** Recent scan log: shows the last 25 scans with result, name, and time.
- [ ] **AC10:** Flashlight toggle button for low-light venues (Camera Torch API).

---

## Figma Link

[Placeholder]

---

## Technical Notes

### html5-qrcode Integration

```typescript
// apps/web/components/checkin/QRScanner.tsx
import { Html5Qrcode } from 'html5-qrcode';

const scanner = new Html5Qrcode('qr-reader');
await scanner.start(
  { facingMode: 'environment' }, // rear camera
  { fps: 10, qrbox: 250 },
  (decodedText) => {
    // decodedText = qrToken
    validateToken(decodedText);
  },
  () => {} // ignore errors during scanning
);
```

### Torch API (Flashlight)

```typescript
const track = scanner.getRunningTrackCameraCapabilities();
if (track.torchFeature().isSupported()) {
  await track.torchFeature().apply(true);
}
```

### Check-In Logic (Server)

`checkinRouter.validate` and `checkinRouter.manual` are already implemented (see `packages/api/src/routers/checkin.ts`). This ticket is about wiring the UI to those procedures.

### Packages Touched
- [ ] `@boletify/api` — `checkinRouter.validate`, `checkinRouter.manual`, `checkinRouter.getStats`, `checkinRouter.getLog` (already implemented)
- [ ] `@boletify/screens` — `CheckinScreen` (shell exists; wire up scanner)
- [ ] `@boletify/features` — `useCheckin` hook
- [ ] `apps/web` — QR scanner component (`html5-qrcode`)
- [ ] `apps/mobile` — same scanner works in mobile browser; native camera integration as enhancement

---

## Dependencies

- TKT-002 (QR generation) — QR tokens must be valid for scanner to work
- `@boletify/api` — `checkinRouter` procedures (already exist)

---

## Notes

- The scanner is a browser-based PWA feature — it works on iOS Safari 15+ and Chrome Android 100+. No app install needed.
- For very low-light venues, the flashlight toggle is essential. Test the Torch API on actual devices — support varies.
- If camera access is denied, show clear instructions to enable camera permissions.
- Manual check-in is critical as a fallback. Staff should never be stuck because of a damaged QR or glare.
- Consider a "sound on scan" setting: play a beep sound on valid scan, different sound on invalid. Useful in loud venues.
- The check-in log (last 25 scans) helps staff resolve disputes: "You were scanned at 9:47 PM."
