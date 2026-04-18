# Epic: Infrastructure (Foundation)

**Epic ID:** INFRA
**Status:** ⬜ Not Started

---

## Overview

Foundation layer for the Boletify platform. This epic establishes the core infrastructure components required before any feature development can begin: database, authentication, API layer, and shared design system.

This epic must be completed before feature epics (AUTH, EVENTS, PAYMENTS, etc.) can be developed.

---

## Tickets

| Ticket ID | Title | Status | Dependencies |
|-----------|-------|--------|--------------|
| INFRA-001 | Database Setup (Neon + Drizzle) | TODO | - |
| INFRA-002 | Auth Foundation Package | TODO | INFRA-001 |
| INFRA-003 | tRPC / API Layer | TODO | INFRA-001, INFRA-002 |
| INFRA-004 | Design Tokens & UI Package | TODO | - |
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

## Package Structure (Target)

```
packages/
├── tokens/          # Design tokens (colors, spacing, typography)
├── ui/              # Shared UI components (@repo/ui → @boletify/ui)
├── db/              # Drizzle schema + Neon client
├── auth/            # Auth.js configuration + utilities
└── api/             # tRPC routers (or API routes)
```

---

## References

- Tech Doc: [04-technical-architecture.md](../04-technical-architecture.md)
- Design Doc: [06-design-principles-2026.md](../06-design-principles-2026.md)
- Product Doc: [02-product-design.md](../02-product-design.md)