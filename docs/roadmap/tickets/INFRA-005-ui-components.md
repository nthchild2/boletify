# TICKET: UI Component Library Expansion

**Epic:** Infrastructure
**Ticket ID:** INFRA-005
**Type:** feature
**Status:** ✅ Done

**Dependencies:** INFRA-004 (Design Tokens)

---

## Description

Expand `@boletify/ui` package with core components for the Brutal-Glass design system.

---

## Acceptance Criteria

- [x] **AC1:** `Card` component — brutal card with border, radius-md/lg, optional brick shadow
- [x] **AC2:** `GlassCard` component — glass surface with shadow-glass-*, backdrop-blur, catch-light effect
- [x] **AC3:** `Text` component family — Display, Heading, Body, Label, Caption, Overline, Mono
- [x] **AC4:** `Badge` component — small tag/chip, radius-xs, variant colors
- [x] **AC5:** `Avatar` component — radius-full, supports image or initials

---

## Implementation Summary

All components created in `@boletify/ui/src/`:

| Component | File | Exports |
|-----------|------|---------|
| Card | card.tsx | Card, CardProps |
| GlassCard | glass-card.tsx | GlassCard, GlassCardProps |
| Text | text.tsx | Text, TextProps, TextVariant |
| Badge | badge.tsx | Badge, BadgeProps, BadgeVariant |
| Avatar | Avatar.tsx | Avatar, AvatarProps, AvatarSize |

All exported from `@boletify/ui/src/index.tsx`.

---

## Related

- INFRA-004: Design Tokens & UI Package
- [06-design-principles-2026.md](../../06-design-principles-2026.md)