# TICKET: tRPC / API Layer

**Epic:** Infrastructure
**Ticket ID:** INFRA-003
**Type:** feature
**Status:** ✅ Done

**Dependencies:** INFRA-001 (Database Setup), INFRA-002 (Auth Foundation)

---

## Description

Set up the API layer using tRPC for end-to-end type safety between frontend and backend.

---

## Acceptance Criteria

- [x] **AC1:** `@boletify/api` package created with tRPC router structure
- [x] **AC2:** tRPC server configured with context and procedures
- [x] **AC3:** Auth context injected (userId in context, protectedProcedure)
- [x] **AC4:** Auth router created (register, login, getCurrentUser)
- [x] **AC5:** Events router created
- [x] **AC6:** Orders router created
- [x] **AC7:** Payments router created
- [x] **AC8:** tRPC client configured in web app
- [ ] **AC9:** tRPC client configured in native app (with Bearer token)

---

## Implementation Summary (2026-04-17)

### Routers Created

| Router | Endpoints |
|--------|-----------|
| `authRouter` | register, login, getCurrentUser |
| `eventsRouter` | create, getById, list, listByOrganiser, update, publish, delete, createTicketTier |
| `ordersRouter` | create, getById, getByOrderNumber, listByEmail, listByOrganiser, updateStatus |
| `paymentsRouter` | getByOrderId, create, stripeWebhook, handleCallback |

### Package Structure

```
@boletify/api/
├── src/
│   ├── index.ts              # Main exports + appRouter
│   ├── trpc.ts               # tRPC setup with context
│   ├── routers/
│   │   ├── index.ts          # Exports all routers
│   │   ├── auth.ts           # ✅ auth, register, login, getCurrentUser
│   │   ├── events.ts         # ✅ CRUD + publish + ticket tiers
│   │   ├── orders.ts         # ✅ create, get, list + ticket generation
│   │   └── payments.ts       # ✅ webhooks, callbacks, status
│   ├── validators/
│   │   └── auth.ts           # Zod schemas
│   └── utils/
│       ├── password.ts       # bcrypt
│       └── credentials.ts    # validation
└── package.json
```

### Web Client (`apps/web/lib/`)

- `trpc.ts` — tRPC React client
- `trpc-provider.tsx` — React Query provider
- `trpc-context.ts` — Session context resolver
- `auth.ts` — Auth.js configuration
- `/api/trpc/[trpc]/route.ts` — tRPC API handler
- `/api/auth/[...nextauth]/route.ts` — Auth.js handler

---

## Remaining

- AC9: Native app tRPC client (AUTH-003 will cover this)

---

## Related

- Epic: [00-Epic-INFRA.md](../00-Epic-INFRA.md)
- Epic: [00-Epic-EVENTS.md](../00-Epic-EVENTS.md)
- Epic: [00-Epic-PAYMENTS.md](../00-Epic-PAYMENTS.md)