# Epic: Promo Codes

**Epic ID:** PRO
**Status:** TODO

---

## Overview

Promo code engine for organiser-created discounts: flat MXN or percentage discounts with optional usage limits and expiry dates. Promo codes are validated at checkout and applied before payment intent creation.

Phase 2 refs: O6 (promo code creation), § 9 (promotions & discounts), B2 (checkout — promo code at cart).

---

## Tickets

| Ticket ID | Title | Status |
|-----------|-------|--------|
| PRO-001 | Promo Code Validation (Checkout) | TODO |
| PRO-002 | Promo Code Creation & Management | TODO |

---

## Promo Code Mechanics

### Types

| Type | Description | Example |
|------|-------------|---------|
| `flat` | Fixed MXN discount per ticket | MXN 50 off |
| `percentage` | Percentage off ticket price | 20% off |

### Constraints

| Field | Type | Description |
|-------|------|-------------|
| `maxUses` | number (optional) | Total uses allowed across all buyers |
| `usedCount` | number | How many times used so far |
| `expiresAt` | datetime (optional) | Expiry date; codes are invalid after this |
| `eventId` | UUID | Each code is tied to a specific event |

### Validation Rules

1. Code must exist and be active (not expired)
2. `usedCount < maxUses` (if `maxUses` is set)
3. Current date < `expiresAt` (if set)
4. Code belongs to the event being purchased
5. Discount cannot exceed ticket price (no negative totals)

### Fee Calculation with Promo

When a promo code is applied:

```
Subtotal:        MXN 700   (2× MXN 350)
Promo (20% off): -MXN 140
Cargo por servicio: MXN 45  (5% + MXN 10 per remaining ticket)
─────────────────────────────
Total:           MXN 605
```

Service fee is calculated on the post-discount subtotal. Organiser absorbs the promo discount (not Boletify).

---

## API Endpoints

| Endpoint | Procedure | Notes |
|----------|-----------|-------|
| Validate code | `promo.validate` | Called on checkout page as buyer types |
| Create code | `promo.create` | Organiser creates in event management UI |
| List codes | `promo.list` | Organiser views all codes for an event |

---

## Dependencies

- `@boletify/api` — `promoRouter` stubs exist; `validate`, `create`, `list` need implementation
- `@boletify/db` — `promoCodes` table (Phase 4 § 4.1 ERD)
- `@boletify/screens` — checkout screen needs promo code input + validation UI; organiser event detail needs promo management panel
- `@boletify/features` — `usePromoValidation` hook
- `@boletify/api` — `order.create` must accept `promoCode` and apply discount before payment intent creation

---

## Notes

- Promo codes are case-insensitive (stored and validated as uppercase).
- When a promo is applied, the `order.discountAmt` and `order.promoCodeId` fields must be stored on the order record for audit and reporting.
- Organisers should see a list of all their promo codes per event, including current usage count and status (active / expired / exhausted).
- Consider adding a "first-time buyer" promo code type (auto-generated) as a future enhancement — not in MVP scope.
