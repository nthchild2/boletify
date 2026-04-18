# Epic: Infrastructure (Foundation)

**Epic ID:** INFRA
**Status:** 🟡 In Progress

---

## Overview

Foundation layer for the Boletify platform. This epic establishes the core infrastructure components required before any feature development can begin: database, authentication, API layer, and shared design system.

This epic must be completed before feature epics (AUTH, EVENTS, PAYMENTS, etc.) can be developed.

---

## Tickets

| Ticket ID | Title | Status | Dependencies |
|-----------|-------|--------|--------------|
| INFRA-001 | Database Setup (Neon + Drizzle) | ✅ Done | - |
| INFRA-002 | Auth Foundation | 🟡 In Progress | INFRA-001 |
| INFRA-003 | tRPC / API Layer | 🟡 In Progress | INFRA-001, INFRA-002 |
| INFRA-004 | Design Tokens & UI Package | 🟡 In Progress | - |
| INFRA-005 | UI Component Library Expansion | TODO | INFRA-004 |
| INFRA-006 | Buyer App Shell & Navigation | TODO | INFRA-005 |
| INFRA-007 | Organiser App Shell & Navigation | TODO | INFRA-005 |
| INFRA-008 | Explore CSS Alternatives to Tailwind | TODO | INFRA-004 |
| NAV-001 | Navigation Strategy Decision | TODO | - |

---

## Rationale

### Why These Foundation Components?

| Component | Why First | What It Enables |
|-----------|-----------|-----------------|
| **Database** | All data lives here | Events, tickets, orders, users |
| **Auth** | Security foundation | Protected routes, sessions |
| **API** | Client-server communication | Frontend to backend calls |
| **Design System** | UI consistency | Reusable components, tokens |
| **Navigation** | App structure | Route definitions |

---

## Technical Decisions

### Database
- **Provider:** Neon (serverless PostgreSQL)
- **ORM:** Drizzle ORM (smaller bundle than Prisma, SQL-like queries)
- **Rationale:** Tech doc ADR-003, ADR-004

### Auth
- **Provider:** Auth.js v5 (NextAuth)
- **Sessions:** Database-backed (not JWT) for server-side invalidation
- **Rationale:** Tech doc ADR-006

### API
- **Pattern:** tRPC (end-to-end type safety)
- **Alternative:** Next.js API routes if tRPC adds complexity
- **Rationale:** Tech doc ADR-002

### Design System
- **Tokens:** `@boletify/tokens` — design tokens (colors, spacing, typography)
- **UI:** `@boletify/ui` — shared components (Button, Input, etc.)
- **Styling:** Tailwind CSS + NativeWind for cross-platform

---

## Package Structure (Current)

```
packages/
├── ui/              # Shared UI components (@boletify/ui)
├── db/              # Drizzle schema + Neon client
├── api/             # tRPC routers + validators + password utils (CONSOLIDATED)
├── auth/            # DELETED - consolidated into @boletify/api
└── shared/          # DELETED - consolidated into @boletify/api
```

> **Note (2026-04-17):** `@boletify/auth` and `@boletify/shared` were consolidated into `@boletify/api` per Option A decision. This simplifies the package structure — validators, password helpers, and tRPC routers are now in one package.

---

## References

- Tech Doc: [04-technical-architecture.md](../04-technical-architecture.md)
- Design Doc: [06-design-principles-2026.md](../06-design-principles-2026.md)
- Product Doc: [02-product-design.md](../02-product-design.md)