# AUTH-002: Magic Link Ticket Access

**Epic:** Authentication
**Ticket ID:** AUTH-002
**Type:** feature
**Status:** ⬜ Not Started

---

## Description

Allow buyers who purchased tickets as guests (without creating an account) to access their tickets via a magic link sent to their email. The magic link contains a one-time token that grants temporary read-only access to the buyer's tickets without requiring a password.

Phase 2 refs: B3 (guest checkout), B9 (My Tickets page), Phase 4 § 7.4 (guest checkout flow).

---

## Acceptance Criteria

- [x] **AC1:** After guest checkout, buyer receives an email with a magic link: `boletify.com/auth/magic-link?token=<one_time_token>`
- [x] **AC2:** Clicking the magic link validates the token server-side. If valid and unused, creates a temporary session scoped to the buyer's own tickets only.
- [x] **AC3:** The temporary session grants read-only access to the buyer's tickets (My Tickets page). No password set, no full account created.
- [x] **AC4:** The magic link token is single-use. After first click, it is invalidated.
- [x] **AC5:** If the buyer later creates an account with the same email, their existing guest orders are linked to the new account.
- [x] **AC6:** Magic link tokens expire after 7 days.
- [x] **AC7:** My Tickets page is accessible via magic link session on both web and mobile.

---

## Figma Link

[Placeholder]

---

## Technical Notes

### Token Format

```
magicLinkToken = randomUUID() — stored in a `magic_link_tokens` table
Token record: { token, email, expiresAt, usedAt (null until used) }
```

### API Changes
- tRPC procedure: `packages/api/src/routers/auth.ts` — `sendMagicLink`, `validateMagicLink`
- `orderRouter.getByEmail` (already stubbed) needs implementation

### Database Changes
- New table: `magic_link_tokens` with fields: `token (UUID, PK)`, `email`, `expiresAt`, `usedAt`, `createdAt`
- Guest `orders` are linked to `users` by email when account is created (on-login migration)

### Email Template
- Subject: "Accede a tus boletos — [Event Name]"
- Body: Greeting + "Haz clic aquí para ver tus boletos" button + magic link
- Sent via Resend (see NTF-001 for Resend setup)

### Packages Touched
- [ ] `@boletify/api` — `authRouter`, `orderRouter.getByEmail`
- [ ] `@boletify/db` — new `magic_link_tokens` table + migration
- [ ] `apps/web` — magic link page at `(auth)/auth/magic-link/page.tsx`
- [ ] `apps/mobile` — magic link deep link handler
- [ ] `@boletify/screens` — My Tickets screen (already exists, needs magic link session support)

---

## Dependencies

- AUTH-001 (Login/Register) must be complete first — magic link uses the same email infrastructure

---

## Notes

- Magic link session should be read-only: cannot access profile, cannot change password, cannot see other buyer data.
- The magic link page should also offer "Crear cuenta" as a secondary action — if the buyer creates an account with the same email, link future orders automatically.
- If magic link token is expired or already used, show a friendly error and offer to resend.
- Deep linking: on mobile, magic link should open the app and navigate directly to My Tickets.
