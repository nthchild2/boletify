---
name: boletify-design-system
description: Boletify's "Brutal-Glass · Ánima Nocturna" design system — tokens, components, copy rules and UI kits. Use for any Boletify UI, screen, component, styling, copy or brand work (web, native, mockups, slides).
---

# Boletify Design System

The system lives in `design-system/` at the repo root. Read
`design-system/README.md` first: it is the brand book (voice, color roles,
type, radii registers, shadows, motion, iconography) and the rules there are
binding. `docs/06-design-principles-2026.md` is the manifesto behind it.

## Where things are

| Need | File |
| --- | --- |
| Every token (colors per theme, spacing, radii, shadows, blur, weights, type styles) with usage notes | `design-system/tokens.json` |
| The same tokens as CSS custom properties | `design-system/tokens.css` (generated from `tokens.json` — edit the JSON, then regenerate) |
| Fonts, `--text-*` type-scale vars, motion, mesh backgrounds, base element styles | `design-system/components/bundle.css` |
| One stylesheet entry point (imports both above) | `design-system/styles.css` |
| Component guidelines / props / demo | `design-system/components/<Name>/README.md`, `<Name>.d.ts`, `preview.html` |
| Component sources (React, JSX) | `design-system/components/src/<group>/<Name>.jsx` |
| Prebuilt bundle → `window.BoletifyDesignSystem_c6a0b5` | `design-system/components/bundle.js` |
| Full screens to copy from | `design-system/ui_kits/{buyer-web,organiser-web,marketing-web}/` |
| Social glyphs | `design-system/assets/icons/` |

Components: Button, Badge, Avatar, Input, Card, GlassCard (core) ·
EventCard, TicketArtifact (events) · HeroKicker, Marquee (brand) ·
StatStrip (data) · Wordmark (preview only).

## Rules that are easy to get wrong

- Theming: light is the default (organiser Panel). Dark (buyer) is
  `data-theme="dark"` on `<html>`. `class="dark"` alone switches only the
  mesh and color-scheme, not the color tokens.
- Use semantic tokens (`--color-bg`, `--color-fg`, `--color-primary`…) so
  themes flip; use literal palette tokens (`--signal-500`) only when a hue
  must stay fixed. Never put signal-lime as a fill on light grounds.
- One signal-lime primary CTA per screen. Rosa = price/save/urgency.
  Oxblood = sold-out/danger.
- Two shadow families, never blended: brick (hard, black, absorbed on press)
  vs glass (layered + backdrop blur). Radii encode register: 0/2/4 brutal,
  8/14 utility, 22/28/40 glass.
- Prices, dates, IDs: JetBrains Mono, tabular. Display type (Bricolage) only
  at 40px+. Overline: 11px, +0.16em, UPPERCASE, `·` separators.
- Copy: Mexican Spanish, informal "tú", action-first CTAs ("Comprar
  boletos"). "Boleto", never "entrada". Money in MXN. No emoji in UI chrome.
- Never invent a value: take it from `tokens.json`. Don't draw a logo — the
  brand mark is the `bolet·ify` wordmark in type (see
  `components/Wordmark/preview.html`).

## Using the components

In a standalone HTML prototype: link `design-system/styles.css`, load React
18 + ReactDOM, then `design-system/components/bundle.js`, and read
`window.BoletifyDesignSystem_c6a0b5.<Name>`. The `ui_kits/*/index.html`
pages show the full setup (serve the folder over HTTP; they load `.jsx`
through Babel standalone).

The `components/<Name>/preview.html` files are written for the Design System
artifact viewer, which preloads the stylesheets, React and the bundle. To
open one on its own, add those `<link>`/`<script>` tags first.

`bundle.js` is a prebuilt copy of `components/src/` (plus the UI kits). If
you change a component source, the bundle does not update by itself — say
so, and update the bundle or the artifact in step.

## Source of truth

This folder was copied from the "Boletify Design System" artifact on claude.ai
(https://claude.ai/artifact/5RBwZhgFatNHpXvqyFk7La). Edits made in either
place don't flow to the other automatically — mention which one you changed.
