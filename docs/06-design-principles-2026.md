# Boletify — Design Principles (2026)

> **Codename:** Brutal-Glass
> **Status:** v1.0 — supersedes the v0.1 MVP system (docs/03-ux-design.md §2)
> **Owner:** Design
> **Last updated:** 2026-04-17

This document is the **why** behind the 2026 visual system. Tokens in
`packages/tokens/src/index.ts` are the **what**. If the two disagree, fix the
tokens — this doc is law.

---

## 1. Thesis

Boletify is the ticket for a night out in Mexico City. Our previous system
(dark navy + purple→coral gradient + soft 12px radii + Inter) looked like every
seed-stage SaaS template from 2023. It didn't smell like a flyer, didn't feel
like an artifact, and didn't stand a chance next to Dice, Shotgun, or a
Boiler Room drop.

**We are rebuilding around a single tension:** structural honesty meets material
wonder. The chassis is brutalist — raw, load-bearing, unapologetic. The
artifacts (tickets, QR codes, hero media, sheets) are liquid — translucent,
glowing, tactile, held-in-the-hand.

We call this **Brutal-Glass**. Every design decision below serves that tension.

## 2. Eleven principles

1. **The ticket is the hero, not the page.** UI chrome is scaffolding. The
   ticket artifact — die-cut silhouette, paper grain, glass QR stamp — is
   where we spend the polish budget.
2. **Type is a graphic asset, not a label.** Display sizes start at 56px and
   go to 128px. We use weight and tracking as illustration.
3. **Numbers are tabular and monospaced.** Prices, dates, ticket IDs, seat
   counts, timers — JetBrains Mono, tabular-nums, always. This is a
   signature, not a polish detail.
4. **Borders do structural work; shadows do atmospheric work.** A 1.5px
   ink-800 border is load-bearing. A brick-shadow is a structural
   declaration. A glass-shadow is a mood.
5. **Two shadow families, never blended.**
   - `brick-*`: hard, offset, zero-blur, brutal. For structural elements
     (buttons, cards, brand moments). Used for *presence*.
   - `glass-*`: layered, soft, composed (outer drop + inner catch-light).
     For precious artifacts and overlays. Used for *material*.
6. **Radii encode register.** Sharp (0, 2, 4px) = brutal. Soft (22, 28, 40px)
   = glass. Midrange (8, 14px) is reserved for inputs and small chips. Mixing
   registers in a single element is forbidden unless it is a signature
   moment (e.g. ticket = glass body, brick-shadow chassis).
7. **Color is structural, not decorative.**
   Ink is the page. Bone is the light. Signal (electric lime) is where the
   user *acts*. Rosa Mexicano is where the user *feels*. Oxblood is where
   the user is *stopped*.
8. **Accessibility is non-negotiable on CTAs.** Signal-lime on ink passes 4.5:1
   at body sizes and >7:1 at button sizes. Signal never sits on bone without
   a black inset border. Rosa Mexicano on ink passes at large text only —
   never use it for body copy.
9. **Motion is either instant or expressive — never "smooth."** 80ms linear
   for state changes (brutal honesty). 420ms cubic-bezier(0.34, 1.3, 0.64, 1)
   for object moments (ticket reveal, modal). We do not ship 200ms ease-in-out
   as a default; it is the sound of bureaucracy.
10. **Spanish first, always.** UI copy is Mexican Spanish. Display type must
    support accented caps (Á, É, Í, Ó, Ú, Ñ) at 128px without awkward
    clipping. Voice is direct and informal — "Tú" not "Usted".
11. **No skeuomorphism except for the ticket.** The ticket is the one place
    we allow paper grain, perforation dotted lines, and die-cut notches.
    Everywhere else, honor the medium.

## 3. The palette — "Ánima Nocturna"

### 3.1 Ink (brutalist chassis)

| Token | Hex | Use |
|---|---|---|
| `ink.1000` | `#000000` | Brick shadow fill on bone |
| `ink.950` | `#08080C` | Page background (dark mode default) |
| `ink.900` | `#0F0F15` | Deep panel |
| `ink.850` | `#161620` | Raised surface |
| `ink.800` | `#1F1F2B` | Input / divider |
| `ink.700` | `#2E2E3E` | Strong border |
| `ink.500` | `#55556A` | Muted |
| `ink.400` | `#787891` | Placeholder / disabled text |
| `ink.300` | `#9B9BB3` | Secondary text on dark |
| `ink.200` | `#C2C2D0` | Hi-secondary text on dark |
| `ink.100` | `#E4E4EB` | Tertiary surface on light |
| `bone.50`  | `#F6F2EA` | Cream paper (light mode page) |

