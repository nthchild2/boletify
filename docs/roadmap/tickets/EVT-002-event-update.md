# EVT-002: Event Update / Edit

**Epic:** Events
**Ticket ID:** EVT-002
**Type:** feature
**Status:** ⬜ Not Started

---

## Description

Allow organizers to edit their published events: update description, venue details, genre tags, cover image, and ticket tier pricing/availability. Organizer ownership is enforced server-side — organizers can only edit events they created.

Phase 2 refs: S6 (event edit after publish), Phase 4 § 4.3 (organizer ownership).

---

## Acceptance Criteria

- [ ] **AC1:** Organizer can edit all event fields (title, description, date, venue, cover image, genre tags) from the event management page.
- [ ] **AC2:** Organizer can add or remove ticket tiers (if no tickets have been sold yet).
- [ ] **AC3:** Organizer can adjust ticket prices and quantities, but sold quantities cannot be decreased below what's already sold.
- [ ] **AC4:** Server-side ownership check: only the organiser who created the event can edit it (enforced via `organiserProcedure`).
- [ ] **AC5:** Event slug cannot be changed after publishing (URL stability for SEO).
- [ ] **AC6:** If a material change is made (date, time, venue), the system logs the change and optionally notifies buyers via email.
- [ ] **AC7:** Editing a live (ongoing) event is restricted: title and description changes allowed; date/time/venue changes blocked.

---

## Figma Link

[Placeholder]

---

## Technical Notes

### API Changes
- `packages/api/src/routers/event.ts` — `update` mutation needs full implementation
- Ownership check: verify `event.organiserId === ctx.session.user.id`

### Validation Rules

```typescript
// Cannot reduce quantity below sold count
const currentSold = await db.query.ticketTiers.findFirst({ where: eq(ticketTiers.id, tierId) });
if (input.quantity < currentSold.sold) {
  throw new TRPCError({
    code: 'BAD_REQUEST',
    message: 'Cannot reduce quantity below already-sold tickets'
  });
}

// Cannot edit date/time/venue for live events
if (event.status === 'live') {
  // block date, time, venue edits
}

// Slug is immutable after publish
```

### Buyer Notification (Material Changes)

If date/time/venue changes, send a notification email (new template: "event-changed"). This is a nice-to-have at MVP — not blocking.

### Packages Touched
- [ ] `@boletify/api` — `eventRouter.update`
- [ ] `@boletify/screens` — event edit screen
- [ ] `@boletify/features` — `useUpdateEvent` mutation hook

---

## Dependencies

- EVT-001 (Event creation) — uses the same schema and API patterns

---

## Notes

- If the event has sold tickets, adding/removing tiers should be restricted to avoid confusion. Existing tiers can be edited but not deleted.
- Cover image re-upload should replace the existing image. The old blob should ideally be deleted (Vercel Blob has no automatic cleanup — consider this for future optimization).
- Consider adding an "edit history" log for audit purposes — not MVP scope.
