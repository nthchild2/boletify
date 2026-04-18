# TICKET: tRPC / API Layer

**Epic:** Infrastructure
**Ticket ID:** INFRA-003
**Type:** feature
**Status:** 🟡 In Progress

**Dependencies:** INFRA-001 (Database Setup), INFRA-002 (Auth Foundation)

---

## Description

Set up the API layer using tRPC for end-to-end type safety between frontend and backend. This enables type-safe API calls without manual type definitions or REST documentation.

---

## Acceptance Criteria

- [x] **AC1:** `@boletify/api` package created with tRPC router structure
- [x] **AC2:** tRPC server configured with context and procedures
- [x] **AC3:** Auth context injected (userId in context, protectedProcedure)
- [x] **AC4:** Auth router created (register, login, getCurrentUser)
- [ ] **AC5:** Events router created
- [ ] **AC6:** Orders router created
- [ ] **AC7:** Payments router created
- [ ] **AC8:** tRPC client configured in web app
- [ ] **AC9:** tRPC client configured in native app (with Bearer token)
- [ ] **AC10:** Next.js API route handler for tRPC

---

## Current State (2026-04-17)

**Completed:**
- ✅ `@boletify/api` package exists
- ✅ `trpc.ts` — initTRPC with superjson transformer, publicProcedure, protectedProcedure
- ✅ `authRouter` — register, login, getCurrentUser procedures
- ✅ `routers/index.ts` — exports authRouter

**Package Structure:**
```
@boletify/api/
├── src/
│   ├── index.ts              # Main exports
│   ├── trpc.ts               # ✅ tRPC setup (procedures, context)
│   ├── routers/
│   │   ├── index.ts          # ✅ Root router
│   │   └── auth.ts           # ✅ Auth router (register, login, getCurrentUser)
│   ├── validators/
│   │   └── auth.ts           # ✅ Zod schemas
│   └── utils/
│       ├── password.ts       # ✅ bcrypt utilities
│       └── credentials.ts    # ✅ validation helpers
└── package.json
```

**Remaining:**
- ❌ events.ts router
- ❌ orders.ts router
- ❌ payments.ts router
- ❌ tRPC client in apps/web
- ❌ tRPC client in apps/native
- ❌ Next.js API route handler (`/api/trpc/[trpc]/route.ts`)

---

## Router Structure (Target)

```
@boletify/api/
├── routers/
│   ├── index.ts       # Root router (appRouter)
│   ├── auth.ts        # ✅ Done: register, login, getCurrentUser
│   ├── events.ts      # TODO: create, update, publish, delete, list
│   ├── orders.ts      # TODO: create, getById, listByUser, listByEvent
│   └── payments.ts    # TODO: createCheckout, webhook handlers
├── trpc.ts            # ✅ Done
└── client.ts          # TODO: typed tRPC client for frontend
```

---

## Related

- Epic: [00-Epic-INFRA.md](../00-Epic-INFRA.md)
- Tech Doc: [04-technical-architecture.md](../04-technical-architecture.md) § 5.1
- tRPC: https://trpc.io