# TICKET: Buyer App Shell & Navigation

**Epic:** Infrastructure
**Ticket ID:** INFRA-006
**Type:** feature
**Status:** TODO

---

## Description

Set up the buyer app shell with navigation structure for both web and native. Establishes route definitions, tab navigation, and navigation guards for authenticated vs guest states.

---

## Acceptance Criteria

- [ ] **AC1:** Route definitions for buyer flows (web: Next.js App Router, native: Expo Router)
- [ ] **AC2:** Tab navigation (Home, Search, My Tickets, Profile)
- [ ] **AC3:** Navigation guards for auth state (logged in vs guest)
- [ ] **AC4:** Deep linking support for shareable event links
- [ ] **AC5:** Web/native route parity — same paths, similar screens

---

## Navigation Structure

### Buyer Web (Next.js)

```
/                           # Home / Discovery feed
/e/[slug]                   # Event detail
/checkout/[eventId]         # Checkout flow
/tickets                    # My tickets list
/tickets/[orderId]          # Ticket detail (QR)
/profile                    # User profile
/login                      # Login screen
/register                   # Register screen
```

### Buyer Native (Expo)

```
/(tabs)/                    # Tab: Home
/(tabs)/search              # Tab: Search
/(tabs)/tickets             # Tab: My Tickets
/(tabs)/profile             # Tab: Profile
/event/[slug]               # Stack: Event detail
/checkout/[eventId]         # Stack: Checkout
/tickets/[orderId]          # Stack: Ticket detail
/auth/login                 # Stack: Login
/auth/register              # Stack: Register
```

---

## Dependencies

- INFRA-005 (UI Components) for navigation chrome
- INFRA-004 (Design Tokens) for navigation styling
- AUTH-001 (Login/Register) for auth state detection

---

## Related

- NAV-001: Navigation Strategy Decision
- [06-design-principles-2026.md](../../06-design-principles-2026.md) §8 (Signature patterns)