### 3.2 Signal — Electric Lime (the brutalist voice)

The primary action color. Used with extreme discipline: **one signal-lime
element per screen** unless it's a marquee pattern. Primary CTA, and that is it.

| Token | Hex |
|---|---|
| `signal.400` | `#D7FF3A` |
| `signal.500` | `#C6FF2E` ← primary |
| `signal.600` | `#9FE600` ← pressed |
| `signal.900` | `#2B3300` ← text on signal |

### 3.3 Rosa Mexicano — Hot Pink (the liquid voice)

Cultural resonance. Used for price highlights, heart/save states, urgency,
celebrations, and glass tints.

| Token | Hex |
|---|---|
| `rosa.400` | `#FF6AA9` |
| `rosa.500` | `#FF2E88` ← brand accent |
| `rosa.600` | `#D6005F` |

### 3.4 Oxblood — Architectural Warmth

Danger state, sold-out state, canceled. Never used as a decorative color.

| Token | Hex |
|---|---|
| `oxblood.400` | `#A32438` |
| `oxblood.500` | `#7A1020` |

### 3.5 Utility

| Token | Hex | Use |
|---|---|---|
| `leaf.500` | `#20D987` | Success (check-in valid, paid) |
| `leaf.400` | `#55EBA6` | Success hover |
| `sun.500` | `#FF9E00` | Warning (OXXO pending) |
| `sun.400` | `#FFB85C` | Warning hover |
| `cenote.500` | `#00B3C7` | Info (neutral banners, tooltips) |

### 3.6 Gradient mesh (hero + glass tints only)

No more literal 135° two-stop gradient. We use a **mesh** — three conic blobs
over ink, blurred into a glow. Implemented as either layered `radial-gradient`s
or an SVG mesh filter.

```css
background:
  radial-gradient(1200px 600px at 15% 10%, rgba(198,255,46,0.18), transparent 60%),
  radial-gradient(900px 700px at 85% 20%, rgba(255,46,136,0.22), transparent 55%),
  radial-gradient(800px 800px at 50% 110%, rgba(122,16,32,0.35), transparent 60%),
  #08080C;
```

## 4. Typography

### 4.1 Stack

| Role | Family | Axis | Notes |
|---|---|---|---|
| Display | **Bricolage Grotesque Variable** | opsz 12-96, wght 200-800 | Optical-size axis means we can use the *same font* for a 128px hero and 12px label without it feeling like two fonts. This is genuinely 2026. |
| Body | **Inter Variable** | wght 100-900 | Workhorse. Used for all body, forms, dashboards. |
| Mono / Numeric | **JetBrains Mono Variable** | wght 100-800 | Tabular by default. Every price, date, ticket ID. |

All three are open-source (OFL) and self-hosted — no Google Fonts network call.

### 4.2 Scale

Numbers are **px / line-height**. All display tokens use Bricolage. All body
tokens use Inter. All mono tokens use JetBrains Mono with `font-feature-settings: "tnum"`.

| Token | Size/LH | Weight | Tracking | Example |
|---|---|---|---|---|
| `display-2xl` | 128/112 | 900 | -4% | Hero on homepage only |
| `display-xl` | 96/88 | 900 | -3.5% | Event detail hero |
| `display-lg` | 72/68 | 850 | -3% | Section breaks |
| `display-md` | 56/56 | 800 | -2.5% | Marketing headers |
| `display-sm` | 40/44 | 800 | -2% | Page titles |
| `heading-lg` | 32/36 | 700 | -1.5% | Card H1 |
| `heading-md` | 24/30 | 700 | -1% | Card H2 |
| `heading-sm` | 18/24 | 600 | -0.5% | Subheads |
| `body-lg` | 18/28 | 400 | 0 | Event description lead |
| `body-md` | 16/24 | 400 | 0 | Default body |
| `body-sm` | 14/22 | 400 | 0 | Meta |
| `label` | 13/16 | 600 | +4% UPPERCASE | Tags, chips, CTAs |
| `caption` | 12/16 | 400 | +2% | Fine print |
| `overline` | 11/16 | 700 | +16% UPPERCASE | Category, section tags — a brutalist signature |
| `mono-md` | 14/20 | 500 | 0 tabular | Prices, timestamps |
| `mono-sm` | 12/16 | 500 | 0 tabular | Ticket IDs, codes |

