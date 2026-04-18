# TICKET: Explore CSS Alternatives to Tailwind

**Epic:** Infrastructure
**Ticket ID:** INFRA-008
**Type:** investigation
**Status:** TODO

---

## Description

Evaluate alternative styling approaches to Tailwind CSS. The current Tailwind config works but has friction. Explore options that better fit the Brutal-Glass design system and improve developer experience.

---

## Background

Current pain points with Tailwind:
- Large config file with custom tokens
- Class name clutter in JSX
- Hard to visualize design tokens in code
- NativeWind adds complexity for React Native

---

## Options to Evaluate

### Option A: Vanilla Extract + CSS Variables
- Zero-runtime CSS-in-JS
- Type-safe CSS with TypeScript
- Design tokens as CSS variables (matches design doc better)
- Good React Native support via React Native Server Components

### Option B: Tailwind with CSS Variables (Refactor)
- Keep Tailwind but refactor to use CSS variables for all tokens
- Cleaner, more maintainable
- Still tied to Tailwind ecosystem

### Option C: Vanilla CSS + CSS Modules
- Simple, no build complexity
- CSS variables for tokens
- More manual but less abstraction

### Option D: Style Dictionary + Codegen
- Design tokens in one place (JSON)
- Codegen to CSS variables + TypeScript types
- Works with any styling solution

---

## Acceptance Criteria

- [ ] **AC1:** Review each option with pros/cons
- [ ] **AC2:** Evaluate React Native compatibility
- [ ] **AC3:** Assess migration effort from current Tailwind
- [ ] **AC4:** Provide recommendation with implementation plan

---

## Investigation Checklist

| Criteria | Vanilla Extract | Tailwind+Vars | CSS Modules | Style Dict |
|----------|-----------------|---------------|-------------|-------------|
| Type safety | | | | |
| RN support | | | | |
| Token mgmt | | | | |
| DX | | | | |
| Migration cost | | | | |

---

## Related

- INFRA-004: Design Tokens & UI Package
- [06-design-principles-2026.md](../../06-design-principles-2026.md)