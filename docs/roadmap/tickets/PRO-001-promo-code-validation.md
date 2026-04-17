# PRO-001: Promo Code Validation (Checkout)

**Epic:** Promo Codes
**Ticket ID:** PRO-001
**Type:** feature
**Status:** TODO

---

## Description

Validate and apply promo codes at checkout: buyer enters a code, server validates it, and the discount is shown in the order summary before payment is initiated. Validation is fast (debounced) to provide instant feedback as the buyer types.

Phase 2 refs: O6 (promo codes), § 9 (promotions & discounts), Phase 4 § 9 (promo mechanics).

---

## Acceptance Criteria

- [ ] **AC1:** Checkout page shows a "Código de descuento" input field below the ticket summary.
- [ ] **AC2:** On code entry (debounced 300ms), `promo.validate` is called. Valid code: shows discount amount ("-MXN 50") and updated total. Invalid code: shows error message below input.
- [ ] **AC3:** Validation errors: "Código no válido" (doesn't exist), "Código expirado" (past expiresAt), "Código agotado" (maxUses reached).
- [ ] **AC4:** Valid code is stored in checkout state and sent with `order.create`. Server re-validates on order creation (never trust client-side validation alone).
- [ ] **AC5:** The discount is displayed in the order summary: "Descuento (CÓDIGO): -MXN XX" and total is updated.
- [ ] **AC6:** Only one promo code can be applied per order.
- [ ] **AC7:** Promo codes cannot reduce the total below MXN 0.

---

## Figma Link

[Placeholder]

---

## Technical Notes

### API Changes
- `packages/api/src/routers/promo.ts` — `validate` query needs full implementation

### Validation Logic

```typescript
// promoRouter.validate:
const code = await db.query.promoCodes.findFirst({
  where: and(
    eq(promoCodes.code, input.code.toUpperCase()),
    eq(promoCodes.eventId, input.eventId),
  ),
});

if (!code) throw new TRPCError({ code: 'NOT_FOUND', message: 'Código no válido' });
if (code.expiresAt && new Date(code.expiresAt) < new Date()) {
  throw new TRPCError({ code: 'BAD_REQUEST', message: 'Código expirado' });
}
if (code.maxUses && code.usedCount >= code.maxUses) {
  throw new TRPCError({ code: 'BAD_REQUEST', message: 'Código agotado' });
}

// Calculate discount
const discount = code.type === 'flat'
  ? code.amount
  : Math.round(subtotal * (code.amount / 100));
```

### Fee Calculation with Promo

```typescript
// In order.create:
// Subtotal = sum(tier.price * quantity)
// Discount = promo discount
// Service fee = (subtotal - discount) * 0.05 + MXN 10
// Total = subtotal - discount + service fee
```

### Packages Touched
- [ ] `@boletify/api` — `promoRouter.validate`
- [ ] `@boletify/screens` — checkout screen (add promo input + validation UI)
- [ ] `@boletify/features` — `usePromoValidation` hook
- [ ] `@boletify/api` — `orderRouter.create` must re-validate promo code server-side

---

## Dependencies

- `@boletify/db` — `promoCodes` table
- `@boletify/screens` — checkout screen must exist before promo can be added

---

## Notes

- Debounce the validation call — don't hit the API on every keystroke. Wait 300ms after the buyer stops typing.
- The promo input should show a loading state (spinner) while validating.
- On successful validation, show a green checkmark. On error, show the specific error message.
- Server-side re-validation in `order.create` is critical — a malicious buyer could manipulate the client-side state. Always re-validate the promo code on the server before applying the discount.
- Show the promo code name in the order summary: "Descuento (SAVE20): -MXN 140"
