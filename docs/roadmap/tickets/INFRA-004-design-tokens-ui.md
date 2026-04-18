# TICKET: Design Tokens & UI Package

**Epic:** Infrastructure
**Ticket ID:** INFRA-004
**Type:** feature
**Status:** TODO

---

## Description

Create the design system foundation with design tokens and shared UI components. This package enables consistent styling across both web and native platforms using Tailwind CSS (web) and NativeWind (native).

---

## Acceptance Criteria

- [ ] **AC1:** `@boletify/tokens` package created with design tokens (colors, spacing, typography, radii, shadows)
- [ ] **AC2:** Tailwind configuration updated to use tokens
- [ ] **AC3:** NativeWind configured for React Native
- [ ] **AC4:** `@boletify/ui` package expanded with core components:
  - Button
  - Input / TextField
  - Card
  - Text (typography components)
  - View (layout components)
- [ ] **AC5:** Components work on both web and native via react-native-web
- [ ] **AC6:** TypeScript types for all tokens and components

---

## Current State

The repo already has:
- `@repo/ui` package with a basic `Button` component
- `react-native-web` configured in `apps/web/next.config.js`
- Tailwind configured in Next.js

---

## Technical Notes

### Token Categories

Based on design doc (06-design-principles-2026.md):

| Category | Examples |
|----------|----------|
| **Colors** | ink, bone, signal-lime, rosa-mexicano, oxblood |
| **Typography** | Bricolage Grotesque (display), Inter (body), JetBrains Mono (numerics) |
| **Spacing** | 4, 8, 12, 16, 24, 32, 48, 64 |
| **Radii** | 0, 2, 4, 8, 14 (brutal) / 22, 28, 40 (glass) |
| **Shadows** | brick-*, glass-*, glow-* families |
| **Motion** | 80ms (instant), 420ms (expressive), 720ms (stroll) |

### Package Structure

```
packages/tokens/
├── src/
│   ├── index.ts      # Main exports (design tokens as JS objects)
│   ├── colors.ts     # Color tokens
│   ├── typography.ts # Font families, sizes, weights
│   ├── spacing.ts    # Spacing scale
│   └── index.ts      # Token exports
└── package.json

packages/ui/
├── src/
│   ├── index.ts      # Main exports
│   ├── button.tsx    # Button component
│   ├── input.tsx     # Input component
│   ├── card.tsx      # Card component
│   └── ...
└── package.json
```

### Cross-Platform Strategy

- Use react-native-web for component rendering
- Style with StyleSheet (RN) → translates to CSS (web)
- Tailwind classes available via NativeWind

---

## Related

- Epic: [00-Epic-INFRA.md](../00-Epic-INFRA.md)
- Design Doc: [06-design-principles-2026.md](../06-design-principles-2026.md)
- Tech Doc: [04-technical-architecture.md](../04-technical-architecture.md) § 6 (Design System)