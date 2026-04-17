# EVT-001: Event Creation (with Ticket Tiers)

**Epic:** Events
**Ticket ID:** EVT-001
**Type:** feature
**Status:** ⬜ Not Started

---

## Description

Implement the complete event creation flow for organizers: basic event metadata (title, date, venue, description, cover image, genre tags) plus ticket tier configuration (name, price, quantity). Events are saved as `draft` until explicitly published.

Phase 2 refs: O3 (event creation form), O4 (ticket tier config), O5 (fee preview), Phase 4 § 10.2.

---

## Acceptance Criteria

- [ ] **AC1:** Organizer can create a new event by filling in: title, date, start time, end time (optional), venue name, venue address, description (rich text), cover image upload + crop.
- [ ] **AC2:** Organizer can add 1–5 ticket tiers: each tier has a name (e.g., "General", "VIP"), price (MXN), quantity available, max per order (1–10), and optional sale start/end dates.
- [ ] **AC3:** Organizer can mark an event as free (price = MXN 0) — no payment flow, issues QR on RSVP.
- [ ] **AC4:** Organizer can toggle "absorb fee" to show the service fee as included in the ticket price (buyer sees all-in price = face value).
- [ ] **AC5:** A fee preview section shows the organiser exactly what the buyer will see at checkout.
- [ ] **AC6:** Slug is auto-generated from title + date + city and is unique (append `-2` if duplicate).
- [ ] **AC7:** Event is saved as `status: 'draft'` until the organizer explicitly publishes it.
- [ ] **AC8:** Organizer can save as draft and return to edit before publishing.

---

## Figma Link

[Placeholder]

---

## Technical Notes

### API Changes
- `packages/api/src/routers/event.ts` — `create` mutation needs full implementation
- `packages/api/src/routers/event.ts` — slug generation logic

### Database Changes
- `events` table insert with: title, description, date, startTime, endTime, venueName, venueAddress, coverImageUrl, genreTags, absorbFee, status = 'draft', slug
- `ticketTiers` table inserts (one per tier) linked to the new event
- All within a transaction (Drizzle `db.transaction`)

### Slug Generation

```typescript
function generateSlug(title: string, date: string, venueName: string): string {
  const base = `${title}-${date}-${venueName}`.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  // Check uniqueness and append -2, -3 if needed
}
```

### Image Upload
- Client-side crop (use `react-image-crop` or similar)
- Upload to Vercel Blob
- Max 5 MB, JPG/PNG/WebP
- Return public URL, store in `Event.coverImageUrl`

### Packages Touched
- [ ] `@boletify/api` — `eventRouter.create`
- [ ] `@boletify/db` — `events`, `ticketTiers` tables
- [ ] `@boletify/screens` — event creation screen (wizard)
- [ ] `@boletify/features` — `useCreateEvent` mutation hook
- [ ] `apps/web` — cover image upload component
- [ ] `apps/mobile` — cover image upload component (camera + gallery)
- [ ] Vercel Blob: `BLOB_READ_WRITE_TOKEN`

---

## Dependencies

- `@boletify/auth` — organiser role required; EVT-001 starts after AUTH-001

---

## Notes

- Rich text description: use Tiptap editor (headless). Store as HTML. Render server-side for SEO.
- Cover image crop should default to a 16:9 aspect ratio.
- The fee preview toggle should show the organiser a side-by-side comparison: "Buyer pays MXN X" (absorbFee = true) vs "Buyer pays MXN X + service fee" (absorbFee = false).
- The event creation form should be a multi-step wizard: (1) Basic info → (2) Ticket tiers → (3) Review & publish.
- Genre tags: limit to 3 per event. Suggested tags: Indie, Rock, Electronic, Latin Alternative, Hip-Hop, Jazz, Classical, Pop, Reggaeton, Metal, Punk, World, DJ.
