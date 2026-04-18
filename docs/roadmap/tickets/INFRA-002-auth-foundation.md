# TICKET: Session Management & Auth Integration

**Epic:** Infrastructure
**Ticket ID:** INFRA-002
**Type:** feature
**Status:** 🟡 In Progress

**Dependencies:** INFRA-001 (Database Setup)

---

## Description

Implement session management for web and mobile. This is the core of authentication — tracking "is logged in" state across requests.

> **Refined scope (2026-04-17):** Password utils and validators already in `@boletify/api`. This ticket focuses on **sessions** — the mechanism that persists auth state.

---

## Acceptance Criteria

- [ ] **AC1:** Auth.js v5 configured in web app with Drizzle adapter
- [ ] **AC2:** Session created on login — insert to `sessions` table, set cookie
- [ ] **AC3:** tRPC context reads session → populates `userId` for protected procedures
- [ ] **AC4:** Next.js middleware protects routes based on auth state
- [ ] **AC5:** Logout invalidates session (delete from DB)

---

## Current State (2026-04-17)

**Already done (in `@boletify/api`):**
- ✅ Password utils (bcrypt, cost 12)
- ✅ Zod validators (registerSchema, loginSchema)
- ✅ tRPC auth router (register, login endpoints)
- ✅ `protectedProcedure` (requires userId in context)

**What needs building:**
- ❌ Auth.js v5 config in `apps/web`
- ❌ Session creation on login (update `authRouter.login`)
- ❌ Session validation in tRPC context
- ❌ Middleware for protected routes

---

## Technical Implementation

### 1. Auth.js Setup (Web)

```
apps/web/
├── lib/
│   ├── auth.ts        # Auth.js config + Drizzle adapter
│   └── auth.config.ts # Providers (credentials)
└── app/api/auth/[...nextauth]/route.ts  # Auth.js handler
```

### 2. Session Creation Flow

```
User calls POST /trpc/auth.login
    ↓
authRouter.login:
  1. Validate credentials
  2. Create session in DB (sessions table)
  3. Return session token (or let Auth.js handle it)
    ↓
Auth.js sets cookie: __Secure-session-token
```

### 3. tRPC Context Enhancement

```typescript
// packages/api/src/trpc.ts
export const createContext = async ({ req }) => {
  const session = await getServerSession(req); // reads cookie
  return {
    userId: session?.user?.id,
  };
};
```

### 4. Protected Routes (Web)

```typescript
// apps/web/middleware.ts
export function middleware(request) {
  const session = await getServerSession(request);
  if (!session && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

---

## Session Strategy

| Platform | Mechanism | Storage |
|----------|-----------|---------|
| Web | HTTP-only cookie | `sessions` table (DB-backed) |
| Mobile | Bearer token | `sessions` table + SecureStore |

**Why DB-backed?** Server-side invalidation. If user does something bad, we delete their session row and they're out instantly. JWTs can't do that.

---

## Dependencies

- `@boletify/api` — tRPC router + procedures
- `@boletify/db` — `sessions` table exists
- `apps/web` — Next.js app for Auth.js

---

## Related

- Epic: [00-Epic-INFRA.md](../00-Epic-INFRA.md)
- Epic: [00-Epic-AUTH.md](../00-Epic-AUTH.md)
- Tech Doc: [04-technical-architecture.md](../04-technical-architecture.md) § 7.1 (Auth.js v5)
- ADR-006: Auth.js over Clerk