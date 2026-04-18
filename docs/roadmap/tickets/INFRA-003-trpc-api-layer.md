# TICKET: tRPC / API Layer

**Epic:** Infrastructure
**Ticket ID:** INFRA-003
**Type:** feature
**Status:** TODO

**Dependencies:** INFRA-001 (Database Setup), INFRA-002 (Auth Foundation)

---

## Description

Set up the API layer using tRPC for end-to-end type safety between frontend and backend. This enables type-safe API calls without manual type definitions or REST documentation.

---

## Acceptance Criteria

- [ ] **AC1:** `@boletify/api` package created with tRPC router structure
- [ ] **AC2:** tRPC server configured with Next.js API route handler
- [ ] **AC3:** Auth context injected into tRPC procedures
- [ ] **AC4:** Basic routers created: users, events, orders, payments
- [ ] **AC5:** tRPC client configured in web app
- [ ] **AC6:** tRPC client configured in native app (with Bearer token)
- [ ] **AC7:** Error handling with proper error codes

---

## Alternative Consideration

If tRPC adds unnecessary complexity, consider using Next.js API routes instead:
- Simpler to set up
- More familiar pattern
- Less type infrastructure

**Decision:** Implement tRPC for type safety benefits, but keep API routes as fallback if complexity becomes a blocker.

---

## Technical Notes

### Router Structure

```
@boletify/api/
├── routers/
│   ├── index.ts       # Root router composition
│   ├── users.ts       # User operations
│   ├── events.ts      # Event operations
│   ├── orders.ts      # Order operations
│   └── payments.ts    # Payment operations
├── context.ts         # tRPC context (session, db)
├── trpc.ts           # tRPC initialization
└── client.ts          # Client-side tRPC hook
```

### Auth Middleware

```typescript
protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, session: ctx.session } });
});
```

---

## Related

- Epic: [00-Epic-INFRA.md](../00-Epic-INFRA.md)
- Tech Doc: [04-technical-architecture.md](../04-technical-architecture.md) § 5.1
- tRPC: https://trpc.io