### 4.3 Usage rules

- **No display below 40px.** If you want tight heading weight below that,
  use `heading-lg`.
- **Display is always set in Bricolage.** Never in Inter.
- **Overline is a signature.** `OVERLINE · WITH · BULLETS` is a Boletify
  pattern: ALL CAPS, +16% tracking, middle-dot separators.
- **Numbers in the wild are monospaced.** `$450.00 MXN`, `Sáb 15 · 21:00`,
  `TCK-0412-0091`. Inline numbers in prose (e.g. "35 mil asistentes") stay
  in Inter.

## 5. Radii

Two registers. Keep them pure.

| Token | px | Register | Use |
|---|---|---|---|
| `radius-0` | 0 | Brutal | Marquees, brand bands, data tables |
| `radius-xs` | 2 | Brutal | Overline tags |
| `radius-sm` | 4 | Brutal/utility | Small chips |
| `radius-md` | 8 | Utility | Inputs, small buttons |
| `radius-lg` | 14 | Utility | Standard cards, modals (structural) |
| `radius-xl` | 22 | Glass | Tickets, glass panels, bottom sheets |
| `radius-2xl` | 28 | Glass | Hero glass cards |
| `radius-3xl` | 40 | Glass | Full-bleed hero overlays |
| `radius-full` | 9999 | Utility | Avatars, status pills |

## 6. Shadows

### 6.1 Brick (brutal, hard, offset)

Zero blur. Always solid. The shadow is a structural declaration — a card
casting a brick onto the page. On press, the brick is "absorbed" (offset → 0,
element translates down-right by the same offset).

```css
--shadow-brick-sm:  3px 3px 0 0 var(--color-ink-950);
--shadow-brick-md:  6px 6px 0 0 var(--color-ink-950);
--shadow-brick-lg:  10px 10px 0 0 var(--color-ink-950);
--shadow-brick-signal: 6px 6px 0 0 var(--color-signal-500);
--shadow-brick-rosa:   6px 6px 0 0 var(--color-rosa-500);
```

On light mode (`bone.50` pages), brick shadow is `ink.1000`. On dark mode,
brick shadow is `signal.500` or `rosa.500` — a color brick on a dark surface.

### 6.2 Glass (liquid, layered)

Always three components: outer drop (depth) + inner top-edge catch-light
(material thickness) + backdrop-blur on the surface itself.

```css
--shadow-glass-sm:
  0 1px 1px 0 rgba(0,0,0,0.25),
  inset 0 1px 0 rgba(255,255,255,0.08);
/* surface: backdrop-blur(20px) */

--shadow-glass-md:
  0 8px 24px -4px rgba(0,0,0,0.35),
  0 2px 8px -2px rgba(0,0,0,0.25),
  inset 0 1px 0 rgba(255,255,255,0.10);
/* surface: backdrop-blur(32px) */

--shadow-glass-lg:
  0 24px 64px -12px rgba(0,0,0,0.45),
  0 8px 20px -4px rgba(0,0,0,0.30),
  inset 0 1px 0 rgba(255,255,255,0.12);
/* surface: backdrop-blur(40px) */
```

### 6.3 Glow (reactive light)

Used sparingly — focus, loading, celebration.

```css
--shadow-glow-signal: 0 0 32px rgba(198,255,46,0.35), 0 0 64px rgba(198,255,46,0.15);
--shadow-glow-rosa:   0 0 32px rgba(255, 46,136,0.35), 0 0 64px rgba(255, 46,136,0.15);
--shadow-glow-focus:  0 0 0 2px var(--color-signal-500), 0 0 16px rgba(198,255,46,0.45);
```

## 7. Motion

| Token | Duration | Easing | Use |
|---|---|---|---|
| `motion-instant` | 80ms | linear | Checkbox, toggle, press-release |
| `motion-fast` | 120ms | `cubic-bezier(0.2, 0, 0, 1)` | Hover state |
| `motion-base` | 220ms | `cubic-bezier(0.2, 0, 0, 1)` | Dropdown, tooltip |
| `motion-expressive` | 420ms | `cubic-bezier(0.34, 1.3, 0.64, 1)` | Modal, ticket reveal |
| `motion-stroll` | 720ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Hero reveal, page transition |
| `motion-marquee` | 28000ms | linear, infinite | Display marquees |

