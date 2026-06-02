# AUTH-001: Login / Register Forms

**Epic:** Authentication
**Ticket ID:** AUTH-001
**Type:** feature
**Status:** ✅ Done

---

## Description

Implement email/password login and registration forms for both web and mobile platforms. Web uses Auth.js with cookie sessions; mobile uses token-based auth.

> **Update (2026-04-17):** `@boletify/auth` and `@boletify/shared` consolidated into `@boletify/api`. Validators now at `packages/api/src/validators/auth.ts`.

---

## Acceptance Criteria

- [x] **AC1:** User can register with email + password (min 8 chars). API endpoint exists in `authRouter.register`.
- [x] **AC2:** User can log in with email + password. API endpoint exists in `authRouter.login`.
- [x] **AC3:** API returns appropriate error messages for: invalid email format, wrong password, non-existent account.
- [x] **AC4:** API validates: email already registered (CONFLICT), password too short.
- [x] **AC5:** Screen implementation — login/register UI in web and native apps with redirect handling
- [x] **AC6:** Protected routes redirect unauthenticated users to login with `callbackUrl` preserved

---

## Current State (2026-04-17)

**Completed (API layer):**
- ✅ `@boletify/api` has `authRouter` with `register`, `login`, `getCurrentUser` procedures
- ✅ Validators at `packages/api/src/validators/auth.ts` (registerSchema, loginSchema)
- ✅ Password utils at `packages/api/src/utils/password.ts` (hashPassword, verifyPassword)
- ✅ Database schema: `users` table exists with `passwordHash`, `role`

**Completed (Screen implementation — 2026-05-27):**
- ✅ Web: Login (`/auth/signin`) and Register (`/auth/signup`) — full client components with form state, validation, error handling, loading states, Spanish-language UI with Brutal-Glass design system
- ✅ Web: Auth.js v5 Credentials provider with JWT strategy, bcryptjs password comparison, raw Neon SQL queries
- ✅ Web: Middleware protects `/org/*`, `/tickets/*`, `/profile/*` via `next-auth/jwt` decode (Edge Runtime compatible)
- ✅ Web: `callbackUrl` preserved on redirect to login
- ✅ Web: Auth routes redirect logged-in organisers → `/org/dashboard`, buyers → `/`

**Remaining (nice-to-have):**
- ❌ Native: Login/Register screens with SecureStore token storage (see AUTH-003)

---

## Technical Notes

### Implementation Details (Updated 2026-05-27)

**Auth config:** `apps/web/lib/auth.ts` — NextAuth v5 with Credentials provider, JWT strategy. Uses raw `neon()` tagged-template queries (not Drizzle) to bypass `@neondatabase/serverless` v1.x incompatibility. Can revert to Drizzle once neon 0.10.4 is confirmed across all workspaces.

**Middleware:** `apps/web/middleware.ts` — Uses `next-auth/jwt` `decode()` instead of importing full auth config. This avoids pulling bcryptjs/neon into Edge Runtime. Reads `authjs.session-token` cookie directly.

**Environment:** Requires `AUTH_SECRET` and `AUTH_URL` in `.env.local`.

### Package References (Updated)

| Old Reference | New Location |
|--------------|--------------|
| `@boletify/shared` validators | `@boletify/api/src/validators/auth.ts` |
| `@boletify/auth` core | `@boletify/api/src/utils/password.ts`, `credentials.ts` |

### API Changes ✅
- tRPC procedure: `packages/api/src/routers/auth.ts` — `register`, `login` mutations implemented
- Input Zod schemas: `packages/api/src/validators/auth.ts` — email & password validation

### Database ✅
- `packages/db/src/schema/index.ts` — `users` table exists with all required fields

---

## Related

- [00-Epic-AUTH.md](../00-Epic-AUTH.md)
- INFRA-006: Buyer App Shell & Navigation
