# TICKET: Session Management & Auth Integration

**Epic:** Infrastructure
**Ticket ID:** INFRA-002
**Type:** feature
**Status:** ✅ Done

**Dependencies:** INFRA-001 (Database Setup)

---

## Description

Implement session management for web and mobile. This is the core of authentication — tracking "is logged in" state across requests.

> **Completed (2026-04-17):** Auth.js v5 + JWT sessions + tRPC context + middleware for web.

---

## Acceptance Criteria

- [x] **AC1:** Auth.js v5 configured in web app with credentials provider
- [x] **AC2:** Session created on login — JWT strategy (30 days)
- [x] **AC3:** tRPC context reads session → populates `userId` for protected procedures
- [x] **AC4:** Next.js middleware protects routes based on auth state
- [x] **AC5:** Logout invalidates session (handled by next-auth)

---

## Implementation Summary

### Auth.js Setup (`apps/web/lib/auth.ts`)
- Credentials provider with bcrypt verification
- JWT session strategy
- Callbacks add `role` to token/session
- Custom pages: `/login`

### tRPC Integration
- Context factory pattern: apps provide session resolution
- Web: `apps/web/lib/trpc-context.ts` → Auth.js session → userId
- `protectedProcedure` enforces auth with TRPCError

### Protected Routes (`apps/web/middleware.ts`)
- Redirects unauthenticated → `/login?callbackUrl=`
- Redirects authenticated away from `/login`, `/register`
- Protects: `/org/*`, `/tickets/*`, `/profile/*`

### API Routes
- `/api/auth/[...nextauth]` — Auth.js handlers
- `/api/trpc/[trpc]` — tRPC with session context

---

## Remaining (Deferred)

- Mobile Bearer token auth (AUTH-003)
- Google OAuth (AUTH-004, optional for MVP)

---

## Related

- Epic: [00-Epic-INFRA.md](../00-Epic-INFRA.md)
- Epic: [00-Epic-AUTH.md](../00-Epic-AUTH.md)