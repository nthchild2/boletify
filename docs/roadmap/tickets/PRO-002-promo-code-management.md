# PRO-002: Promo Code Creation & Management

**Epic:** Promo Codes
**Ticket ID:** PRO-002
**Type:** feature
**Status:** TODO

---

## Description

Allow organizers to create, view, and manage promo codes from the event management page. Organizers define the discount type (flat or percentage), amount, optional usage limits, and expiry date.

Phase 2 refs: O6 (promo code creation), § 9 (promotions).

---

## Acceptance Criteria

- [ ] **AC1:** In the event management view, an "Códigos de descuento" section lists all existing promo codes for the event.
- [ ] **AC2:** "Crear código" opens a form: code (auto-generated or custom), type (flat MXN or percentage), amount, max uses (optional), expiry date (optional).
- [ ] **AC3:** Codes are case-insensitive (stored and validated as uppercase). Minimum 3 characters, maximum 20.
- [ ] **AC4:** Organizer can see current usage count per code ("23 / 100 usados").
- [ ] **AC5:** Organizer can deactivate a code (sets `expiresAt = now()`) — existing orders using the code are not affected.
- [ ] **AC6:** Promo codes are scoped to a single event.
- [ ] **AC7:** A suggested "first-buyer" code format: `[ORGANISER_NAME]-20` (e.g., "INDIEROCK-20").

---

## Figma Link

[Placeholder]

---

## Technical Notes

### API Changes
- `packages/api/src/routers/promo.ts` — `create` mutation (exists as stub; needs full implementation)
- `packages/api/src/routers/promo.ts` — `list` query (exists as stub; needs full implementation)

### Auto-Generated Code Suggestions

```typescript
// Generate suggestions when form is opened:
function suggestCode(eventTitle: string): string {
  const slug = eventTitle.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
  return `${slug}-${Math.floor(Math.random() * 90) + 10}`; // e.g., "INDIEROCK-42"
}
```

### Deactivation (Not Deletion)

```typescript
// promoRouter.deactivate:
// Don't delete — keep for audit trail
await db.update(promoCodes)
  .set({ expiresAt: new Date() })
  .where(eq(promoCodes.id, input.promoCodeId));
```

### Packages Touched
- [ ] `@boletify/api` — `promoRouter.create`, `promoRouter.list`, `promoRouter.deactivate`
- [ ] `@boletify/db` — `promoCodes` table
- [ ] `@boletify/screens` — organiser promo management UI in event detail view
- [ ] `@boletify/features` — `usePromoCodes` hook

---

## Dependencies

- EVT-001 (Event creation) — promo codes are created from the event management page
- PRO-001 (Promo validation) — the create UI should show the expected discount impact

---

## Notes

- Never delete promo codes — always deactivate. This preserves audit history and ensures existing orders remain valid.
- Consider showing the organiser a "preview" of how their promo code will look to buyers: "El buyer verá: Código de descuento [XXXX] → -MXN 50"
- Usage tracking: `usedCount` is incremented when `order.create` successfully applies the promo code. Must be done atomically to avoid race conditions (two people applying the last use simultaneously).
- Organizers should be able to create unlimited promo codes per event at MVP. Rate limiting or code limits can be added in v1.1 if abuse becomes an issue.
