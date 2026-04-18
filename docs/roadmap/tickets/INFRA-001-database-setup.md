# TICKET: Database Setup (Neon + Drizzle)

**Epic:** Infrastructure
**Ticket ID:** INFRA-001
**Type:** feature
**Status:** ✅ Done

---

## Description

Set up the database foundation using Neon (serverless PostgreSQL) and Drizzle ORM. This is the foundation for all data storage in the Boletify platform.

---

## Acceptance Criteria

- [x] **AC1:** Drizzle schema created for core entities
- [x] **AC2:** `@boletify/db` package created with schema + Neon client
- [x] **AC3:** Database tables defined: users, events, ticket_tiers, orders, tickets, payments, sessions, accounts, organiser_profiles, promo_codes
- [x] **AC4:** TypeScript types generated (`$inferSelect`, `$inferInsert`)
- [ ] **AC5:** Database migrations running
- [ ] **AC6:** Database connection verified in apps

---

## Current State (2026-04-17)

**Completed:**
- ✅ `@boletify/db` package created
- ✅ Schema in `packages/db/src/schema/index.ts` with all tables
- ✅ Client in `packages/db/src/client.ts` (Neon serverless)
- ✅ Types exported (User, Event, TicketTier, Order, Ticket, Payment, etc.)

**Schema Tables:**
```typescript
// packages/db/src/schema/index.ts
users                    // ✅
organiserProfiles        // ✅
events                   // ✅
ticketTiers              // ✅
orders                   // ✅
tickets                  // ✅
payments                 // ✅
promoCodes               // ✅
sessions                 // ✅
accounts                 // ✅
verificationTokens       // ✅
```

**Remaining:**
- ❌ Run migrations against actual Neon database
- ❌ Verify connection in apps/web and apps/native

---

## Related

- Tech Doc: [04-technical-architecture.md](../04-technical-architecture.md) § 4 (Database)
- Epic: [00-Epic-INFRA.md](../00-Epic-INFRA.md)
- Drizzle: https://drizzle.team