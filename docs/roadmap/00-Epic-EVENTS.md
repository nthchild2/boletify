# Epic: Events

**Epic ID:** EVT
**Status:** ⬜ Not Started

---

## Overview

Event creation, editing, publishing, and deletion for organizers. Covers the full event lifecycle from draft to published to ended/cancelled. Includes ticket tier configuration (GA, VIP, Early Bird), event metadata (description, cover image, venue, genre tags), and publishing workflow.

Phase 2 refs: O3 (event creation), O4 (ticket tier config), O5 (fee preview), O7 (publish + shareable link), S1 (early-bird pricing).

---

## Tickets

| Ticket ID | Title | Status |
|-----------|-------|--------|
| EVT-001 | Event Creation (with Ticket Tiers) | TODO |
| EVT-002 | Event Update / Edit | TODO |
| EVT-003 | Event Publish / Delete | TODO |
| EVT-004 | Featured Event Slider (Web Home) | TODO |

---

## Event Lifecycle

```
DRAFT → PUBLISHED → ENDED
         ↘ CANCELLED (by organiser or admin)
```

- Events start as `DRAFT` — visible only to the organiser
- Publishing sets `status = 'published'` and populates `publishedAt`
- Only `published` events appear in the discovery feed and are accessible to buyers
- Soft delete sets `deletedAt` timestamp; events are excluded from queries but retained for financial records (SAT 5-year requirement)
- Event cancellation triggers refund flow for all orders (see NTF-003 for cancellation email)

---

## Shared Technical Foundation

### Slug Generation

Auto-generated from title + date + city: e.g., `noche-indie-rock-cdmx-2026-05-15`
Unique index on `Event.slug`. If duplicate, append `-2`, `-3`, etc.

### Ticket Tier Types (MVP)

| Type | Notes |
|------|-------|
| General Admission | Single price, unreserved. Default. |
| Free / RSVP | `price = 0`. No payment flow. Issues QR for check-in. |

Early-bird pricing and named tiers (VIP, Meet-and-greet) are v1.1 features.

### Image Upload

- Client-side crop (`react-cropper` or similar)
- Upload to Vercel Blob
- Max 5 MB, JPG/PNG/WebP
- Cover image URL stored in `Event.coverImageUrl`

---

## Dependencies

- `@boletify/api` — `eventRouter` stubs exist but `create`, `update`, `publish`, `delete` need implementation
- `@boletify/db` — `events`, `ticketTiers` tables exist
- `@boletify/screens` — organiser event creation screen needs wiring; create-event wizard exists as shell
- `@boletify/features` — `useEvent` hook needs mutations
- Vercel Blob: `BLOB_READ_WRITE_TOKEN`

---

## Notes

- Event descriptions use Tiptap rich-text editor (headless, React-native). Store as HTML or JSON. Render server-side for SEO.
- Fee preview toggle ("absorb fee") in the create-event wizard shows the organiser exactly what the buyer will pay — critical for transparency UX.
- Cover image upload + crop is shared infrastructure needed by EVT-001. Implement as a reusable component in `@boletify/screens`.
- Slug uniqueness validation should happen server-side before publish.