Variable-font weight transitions (`font-variation-settings`) are the default
for hover — not color. A button's label goes from `wght 600` → `wght 800` on
hover. This is the signature.

Reduced motion (`prefers-reduced-motion: reduce`) collapses all of the above
to 0ms and disables marquee animation.

## 8. Signature patterns

Six patterns the system lives by. Use these before inventing new ones.

### 8.1 The Ticket Artifact
Die-cut silhouette (two semicircle notches, mid-height, both sides), glass
body (`radius-xl` + `shadow-glass-md` + `backdrop-blur`), perforation dotted
line separating event info from QR stamp, paper grain noise texture at 4%
opacity, event hero image washed behind at 30% opacity + signal/rosa glow.

### 8.2 Brick-shadow CTAs
Primary button: `signal.500` fill, `ink.950` text, `radius-md`, `brick-md`
shadow in `ink.1000`. On hover: weight ramps 600→800. On press: offset
collapses to 0, button translates +6px/+6px, absorbing the brick. 80ms.

### 8.3 Overline pattern
`OVERLINE · CON · PUNTOS` — UPPERCASE, +16% tracking, 11px, middle-dot
separators with `\u00B7`. Used as category lines, breadcrumbs, metadata
strips. If there's no category, don't invent one.

### 8.4 Marquee bands
Horizontal-scrolling band using `display-lg`+ text, looping, rendered edge-to-
edge (radius-0), with a 1.5px ink.800 top+bottom border and no side padding.
Content: "DESCUBRE · NOCHES · SONIDOS · CDMX · 2026" on buyer home;
"EN VENTA · HOY · EN CDMX" on event list; organiser dashboard has none.

### 8.5 Mesh-gradient hero
Page background on buyer home and event detail uses the three-blob radial
mesh (§3.6). Cards sitting on it are either opaque `ink.900` (brutal) or
glass (artifact). Never transparent-but-not-glass.

### 8.6 Data density via tabular mono
Organiser dashboards and ticket lists render all numeric data in JetBrains
Mono with `font-feature-settings: "tnum", "ss01"`. This single choice
instantly makes the product feel serious — closer to Bloomberg/Stripe
Sigma than a CMS.

## 9. Light mode (organiser dashboard)

The organiser side inverts the chassis:

- Page = `bone.50` (cream — never pure white; warmth matters)
- Panel = `#FFFFFF` with 1px `ink.100` border
- Brick shadow = `ink.1000` (black brick on cream = the signature look)
- Primary CTA = `ink.950` fill + `signal.500` text + brick shadow
  (lime on black on cream — the brand moment)
- Glass = `rgba(255,255,255,0.60)` + backdrop-blur — used for data overlays,
  filter bars, the check-in scanner chrome

Do **not** use signal-lime as a background fill on bone — contrast fails.

## 10. Dark mode (buyer experience)

Buyer flows default to dark. Page = `ink.950`. Cards = `ink.900`. Glass
artifacts float above with `shadow-glass-md`. Signal-lime is the only
bright color most screens see — usually exactly once, on the primary CTA.

## 11. What we are explicitly *not* doing

Listed to save future debate:

- **No 135° purple→coral gradient.** Dead.
- **No generic iOS-style blur cards.** Glass surfaces carry our inner
  catch-light and backdrop-blur amount; bare `backdrop-filter: blur(10px)`
  is a code smell.
- **No Helvetica, no SF Pro, no Manrope.** Bricolage/Inter/JBM only.
- **No rounded buttons with radius > 14px** unless the element is explicitly
  a glass artifact.
- **No drop shadows blended with glow.** One shadow family per element.
- **No default 200ms ease-in-out** anywhere. Reject in code review.
- **No emoji in UI chrome.** Emoji is content, not decoration.
- **No stock photography on event cards.** Organiser images only.

## 12. Cross-references

- Canonical tokens: `packages/tokens/src/index.ts`
- Tailwind preset: `packages/config/tailwind/preset.ts`
- Design-system components: `packages/design-system/src/`
- Figma populate spec: `docs/figma-mcp-prompt.md`
- Wireframe / screen layouts: `docs/03-ux-design.md` §3 (visual spec in §2 is
  superseded by this document)
- Live preview (HTML): `docs/design-preview.html`
