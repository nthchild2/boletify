# AUTH-001: Login / Register Forms

**Epic:** Authentication
**Ticket ID:** AUTH-001
**Type:** feature
**Status:** 🟡 In Progress

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
- [ ] **AC5:** Screen implementation — login/register UI in web and native apps with redirect handling
- [ ] **AC6:** Protected routes redirect unauthenticated users to login with `callbackUrl` preserved

---

## Current State (2026-04-17)

**Completed (API layer):**
- ✅ `@boletify/api` has `authRouter` with `register`, `login`, `getCurrentUser` procedures
- ✅ Validators at `packages/api/src/validators/auth.ts` (registerSchema, loginSchema)
- ✅ Password utils at `packages/api/src/utils/password.ts` (hashPassword, verifyPassword)
- ✅ Database schema: `users` table exists with `passwordHash`, `role`

**Remaining (Screen implementation):**
- ❌ Web: Login/Register screens with Auth.js integration
- ❌ Native: Login/Register screens with SecureStore token storage
- ❌ Protected route guards in middleware/navigation

---

## Technical Notes

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

### Next Steps
1. Create login/register screens in web app (`apps/web`)
2. Create login/register screens in native app (`apps/native`)
3. Add protected route middleware for web
4. Add navigation guards for native

---

## Related

- [00-Epic-AUTH.md](../00-Epic-AUTH.md)
- INFRA-006: Buyer App Shell & Navigation
