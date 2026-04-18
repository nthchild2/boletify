# TICKET: Navigation Strategy Decision

**Epic:** Infrastructure
**Ticket ID:** NAV-001
**Type:** spike
**Status:** TODO

---

## Description

Evaluate and decide on navigation approach for monorepo with separate Expo (native) and Next.js (web) apps. Need to determine if unified navigation makes sense given the product scope.

---

## Current State

- **Native app** (`apps/native`): Expo Router (file-based routing, uses `app/` directory)
- **Web app** (`apps/web`): Next.js App Router (file-based routing, uses `app/` directory)
- **Shared UI**: Both use `react-native-web` via `@repo/ui` package
- **react-native-web**: Already configured in `apps/web/next.config.js`

---

## Options Evaluated

### Option A: Keep Separate (Current State)
- Native: Expo Router
- Web: Next.js App Router
- Pros: No extra deps, each platform idiomatic
- Cons: Navigation logic duplicated, no shared route definitions

### Option B: Solito
- Unifies `useRouter()` and `Link` across Expo and Next.js
- Uses URLs as single source of truth
- Requires restructuring to shared navigation patterns
- Solito v5 (2025) is web-first, works with pure Next.js

### Option C: Expo Router Both
- Use `@expo/next-adapter` to run Expo Router on Next.js
- Unified file structure
- Cons: Some Next.js features unavailable

### Option D: React Navigation Both
- React Navigation on native + web via react-native-web
- Most flexible but highest boilerplate

---

## Decision: Keep Split for MVP

**Chosen approach:** Option A (Keep Separate)

**Rationale:**
1. Both platforms use file-based routing (similar mental model)
2. react-native-web already enables shared UI components
3. Can add Solito later with minimal refactor when screens need sharing
4. No additional dependencies needed

**Post-MVP consideration:** Evaluate Solito when:
- Multiple screens need to share navigation patterns
- Need unified deep-linking between web and native
- Product shows need for native app features beyond responsive web

---

## Future Work (Phase 2)

- [ ] Spike on Solito integration
- [ ] Evaluate if product flows benefit from unified navigation
- [ ] Consider @expo/next-adapter if Expo Router becomes dominant pattern

---

## Research Notes

- Expo Router dominates 71% of React Native ecosystem (2026)
- Solito v5 dropped react-native-web dependency, works with pure Next.js
- T3 Turbo is production-tested pattern for Expo + Next.js monorepos
- "Headless navigation" (URL as source of truth) is proven approach

---

## Related

- Tech Doc: [04-technical-architecture.md](../04-technical-architecture.md)
- Native app: `apps/native/`
- Web app: `apps/web/`
- Shared UI: `packages/ui/`