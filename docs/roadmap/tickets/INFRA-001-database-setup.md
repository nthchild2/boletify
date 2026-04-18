# TICKET: Database Setup (Neon + Drizzle)

**Epic:** Infrastructure
**Ticket ID:** INFRA-001
**Type:** feature
**Status:** TODO

---

## Description

Set up the database foundation using Neon (serverless PostgreSQL) and Drizzle ORM. This is the foundation for all data storage in the Boletify platform.

---

## Acceptance Criteria

- [ ] **AC1:** Neon project created with free tier (or appropriate tier for MVP)
- [ ] **AC2:** Drizzle schema created for core entities: users, events, tickets, orders, payments
- [ ] **AC3:** `@boletify/db` package created with schema + Neon client
- [ ] **AC4:** Database connection working in both web and native apps
- [ ] **AC5:** Drizzle migrations configured and running
- [ ] **AC6:** TypeScript types generated from schema

---

## Technical Notes

### Schema Considerations

Based on product requirements, need tables for:

- `users` — buyer and organiser accounts
- `events` — event metadata, status, venue
- `ticket_tiers` — pricing tiers per event
- `orders` — buyer orders with payment status
- `tickets` — individual tickets with QR codes
- `payments` — payment transactions (Stripe, OXXO, Mercado Pago)
- `organiser_profiles` — organiser-specific data
- `sessions` — Auth.js session storage

### Connection Strategy

- Neon provides connection string with branch support
- Use `@neondatabase/serverless` for edge-compatible driver
- Configure connection pooling for serverless environment

### Environment Variables

```env
DATABASE_URL=postgresql://user:pass@host/boletify?sslmode=require
```

---

## Related

- Tech Doc: [04-technical-architecture.md](../04-technical-architecture.md) § 4 (Database)
- Epic: [00-Epic-INFRA.md](../00-Epic-INFRA.md)
- Drizzle: https://drizzle.team