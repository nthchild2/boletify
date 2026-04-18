# TICKET: UI Component Library Expansion

**Epic:** Infrastructure
**Ticket ID:** INFRA-005
**Type:** feature
**Status:** TODO

---

## Description

Expand `@boletify/ui` package with all core components needed for the Brutal-Glass design system. These are the building blocks for all screens and flows.

---

## Acceptance Criteria

- [ ] **AC1:** `Card` component — brutal card with border, radius-md/lg, optional brick shadow
- [ ] **AC2:** `GlassCard` component — glass surface with shadow-glass-*, backdrop-blur, catch-light effect
- [ ] **AC3:** `Text` component family:
  - Display (display-2xl to display-sm)
  - Heading (heading-lg to heading-sm)
  - Body (body-lg to body-sm)
  - Label, Caption, Overline
  - Mono (mono-md, mono-sm)
- [ ] **AC4:** `Badge` component — small tag/chip, radius-xs/sm, overline style
- [ ] **AC5:** `Avatar` component — radius-full, supports image or initials
- [ ] **AC6:** `GlassButton` variant — glass surface with glass shadow, for ticket artifacts
- [ ] **AC7:** All components work on both web and native via NativeWind

---

## Component Specs

### Card (Brutal)

```tsx
<Card variant="default" shadow="brick-md">
  {/* content */}
</Card>

// variants: default, bordered, ghost
// shadow: none, brick-sm, brick-md, brick-lg
```

### GlassCard

```tsx
<GlassCard intensity="md">
  {/* content - ticket-like surface */}
</GlassCard>

// intensity: sm (20px blur), md (32px blur), lg (40px blur)
// has inner catch-light, glass shadow
```

### Text Family

```tsx
<Text variant="display-lg">Hero</Text>
<Text variant="heading-md">Section</Text>
<Text variant="body-md">Body</Text>
<Text variant="overline">CATEGORY · TAG</Text>
<Text variant="mono-md">$450.00 MXN</Text>
```

### Badge

```tsx
<Badge variant="signal">LIVE</Badge>
// variants: signal, rosa, oxblood, leaf, sun, cenote, ink
```

### Avatar

```tsx
<Avatar src={url} size="md" />
<Avatar initials="AB" size="sm" />
// sizes: xs (24px), sm (32px), md (40px), lg (56px), xl (80px)
```

---

## Current State

`@boletify/ui` currently has:
- ✅ Button
- ✅ Input

Need to add:
- ❌ Card
- ❌ GlassCard
- ❌ Text
- ❌ Badge
- ❌ Avatar

---

## Dependencies

- Design tokens in `tailwind.config.js` (completed in INFRA-004)
- NativeWind for cross-platform styling

---

## Related

- INFRA-004: Design Tokens & UI Package
- [06-design-principles-2026.md](../../06-design-principles-2026.md)