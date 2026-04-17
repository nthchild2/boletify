# TKT-003: Ticket Availability Check

**Epic:** Tickets
**Ticket ID:** TKT-003
**Type:** feature
**Status:** TODO

---

## Description

Real-time ticket availability check for event pages and checkout. Ensures buyers always see the latest ticket counts and prevents overselling. Availability is checked at page load and periodically during checkout to detect sold-out races.

Phase 2 refs: B2 (ticket selection & cart), § 8.1 (inventory management).

---

## Acceptance Criteria

- [ ] **AC1:** The event detail page shows real-time availability per tier: "25 de 100 disponibles" with a visual progress bar.
- [ ] **AC2:** During checkout, availability is re-checked before payment is initiated. If a tier sells out mid-checkout, the buyer sees "Este tipo de boleto se agotó" and must adjust their cart.
- [ ] **AC3:** Sold-out tiers are visually marked and not selectable. The "Get Tickets" CTA is disabled for sold-out events.
- [ ] **AC4:** Availability data is cached for no more than 5 seconds to balance freshness with database load.
- [ ] **AC5:** Admin/ organiser viewing their own event sees all tiers regardless of sold-out status.
- [ ] **AC6:** The availability check query is efficient: single query per event, no N+1.

---

## Figma Link

[Placeholder]

---

## Technical Notes

### API Changes
- `packages/api/src/routers/ticket.ts` — `getAvailability` query (already stubbed; needs full implementation)
- Add cache headers: `Cache-Control: s-maxage=5, stale-while-revalidate=10`

### Query

```typescript
// ticketRouter.getAvailability — already exists in stubs, needs DB implementation
const rows = await ctx.db
  .select({
    id: ticketTiers.id,
    name: ticketTiers.name,
    price: ticketTiers.price,
    quantity: ticketTiers.quantity,
    sold: ticketTiers.sold,
    maxPerOrder: ticketTiers.maxPerOrder,
  })
  .from(ticketTiers)
  .where(eq(ticketTiers.eventId, input.eventId));
```

### Race Condition Prevention

When buyer initiates payment (`order.create`), the server re-checks availability:

```typescript
// In orderRouter.create:
// 1. Fetch current sold counts for all tiers
// 2. Validate requested quantities against available
// 3. If insufficient: throw BAD_REQUEST
// 4. If sufficient: atomic increment (SELECT ... FOR UPDATE)
```

### Packages Touched
- [ ] `@boletify/api` — `ticketRouter.getAvailability`
- [ ] `@boletify/screens` — event detail screen (availability display)
- [ ] `@boletify/features` — `useEventAvailability` hook

---

## Dependencies

- EVT-001 (Event creation) — ticket tiers must exist for availability to be meaningful
- TKT-002 (QR generation) — triggered on order confirmation

---

## Notes

- The "5 second cache" is for the event page (public). Checkout should always re-validate availability server-side before creating the order — cache is not used for that critical path.
- If a race condition occurs post-payment (two people buy the last ticket simultaneously), the losing buyer's payment succeeds but inventory is oversold. Handle this: on webhook confirmation, if `sold > quantity`, initiate an automatic refund and email the buyer: "Lo sentimos, el último boleto ya no estaba disponible."
- Consider adding a "low stock" indicator: "¡Solo 5 boletos restantes!" when availability drops below 10.
