# ORG-001: Organiser Profile Management

**Epic:** Organiser Dashboard
**Ticket ID:** ORG-001
**Type:** feature
**Status:** TODO

---

## Description

Allow organizers to manage their profile (business name, phone, bio, logo) and complete Stripe Connect onboarding for payout setup. The organiser dashboard is gated until payout setup is complete — events cannot be published without a connected Stripe account.

Phase 2 refs: O1 (organiser registration + profile), O2 (payout setup / KYC).

---

## Acceptance Criteria

- [ ] **AC1:** Organizer can view and edit their profile: business name, phone, bio (max 500 chars), logo upload.
- [ ] **AC2:** Organizer can initiate Stripe Connect onboarding from the profile page. Clicking "Configurar datos de pago" redirects to Stripe's hosted Connect onboarding flow.
- [ ] **AC3:** After completing Stripe onboarding, the organiser is redirected back and sees "Cuenta conectada" status.
- [ ] **AC4:** The organiser dashboard shows a prominent prompt to complete payout setup if not yet done. Events cannot be published without a connected account.
- [ ] **AC5:** Organizer's `stripeAccountId` is stored in `organiserProfiles` and `payoutReady` status is synced from Stripe Connect.
- [ ] **AC6:** Profile updates are saved immediately and reflected across the platform.

---

## Figma Link

[Placeholder]

---

## Technical Notes

### Stripe Connect Onboarding

```typescript
// In organiserRouter.setupConnect:
const account = await stripe.accounts.create({
  type: 'express',
  country: 'MX',
  capabilities: {
    card_payments: { requested: true },
    transfers: { requested: true },
  },
});

// Generate onboarding link
const link = await stripe.accountLinks.create({
  account: account.id,
  refresh_url: `${BASE_URL}/org/profile?connect=refresh`,
  return_url: `${BASE_URL}/org/profile?connect=complete`,
  type: 'account_onboarding',
});

return { url: link.url };
```

### Database Changes
- `organiserProfiles.stripeAccountId` — Stripe Connect account ID
- `organiserProfiles.payoutReady` — boolean, synced from Stripe

### Sync Stripe Connect Status

Stripe `account.updated` webhook event updates `payoutReady`. See PAY-002 webhook handler.

### Packages Touched
- [ ] `@boletify/api` — `organiserRouter.getProfile`, `organiserRouter.updateProfile`, `setupConnect`
- [ ] `@boletify/db` — `organiserProfiles` table
- [ ] `@boletify/screens` — profile screen, payout setup screen
- [ ] `apps/web` — Stripe Connect redirect handler (return URL)
- [ ] Stripe: `STRIPE_SECRET_KEY`

---

## Dependencies

- `@boletify/auth` — organiser role must exist (AUTH-001)

---

## Notes

- Stripe Connect Express onboarding is fully hosted by Stripe — minimal dev effort, just create the account and generate the link.
- For free events, Stripe Connect is still required (for identity verification and future paid-event capability), but payouts are "N/A — evento gratuito."
- The `payoutReady` status should be re-checked on every profile page load: if Stripe onboarding is incomplete, show a warning banner.
- RFC (tax ID) for factura generation is optional at MVP — collect it as a field but don't block on it.
