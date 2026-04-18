# Epic: Authentication

**Epic ID:** AUTH
**Status:** ⬜ Not Started

---

## Overview

Foundation authentication layer covering login, registration, and session management for both web and mobile platforms. Web uses cookie-based sessions via Auth.js; mobile uses Bearer token auth via `@boletify/api` + SecureStore. This epic must be completed before any protected features can be wired up.

> **Update (2026-04-17):** `@boletify/auth` and `@boletify/shared` were consolidated into `@boletify/api` per Option A decision. Validators, password helpers, and tRPC routers are now in one package.

---

## Tickets

| Ticket ID | Title | Status |
|-----------|-------|--------|
| AUTH-001 | Login / Register Forms | TODO |
| AUTH-002 | Magic Link Ticket Access | TODO |
| AUTH-003 | Mobile Token Auth (Bearer) | TODO |
| AUTH-004 | Google OAuth | TODO |

---

## Shared Technical Foundation

All auth tickets now consume `@boletify/api` which provides:
- Validators (Zod schemas): `registerSchema`, `loginSchema`, `changePasswordSchema`
- Password utilities: `hashPassword()`, `verifyPassword()` (bcrypt, cost 12)
- tRPC procedures: `publicProcedure`, `protectedProcedure`
- Auth router: `auth.register`, `auth.login`, `auth.getCurrentUser`

### Web Auth Flow

- Auth.js v5 with Drizzle adapter
- Database sessions (not JWT — allows server-side invalidation)
- Cookie: `__Secure-session-token`, `HttpOnly`, `SameSite=Lax`, `Secure`
- Middleware in `apps/web/middleware.ts` using navigation guards

### Mobile Auth Flow

- Bearer token stored in Expo SecureStorage
- Token validated against DB sessions
- Refresh on 401 responses

---

## Dependencies

- `@boletify/api` — auth core (validators, password utils, tRPC router)
- `@boletify/db` — user table, sessions table
- `@boletify/navigation` — guards consumed in app shells

---

## Notes

- Guest checkout (AUTH-001) does NOT require an account — handled in checkout flow, not auth.
- Magic link ticket access (AUTH-002) is for non-logged-in buyers accessing tickets via email link — separate from password reset flows.
- Google OAuth is optional at MVP launch if manual email/password is fully functional; it's a strong nice-to-have for buyer conversion.
