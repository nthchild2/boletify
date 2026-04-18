# TICKET: Organiser App Shell & Navigation

**Epic:** Infrastructure
**Ticket ID:** INFRA-007
**Type:** feature
**Status:** TODO

---

## Description

Set up the organiser dashboard shell with navigation structure for web (organisers don't get a native app at MVP). Establishes sidebar navigation, protected routes, and organiser-specific screens.

---

## Acceptance Criteria

- [ ] **AC1:** Route definitions for organiser flows
- [ ] **AC2:** Sidebar navigation (Dashboard, Events, Orders, Analytics, Settings)
- [ ] **AC3:** Protected routes — only organiser/role users can access
- [ ] **AC4:** Dark mode (organiser uses bone.50 light theme per design doc)

---

## Navigation Structure

### Organiser Web (Next.js)

```
/org                        # Dashboard (redirect to /org/dashboard)
/org/dashboard              # Sales overview, key metrics
/org/events                 # Event list (draft, published, past)
/org/events/new             # Create event wizard
/org/events/[id]            # Event detail/edit
/org/orders                 # Orders list
/org/orders/[id]            # Order detail
/org/analytics              # Sales analytics, exports
/org/settings               # Organiser profile, payout settings
/org/settings/team          # Team members (v1.1)
```

---

## Design Notes

Per design doc §9 (Light mode):
- Page = `bone.50` (cream)
- Panel = white with 1px `ink.100` border
- Brick shadow = `ink.1000` (black)
- Primary CTA = `ink.950` fill + `signal.500` text + brick shadow

---

## Dependencies

- INFRA-005 (UI Components) for navigation chrome
- INFRA-004 (Design Tokens) for light mode styling
- ORG-001 (Organiser Profile) for profile setup

---

## Related

- NAV-001: Navigation Strategy Decision
- [06-design-principles-2026.md](../../06-design-principles-2026.md) §9 (Light mode)