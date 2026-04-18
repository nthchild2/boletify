# TICKET: Design Tokens & UI Package

**Epic:** Infrastructure
**Ticket ID:** INFRA-004
**Type:** feature
**Status:** 🟡 In Progress

---

## Description

Create the design system foundation with design tokens and shared UI components. This package enables consistent styling across both web and native platforms using Tailwind CSS (web) and NativeWind (native).

---

## Acceptance Criteria

- [x] **AC1:** Design tokens in Tailwind config (colors, spacing, typography, radii, shadows, motion, glow)
- [x] **AC2:** Tailwind configuration with all Brutal-Glass tokens
- [ ] **AC3:** `@boletify/tokens` package with JS exports for runtime access
- [ ] **AC4:** NativeWind configured for React Native
- [x] **AC5:** `@boletify/ui` package with core components:
  - [x] Button
  - [x] Input / TextField
  - [ ] Card
  - [ ] GlassCard
  - [ ] Text (typography components)
  - [ ] View (layout components)
  - [ ] Badge
  - [ ] Avatar
- [ ] **AC6:** Components work on both web and native via react-native-web
- [ ] **AC7:** TypeScript types for all tokens and components

---

## Current State (2026-04-17)

**Completed:**
- Tailwind config (`tailwind.config.js`) includes:
  - Colors: ink, bone, signal, rosa, oxblood, leaf, sun, cenote
  - Typography: display (Bricolage), body (Inter), mono (JetBrains Mono)
  - Radii: 0, xs, sm, md, lg, xl, 2xl, 3xl, full
  - Shadows: brick-sm/md/lg/signal/rosa, glass-sm/md/lg, glow-signal/rosa/focus
  - Motion: keyframes (marquee), durations (80/120/220/420/720ms), easing curves
  - Patterns: bg-mesh-gradient, bg-mesh-gradient-light
  - Backdrop blur: glass-sm (20px), glass-md (32px), glass-lg (40px)
- `@boletify/ui` package has Button and Input components

**Remaining:**
- Card, GlassCard, Text, Badge, Avatar components
- Tokens package for JS exports
- NativeWind setup verification

---

## Technical Notes

### Token Categories (per design doc 06-design-principles-2026.md)

| Category | Status | Location |
|----------|--------|----------|
| **Colors** | ✅ Done | tailwind.config.js |
| **Typography** | ✅ Done | tailwind.config.js |
| **Spacing** | ✅ Done | tailwind.config.js |
| **Radii** | ✅ Done | tailwind.config.js |
| **Shadows** | ✅ Done | tailwind.config.js |
| **Motion** | ✅ Done | tailwind.config.js |
| **Glow** | ✅ Done | tailwind.config.js |
| **Patterns** | ✅ Done | tailwind.config.js |

### Package Structure (Current)

```
packages/ui/
├── src/
│   ├── index.ts      # Main exports
│   ├── button.tsx    # ✅ Done
│   ├── input.tsx     # ✅ Done
│   ├── card.tsx      # TODO
│   └── ...
└── package.json
```

### Next Steps

1. Add remaining UI components (Card, GlassCard, Text, Badge, Avatar)
2. Create `@boletify/tokens` package with JS exports (optional - tokens currently in Tailwind only)
3. Verify NativeWind cross-platform compatibility

---

## Related

- Epic: [00-Epic-INFRA.md](../00-Epic-INFRA.md)
- Design Doc: [06-design-principles-2026.md](../06-design-principles-2026.md)
- Tech Doc: [04-technical-architecture.md](../04-technical-architecture.md) § 6 (Design System)