# TKT-001: My Tickets List

**Epic:** Tickets
**Ticket ID:** TKT-001
**Type:** feature
**Status:** TODO

---

## Description

Display the buyer's purchased tickets in a list view: upcoming events (with QR codes) and past events (read-only). Tickets are accessible to logged-in buyers and via magic link for guest purchasers.

Phase 2 refs: B9 (My Tickets page), B3 (guest checkout), Phase 4 § 7.4 (magic link session).

---

## Acceptance Criteria

- [ ] **AC1:** Logged-in buyer sees all their purchased tickets (from all events) on the My Tickets page.
- [ ] **AC2:** Tickets are grouped by status: "Próximos" (upcoming events) and "Pasados" (past events). Sort ascending by event date.
- [ ] **AC3:** Each ticket card shows: event name, date/time, venue, ticket tier name, QR code thumbnail.
- [ ] **AC4:** Tapping/clicking a ticket opens the full-screen QR display page.
- [ ] **AC5:** Guest buyer (via magic link) can access their tickets without logging in — scoped to their email only.
- [ ] **AC6:** Past event tickets show a "Este evento ya pasó" badge and no QR display.
- [ ] **AC7:** Cancelled tickets are shown with a "Cancelado" badge and no QR.
- [ ] **AC8:** Both web and mobile render the shared `MyTicketsScreen` from `@boletify/screens`.

---

## Figma Link

[Placeholder]

---

## Technical Notes

### API Changes
- `packages/api/src/routers/ticket.ts` — `getMyTickets` query needs full implementation
- Filter by `tickets.holderEmail` if accessed via magic link session

### Query Logic

```typescript
// getMyTickets returns tickets with event info
const tickets = await db.query.tickets.findMany({
  where: eq(tickets.userId, ctx.session.user.id), // or holderEmail for magic link
  with: {
    event: true, // join event data
  },
  orderBy: asc(events.date),
});

// Group client-side: upcoming vs past
const today = new Date();
const upcoming = tickets.filter(t => new Date(t.event.date) >= today);
const past = tickets.filter(t => new Date(t.event.date) < today);
```

### Magic Link Session

When accessed via magic link, the session is scoped to `holderEmail` only. The query filters tickets by email, not userId.

### Packages Touched
- [ ] `@boletify/api` — `ticketRouter.getMyTickets`
- [ ] `@boletify/screens` — `MyTicketsScreen` (already exists as shell; wire up to tRPC)
- [ ] `@boletify/features` — `useMyTickets` hook
- [ ] `apps/web` — route at `(buyer)/my-tickets/page.tsx`
- [ ] `apps/mobile` — route at `(buyer)/my-tickets/index.tsx`

---

## Dependencies

- PAY-001 (Stripe payment) — tickets are issued after payment confirmation
- TKT-002 (QR generation) — QR thumbnails displayed on ticket cards
- AUTH-002 (magic link) — guest access to My Tickets

---

## Notes

- If a buyer has multiple tickets for the same event, group them: "2 boletos para [Event Name]" with individual QR buttons.
- The QR thumbnail on ticket cards should be small (80×80px) — full QR is shown on the detail page.
- Empty state: "Aún no tienes boletos. Explora eventos" with a link to the discovery feed.
- Loading state: skeleton cards while fetching tickets.
