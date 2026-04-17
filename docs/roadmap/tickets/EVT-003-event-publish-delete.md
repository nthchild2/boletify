# EVT-003: Event Publish / Delete

**Epic:** Events
**Ticket ID:** EVT-003
**Type:** feature
**Status:** ⬜ Not Started

---

## Description

Implement event publishing (draft → published) and soft deletion. Publishing makes the event visible to buyers in the discovery feed and on its event page. Soft deletion hides the event from public queries while retaining records for financial compliance (SAT 5-year requirement).

Phase 2 refs: O7 (publish + shareable link), Phase 4 § 4.3 (soft delete).

---

## Acceptance Criteria

- [ ] **AC1:** Organizer can publish a draft event. Publishing sets `status = 'published'` and `publishedAt = now()`.
- [ ] **AC2:** Publishing validates required fields: title, date, venue, at least one ticket tier with quantity > 0.
- [ ] **AC3:** Publishing is blocked if the organiser has not completed payout setup (Stripe Connect not connected).
- [ ] **AC4:** After publish, the organiser sees a shareable URL and share buttons (WhatsApp, copy link).
- [ ] **AC5:** Organizer can cancel a published event. Cancellation sets `status = 'cancelled'` and triggers refund for all confirmed orders (see NTF for cancellation email).
- [ ] **AC6:** Organizer can delete a draft event (not yet published). Sets `deletedAt = now()` (soft delete).
- [ ] **AC7:** Published events cannot be deleted — only cancelled. All financial records must be retained for SAT compliance.
- [ ] **AC8:** Admin can suspend any event: `status = 'cancelled'` + `deletedAt = now()`.

---

## Figma Link

[Placeholder]

---

## Technical Notes

### API Changes
- `packages/api/src/routers/event.ts` — `publish` mutation
- `packages/api/src/routers/event.ts` — `delete` mutation (soft delete)
- `packages/api/src/routers/event.ts` — `cancel` mutation (cancellation + refund trigger)

### Publish Validation

```typescript
// In eventRouter.publish:
const event = await db.query.events.findFirst({ where: eq(events.id, input.eventId) });
if (event.status !== 'draft') throw new TRPCError({ code: 'BAD_REQUEST', message: 'Already published' });
if (!event.title || !event.date || !event.venueName) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Missing required fields' });
// Check at least one ticket tier exists and has quantity > 0
// Check Stripe Connect is set up for organiser
```

### Soft Delete

```typescript
// In eventRouter.delete:
await db.update(events)
  .set({ deletedAt: new Date() })
  .where(and(eq(events.id, input.eventId), eq(events.status, 'draft')));
// Returns error if event is published (must cancel instead)
```

### Event Cancellation + Refunds

```typescript
// In eventRouter.cancel:
// 1. Set event status = 'cancelled'
// 2. Find all confirmed orders for this event
// 3. For each order: initiate Stripe refund AND set order status = 'refunded'
// 4. Send cancellation email to all buyers
```

### Shareable URL Format

```
https://boletify.com/events/[slug]
```

### Packages Touched
- [ ] `@boletify/api` — `eventRouter.publish`, `eventRouter.delete`, `eventRouter.cancel`
- [ ] `@boletify/api` — `paymentRouter` — refund procedure for cancellation
- [ ] `@boletify/screens` — publish confirmation screen with share buttons
- [ ] `@boletify/features` — `usePublishEvent`, `useCancelEvent` hooks

---

## Dependencies

- EVT-001 (Event creation) — publish operates on created events
- ORG-001 (organiser payout setup) — publish blocked if Stripe Connect not connected
- NTF (Notifications) — cancellation email template (add to NTF epic)

---

## Notes

- Event cancellation refunds: Stripe refunds are synchronous; Mercado Pago refunds may be async. Handle MP refunds with a retry mechanism.
- Cancellation email should be sent only after all refunds are successfully processed (or at least initiated).
- The "delete" action for published events should not be exposed to the organiser UI — only admins see it, and it should be rare.
- Admin suspension is separate from organiser cancellation: admins can suspend any event for policy violations without triggering automatic refunds (manual review required).
