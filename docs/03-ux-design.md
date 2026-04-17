# Phase 3 — UX & Design

> **Status:** 🟡 In Progress — updated 2026-04-10: added competitive design context, motion tokens, missing wireframes (B-10, B-11, E-02–E-06), fixed O-11/O-12 duplication, closed open questions
> **Owner Hat:** Design Lead  
> **Upstream Input:** [Phase 1 — Business Model](01-business-model.md), [Phase 2 — Product Design](02-product-design.md), [Brand Voice Guidelines](../.claude/brand-voice-guidelines.md)
> **Downstream Consumer:** [Phase 4 — Technical Architecture](04-technical-architecture.md)  
> **Figma Source of Truth:** See [§ 9 — Figma Artifact Map](#9-figma-artifact-map) for links to all design files.
> **Figma file key:** `p0C0ZYhxuDOX0XsWklEUT9`
> **Figma file URL:** [Boletify — Design System & Screens](https://www.figma.com/design/p0C0ZYhxuDOX0XsWklEUT9/Boletify-%E2%80%94-Design-System---Screens?node-id=0-1&p=f&t=ijrRI730FPeFfnZp-0)

---

## Purpose

Translate every product flow and requirement from Phase 2 into concrete screen designs, interaction patterns, and a reusable design system. This document — together with the linked Figma files — is the blueprint engineering will implement.

**Design philosophy:**  
> *"Tecnología al servicio — Tech should simplify, not complicate. If our grandma can't buy a ticket, we've failed."*  
> — Boletify Core Values (Phase 2 § 6.4)

We design mobile-first, Spanish-first, for a young (18–40) Mexican audience that lives on Instagram/TikTok, may not have a credit card, and attends 1–4 live events per month. Every screen must feel like the moment before the lights go down at a great show: anticipation, energy, trust.

---

## Competitive Design Context

> Design is the argument. Every UI decision either reinforces or undermines our competitive position. This section maps design choices directly to competitive differentiation. Source: [Boletify Battlecard](boletify-battlecard.html).

| Design Decision | Competitor It Beats | How |
|----------------|---------------------|-----|
| **All-in price shown on event card** | Ticketmaster MX (fined MXN 5M by PROFECO Feb 2026 for hidden fees) | Buyer sees real total before they ever click "Get Tickets". Structural honesty, not marketing claim. |
| **Fee breakdown visible at ticket selection — before checkout** | Ticketmaster MX, Eventbrite | Fee shown at the moment of decision, not at the payment screen. No checkout betrayal. |
| **OXXO, SPEI, Mercado Pago native from day one** | Eventbrite (no OXXO), Boletia (no SPEI) | Unbanked buyers (~40% of target market) are first-class citizens, not an afterthought. |
| **Dark-mode buyer UI** | Boletia (dated, light-mode only), Ticketmaster (corporate blue/white) | Visual language matches the event experience. Images of concerts pop on dark backgrounds. Instantly signals "indie, modern, for you." |
| **T+3 payout in organiser dashboard** | Boletia (T+7–10 in payout copy and dashboard) | Show the payout date explicitly and prominently in the dashboard. Make the speed visible — it's a feature. |
| **Buyer data export — one click** | Boletia (data locked in ecosystem) | "Exportar" button visible on every event's buyer list. Not buried in settings. The visibility of this button is the trust signal. |

**Brand voice in UX copy:** All microcopy must follow the [Brand Voice Guidelines](../.claude/brand-voice-guidelines.md). Key rules that affect UX:
- Use **tú**, never **usted**
- Prefer **boleto** over *entrada* or *ticket* (English)
- Fee copy must state exact amount — never "pequeña tarifa" or "cargo adicional"
- Error messages end with a next step — never just a period

---

## Table of Contents

1. [Design System](#1-design-system)
2. [Information Architecture](#2-information-architecture)
3. [Screen Flows & Wireframes](#3-screen-flows--wireframes)
4. [Interaction Patterns & Micro-interactions](#4-interaction-patterns--micro-interactions)
5. [Responsive & Multi-Device Strategy](#5-responsive--multi-device-strategy)
6. [Accessibility (a11y)](#6-accessibility-a11y)
7. [Error States & Edge Cases](#7-error-states--edge-cases)
8. [Open Questions](#8-open-questions)
9. [Figma Artifact Map](#9-figma-artifact-map)

---

## 1. Design System

> **🔄 Superseded by [`docs/06-design-principles-2026.md`](./06-design-principles-2026.md)** — the v2.0 "Brutal-Glass" system (April 2026). This section keeps a short summary for readers of this document; all decisions, tokens, and rationale live in the principles doc and the canonical tokens at `packages/tokens/src/index.ts`.
>
> **Figma source of truth:** see [§ 9 — Figma Artifact Map](#9-figma-artifact-map).

### 1.1 Snapshot of the 2026 system

| Axis | v2.0 "Brutal-Glass" |
|---|---|
| **Thesis** | Structural brutalism as chassis, liquid glass as artifact. |
| **Palette** | Ink (page) · Bone (light mode paper) · **Signal Lime `#C6FF2E`** (primary action) · **Rosa Mexicano `#FF2E88`** (accent) · Oxblood (danger) · Leaf/Sun/Cenote (state). |
| **Typography** | Bricolage Grotesque Variable (display) · Inter Variable (body) · JetBrains Mono Variable (numerics, ticket IDs, prices). |
| **Radii** | Two registers — brutal (0/2/4/8/14px) and glass (22/28/40px). Never mixed in a single element. |
| **Shadows** | Three families: `brick-*` (hard offset, brutal) · `glass-*` (layered drop + inner catch-light) · `glow-*` (focus / celebration). |
| **Motion** | 80ms linear for state changes · 420ms expressive spring for object moments · 720ms stroll for hero reveal. No default 200ms ease-in-out. |
| **Signature patterns** | The Ticket Artifact · Brick-shadow CTAs · OVERLINE · CON · PUNTOS · Marquee bands · Mesh-gradient hero · Tabular mono numerics. |

### 1.2 Where to find what

| I need… | Go to… |
|---|---|
| The "why" of any design decision | [`docs/06-design-principles-2026.md`](./06-design-principles-2026.md) |
| The canonical token values (hex, px, ms) | `packages/tokens/src/index.ts` |
| Tailwind class mapping | `packages/config/tailwind/preset.ts` |
| Component implementation | `packages/design-system/src/` |
| A living preview of the system | [`docs/design-preview.html`](./design-preview.html) |
| Figma populate instructions | [`docs/figma-mcp-prompt.md`](./figma-mcp-prompt.md) |

### 1.3 Deprecations (from v0.1 MVP)

The following v0.1 tokens and patterns are **removed** in v2.0. They should not appear in new code and should be migrated away from in existing code:

- `purple-*` and `coral-*` primitive ramps → replaced by `ink-*`, `signal-*`, `rosa-*`, `oxblood-*`
- `gradient-brand` (linear 135° purple→coral) → replaced by `mesh-hero` / `mesh-ambient` / `ticket-paper`
- `navy-*` surfaces → replaced by `ink-*` surfaces
- `elevation-dark-*` and `elevation-light-*` → replaced by `brick-*` / `glass-*` / `soft-*` shadow families
- `motion-normal` (200ms ease-in-out) as a default → replaced by explicit `motion-instant` or `motion-expressive` per intent
- `radius-lg: 12` default on cards → replaced by `radius-lg: 14` (structural) or `radius-xl: 22` (glass)
- Inter as display font → replaced by Bricolage Grotesque at display sizes

Compatibility shims (`elevationDark`, `elevationLight`) remain exported from `@boletify/tokens` to keep legacy components compiling through the migration; **do not reference them in new code**.

---

## 2. Information Architecture

### 2.1 Buyer-Facing Site Map

```
boletify.com/
├── / (Homepage / Discovery feed)
│   ├── Search overlay
│   └── Genre filter chips
├── /eventos/[slug] (Event Detail Page)
│   └── → /checkout/[eventId] (Checkout flow)
│       ├── Step 1: Ticket selection
│       ├── Step 2: Account / guest checkout
│       ├── Step 3: Payment
│       └── Step 4: Confirmation
├── /mis-boletos (My Tickets)
│   └── /mis-boletos/[ticketId] (Single ticket — full-screen QR)
├── /cuenta (Account settings)
│   ├── Perfil
│   ├── Historial de compras
│   └── Preferencias de comunicación
├── /auth/login
├── /auth/registro
├── /auth/magic-link (Email magic link landing)
├── /privacidad (Privacy notice)
├── /terminos (Terms of service)
└── /ayuda (Help / FAQ)
```

### 2.2 Organiser-Facing Site Map

```
boletify.com/org/
├── /org/dashboard (Dashboard home — event list)
├── /org/eventos/nuevo (Create new event — wizard)
│   ├── Step 1: Detalles del evento
│   ├── Step 2: Configuración de boletos
│   ├── Step 3: Códigos de descuento (optional)
│   └── Step 4: Vista previa y publicar
├── /org/eventos/[eventId] (Event detail — sales view)
│   ├── Tab: Ventas (sales chart, buyer list)
│   ├── Tab: Check-in (scanner + counter)
│   └── Tab: Configuración (edit event, promo codes)
├── /org/pagos (Payout summary + history)
├── /org/perfil (Organiser profile + settings)
│   ├── Información del organizador
│   ├── Datos bancarios
│   └── Configuración de cuenta
└── /org/soporte (Support / contact)
```

### 2.3 Navigation Model

| Context | Primary Nav | Secondary Nav |
|---------|------------|---------------|
| **Buyer (mobile)** | Sticky header: Logo, Search icon, My Tickets icon, Profile/Login icon | Hamburger → full nav |
| **Buyer (desktop)** | Top bar: Logo · Inicio · Explorar · **Crear Evento** (CTA) · Mis Boletos · Login/Avatar | — |
| **Organiser (desktop)** | Left sidebar: Dashboard, Crear Evento, Pagos, Perfil | Top bar: search, notifications, profile dropdown |
| **Organiser (mobile)** | Bottom tab bar: Dashboard, Crear, Pagos, Perfil | — |

---

## 3. Screen Flows & Wireframes

> **Figma pages:** `📱 Buyer Flows` and `💼 Organiser Flows`  
> Each flow below describes screens at wireframe fidelity. Figma contains both wireframes and high-fidelity mockups.  
> Screen IDs (e.g., B-01) are used to reference specific frames in Figma.

---

### 3.1 Buyer — Event Discovery

> **Personas:** Diego (young fan)  
> **Entry points:** Direct link from social media (primary for MVP), or homepage browse  
> **Phase 2 ref:** § 3.1

#### B-01: Homepage / Discovery Feed

```
┌─────────────────────────────────┐
│ [Logo]           🔍  🎫  👤    │ ← Sticky header (56px)
├─────────────────────────────────┤
│                                 │
│  Descubre tu próximo evento     │ ← display-md, white
│  en CDMX                        │ ← body-lg, neutral-300
│                                 │
│  [🔍 Buscar eventos, artistas…]│ ← Search bar (tappable)
│                                 │
│  [Indie] [Electrónica] [Rock]   │ ← Genre filter chips
│  [Hip-Hop] [Alternativo] [+]    │   (horizontal scroll mobile)
│                                 │
├─────────────────────────────────┤
│  ESTA SEMANA                    │ ← overline
│                                 │
│  ┌─────────┐  ┌─────────┐      │
│  │ 🖼️      │  │ 🖼️      │      │ ← Event cards (2-col grid
│  │ Event A │  │ Event B │      │   mobile, 3–4 col desktop)
│  │ 15 abr  │  │ 16 abr  │      │
│  │ Venue X │  │ Venue Y │      │
│  │ $350 MXN│  │ GRATIS  │      │ ← GRATIS badge in green
│  └─────────┘  └─────────┘      │
│                                 │
│  ┌─────────┐  ┌─────────┐      │
│  │ 🖼️      │  │ 🖼️      │      │
│  │ Event C │  │ Event D │      │
│  │ …       │  │ …       │      │
│  └─────────┘  └─────────┘      │
│                                 │
│  [Ver más eventos →]            │ ← Load more / pagination
└─────────────────────────────────┘
```

**Behaviour:**
- Default sort: Soonest events first
- Genre chips filter in real-time (no page reload)
- Search opens a dedicated overlay (B-02) with results-as-you-type
- Free events show "GRATIS" badge in `color-success` instead of price
- Past events excluded from feed

#### B-02: Search Overlay

```
┌─────────────────────────────────┐
│ ← [🔍 buscar…]          ✕      │ ← Auto-focus input, full-width
├─────────────────────────────────┤
│  Resultados para "noche"        │
│                                 │
│  🖼️ Noche de Indie Rock        │ ← Compact list items
│     15 abr · Foro Indie         │
│  🖼️ Noche Electrónica Vol. 3   │
│     22 abr · Club XYZ           │
│                                 │
│  ¿No encuentras lo que buscas?  │ ← Empty-state helper
│  [Explorar todos los eventos]   │
└─────────────────────────────────┘
```

---

### 3.2 Buyer — Event Detail & Purchase

> **Phase 2 ref:** § 3.2 (Purchase Flow), § 8 (Ticket Mechanics), § 9 (Promos)

#### B-03: Event Detail Page

```
┌──────────────────────────────────────┐
│ ← Volver            🔗 Compartir    │ ← Top bar (transparent over hero)
├──────────────────────────────────────┤
│                                      │
│            ┌──────────────┐          │
│            │              │          │
│            │  Cover Image │          │ ← 16:9 hero image, full-width
│            │  (full-width)│          │   Dark gradient overlay at bottom
│            │              │          │
│            └──────────────┘          │
│                                      │
│  [Indie]  [Rock]                     │ ← Genre tags
│                                      │
│  Noche de Indie Rock                 │ ← heading-lg
│                                      │
│  📅 Sábado, 15 de abril 2026        │ ← body-md, icon + text
│  🕐 21:00 — 02:00                   │
│  📍 Foro Indie, Roma Norte, CDMX    │ ← Tappable → opens map
│  👤 Por: Raúl Promotions            │ ← Organiser name (link)
│                                      │
├──────────────────────────────────────┤
│                                      │
│  Acerca del evento                   │ ← heading-sm
│                                      │
│  Lorem ipsum event description…      │ ← body-md, rich text
│  Lineup: Banda A, Banda B, DJ C     │   (bold, links, line breaks)
│  …                                   │
│  [Leer más ↓]                        │ ← Truncated on mobile (3 lines)
│                                      │
├──────────────────────────────────────┤
│  Boletos                             │ ← heading-sm
│                                      │
│  ┌────────────────────────────────┐  │
│  │ General Admission              │  │ ← All-in price shown
│  │ $350 MXN (incluye cargos)     │  │
│  │                   [— 1 +]     │  │ ← Quantity stepper
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ RSVP Gratuito                  │  │ ← Free tier if exists
│  │ GRATIS                         │  │
│  │                   [— 1 +]     │  │
│  └────────────────────────────────┘  │
│                                      │
│  ¿Tienes un código de descuento?    │ ← Collapsed by default
│  [▸ Aplicar código]                  │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐  │ ← Sticky bottom bar (mobile)
│  │  Total: $700 MXN              │  │
│  │  [★ Obtener Boletos]          │  │ ← Gradient CTA, full-width
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

**Behaviour:**
- Quantity stepper: min 0, max 10 (or organiser-configured). `0` removes tier from cart.
- Price updates live as quantity changes.
- Promo code field: tap to expand → enter code → "Aplicar" button → inline validation (green ✅ or red ❌ + message).
- "Obtener Boletos" is **disabled** until ≥ 1 ticket selected.
- Sold-out tiers show "Agotado" badge, stepper replaced with disabled state.
- Sticky bottom bar on mobile shows total + CTA. Appears after user scrolls past ticket section.
- Share button opens native share sheet (mobile) or copy-link + social icons (desktop).
- On desktop: two-column layout — details left, ticket selection right (sticky sidebar).

#### B-04: Checkout — Account / Guest

```
┌──────────────────────────────────────┐
│ ← Volver         Boletify     🔒    │ ← Lock icon for trust
├──────────────────────────────────────┤
│                                      │
│  ┌──────────────────────────────┐    │
│  │ 🖼 Noche de Indie Rock      │    │ ← Compact order summary
│  │ 2× General · $700 MXN       │    │
│  └──────────────────────────────┘    │
│                                      │
│  ─────── Paso 1 de 2 ──────────     │ ← Progress dots
│                                      │
│  ¿Cómo quieres continuar?           │ ← heading-md
│                                      │
│  [📧 Continuar con Google]          │ ← OAuth button (outline)
│                                      │
│  ──────── o ────────                │ ← Divider
│                                      │
│  Correo electrónico *               │
│  [tu@email.com                 ]     │
│                                      │
│  Nombre completo *                   │
│  [Tu nombre                    ]     │
│                                      │
│  ☐ Crear cuenta (opcional)          │ ← Reveals password field
│                                      │
│  ☐ Quiero recibir recomendaciones   │ ← Marketing opt-in
│    de eventos (opcional)             │   UNCHECKED by default (LFPDPPP)
│                                      │
│  [Continuar al pago →]              │ ← Primary CTA
│                                      │
│  Al continuar, aceptas nuestros     │ ← caption, with links
│  Términos y Aviso de Privacidad.    │
│                                      │
└──────────────────────────────────────┘
```

**Behaviour:**
- If user is already logged in, this step is skipped (pre-filled from account).
- Email validation: real-time format check on blur + duplicate purchase warning.
- "Crear cuenta" checkbox reveals password field with strength indicator.
- Marketing opt-in is **UNCHECKED** by default (LFPDPPP compliance, Phase 1 § 7.3).
- Google OAuth opens popup, returns to next step on success.

#### B-05: Checkout — Payment

```
┌──────────────────────────────────────┐
│ ← Volver         Boletify     🔒    │
├──────────────────────────────────────┤
│                                      │
│  ┌──────────────────────────────┐    │
│  │ 🖼 Noche de Indie Rock      │    │ ← Order summary
│  │ 2× General                   │    │
│  │ Subtotal:         $660 MXN   │    │
│  │ Cargo por servicio: $40 MXN  │    │ ← Fee broken out
│  │ Descuento (AMIGOS50): −$50   │    │ ← If promo applied
│  │ ────────────────────────     │    │
│  │ Total:            $650 MXN   │    │ ← heading-md, bold
│  └──────────────────────────────┘    │
│                                      │
│  ─────── Paso 2 de 2 ──────────     │
│                                      │
│  Método de pago                      │ ← heading-md
│                                      │
│  ┌────────────────────────────────┐  │
│  │ ◉ 💳 Tarjeta de crédito/     │  │ ← Radio buttons
│  │       débito                   │  │
│  ├────────────────────────────────┤  │
│  │  Número de tarjeta            │  │ ← Stripe Elements
│  │  [4242 •••• •••• ••••    ]    │  │   (hosted fields)
│  │  Vencimiento    CVV           │  │
│  │  [MM/AA    ]    [•••]         │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ ○ 🟣 Mercado Pago             │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ ○ 🏪 Pago en OXXO            │  │
│  │   (Recibirás una referencia   │  │ ← Helper text visible
│  │    para pagar en tienda.      │  │   even before selection
│  │    Tienes 72h para pagar.)    │  │
│  └────────────────────────────────┘  │
│                                      │
│  [🔒 Pagar $650 MXN]               │ ← Primary CTA with lock icon
│                                      │
│  🔒 Pago seguro procesado por      │ ← Trust badges
│  Stripe. Tus datos están protegidos.│
│                                      │
└──────────────────────────────────────┘
```

**Behaviour:**
- Default: card payment selected, Stripe Elements fields visible.
- Selecting Mercado Pago: hides card fields, CTA changes to "Pagar con Mercado Pago" → redirects to MP.
- Selecting OXXO: hides card fields, CTA changes to "Generar referencia OXXO".
- CTA button shows spinner + "Procesando…" during payment.
- On card error: inline error below card fields, CTA resets, cart preserved.
- Idempotency key generated to prevent double charges on retry/network error.

#### B-06: Order Confirmation (Card / Mercado Pago)

```
┌──────────────────────────────────────┐
│            Boletify                  │
├──────────────────────────────────────┤
│                                      │
│            ✅                        │ ← Large success icon
│                                      │   with spring animation
│  ¡Listo! Tus boletos están          │ ← display-md
│  confirmados.                        │
│                                      │
│  Noche de Indie Rock                 │ ← heading-md
│  📅 Sáb, 15 abr 2026 · 21:00       │
│  📍 Foro Indie, Roma Norte          │
│  🎫 2× General Admission            │
│  💰 $650 MXN                        │
│                                      │
│  ┌────────────────────────────────┐  │
│  │         ██████████             │  │ ← QR code(s)
│  │         ██      ██             │  │   One per ticket
│  │         ██████████             │  │
│  │                                │  │
│  │   Boleto 1 de 2               │  │ ← Swipe for next ticket
│  │   · · ●                        │  │   (dot indicator)
│  └────────────────────────────────┘  │
│                                      │
│  📧 También enviamos tus boletos   │
│  a diego@email.com                   │
│                                      │
│  [📲 Ver Mis Boletos]              │ ← Link to /mis-boletos
│  [📤 Compartir evento]             │ ← Native share
│  [🏠 Explorar más eventos]         │ ← Back to discovery
│                                      │
└──────────────────────────────────────┘
```

**Celebration moment:** Confetti particle effect (subtle, 2–3s). ✅ icon bounces in with `motion-spring`. Respects `prefers-reduced-motion`.

#### B-07: Order Confirmation (OXXO — Pending)

```
┌──────────────────────────────────────┐
│            Boletify                  │
├──────────────────────────────────────┤
│                                      │
│            🏪                        │ ← OXXO icon/illustration
│                                      │
│  Casi listo — paga en OXXO          │ ← display-md
│  para confirmar tus boletos          │
│                                      │
│  Noche de Indie Rock                 │ ← heading-md
│  2× General · $650 MXN              │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  Referencia de pago            │  │
│  │                                │  │
│  │  |||||||||||||||||||||||||||   │  │ ← Barcode
│  │  1234 5678 9012 3456           │  │ ← Reference number (large)
│  │                                │  │
│  │  Monto a pagar: $650 MXN      │  │
│  │  Vence: 18 abr 2026, 14:30    │  │ ← 72h deadline
│  └────────────────────────────────┘  │
│                                      │
│  📋 Instrucciones:                  │
│  1. Ve a cualquier tienda OXXO      │
│  2. Dile al cajero que quieres      │
│     hacer un pago de servicio       │
│  3. Muestra esta referencia         │
│  4. Paga $650 MXN en efectivo       │
│  5. Guarda tu comprobante           │
│                                      │
│  ⏳ Tus boletos se reservan por     │ ← Warning callout box
│  72 horas. Si no pagas antes del    │   (color-warning tint)
│  18 abr a las 14:30, se liberarán.  │
│                                      │
│  📧 Enviamos estas instrucciones   │
│  a diego@email.com                   │
│                                      │
│  Cuando recibamos tu pago, te       │
│  enviaremos tus boletos con QR      │
│  por correo.                         │
│                                      │
└──────────────────────────────────────┘
```

---

### 3.3 Buyer — Ticket Access

> **Phase 2 ref:** § 3.3

#### B-08: My Tickets Page

```
┌──────────────────────────────────────┐
│ [Logo]     Mis Boletos        👤    │
├──────────────────────────────────────┤
│                                      │
│  [Próximos]  [Pasados]              │ ← Tab selector
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 🖼️ │ Noche de Indie Rock      │  │ ← Ticket card
│  │    │ Sáb, 15 abr · 21:00     │  │
│  │    │ Foro Indie               │  │
│  │    │ 2 boletos · General      │  │
│  │    │ [Ver boletos →]          │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 🖼️ │ Festival Electrónico     │  │
│  │    │ Sáb, 22 abr · 20:00     │  │
│  │    │ Club XYZ                 │  │
│  │    │ ⏳ Pendiente de pago     │  │ ← OXXO pending (warning)
│  │    │ [Ver referencia OXXO →]  │  │
│  └────────────────────────────────┘  │
│                                      │
│  ── Pasados tab ──                  │
│  ┌────────────────────────────────┐  │
│  │ 🖼️ │ Concierto Pasado        │  │ ← Greyed out, muted
│  │    │ Sáb, 1 abr · Asististe  │  │
│  └────────────────────────────────┘  │
│                                      │
│  ── Empty state ──                  │
│  Aún no tienes boletos.             │
│  [Explorar eventos →]               │
│                                      │
└──────────────────────────────────────┘
```

#### B-09: Full-Screen QR Display

```
┌──────────────────────────────────────┐
│ ← Volver                            │
├──────────────────────────────────────┤
│                                      │
│                                      │
│  Noche de Indie Rock                 │ ← heading-md, centred
│  Sáb, 15 abr 2026 · 21:00          │
│  Foro Indie, Roma Norte              │
│                                      │
│                                      │
│         ┌──────────────┐             │
│         │              │             │
│         │   QR CODE    │             │ ← Maximum size QR
│         │   (large)    │             │   High contrast
│         │              │             │   White on navy-900
│         │              │             │
│         └──────────────┘             │
│                                      │
│      Boleto 1 de 2                   │ ← Swipeable (horizontal)
│      General Admission               │
│      · · ●                            │ ← Pagination dots
│                                      │
│  🔆 Sube el brillo de tu pantalla   │ ← Helpful hint (caption)
│                                      │
│                                      │
└──────────────────────────────────────┘
```

**Behaviour:**
- Screen auto-brightness prompt (if supported by browser).
- Swipe left/right to navigate between tickets in the order.
- QR rendered at maximum size for reliable scanning in low-light venues.
- Minimal UI — no nav bar, no distractions.
- Screen stays awake via `navigator.wakeLock` API.

#### B-10: Login / Registration

```
┌──────────────────────────────────────┐
│          [Boletify Logo]             │
├──────────────────────────────────────┤
│                                      │
│  [Iniciar sesión]  [Crear cuenta]   │ ← Tab toggle
│  ───────────────────                │
│                                      │
│  ── INICIAR SESIÓN ──               │
│                                      │
│  [📧 Continuar con Google]          │
│                                      │
│  ──────── o ────────                │
│                                      │
│  Correo electrónico *               │
│  [tu@email.com                 ]     │
│                                      │
│  Contraseña *                        │
│  [                         👁]      │
│                                      │
│  [Iniciar sesión →]                 │ ← Primary CTA
│                                      │
│  ¿Olvidaste tu contraseña?          │ ← Ghost link
│                                      │
│  ─────────────────────────          │
│                                      │
│  ¿No tienes cuenta?                 │
│  [Crear cuenta gratis]              │
│                                      │
└──────────────────────────────────────┘
```

**Behaviour:**
- Tabs switch between login and registration inline (no page navigation).
- "Crear cuenta" tab reveals: email, password + confirm, terms checkbox.
- Password field shows strength meter on registration.
- On success: redirect to intended destination (pre-checkout if coming from ticket flow, /mis-boletos if direct).
- After 5 failed login attempts: 15-min lockout + email notification (§7.4).
- Magic link: "¿Olvidaste tu contraseña?" sends a one-time login link; shows "Revisa tu correo."

#### B-11: Error Pages

**404 — Page Not Found**

```
┌──────────────────────────────────────┐
│ [Logo]                               │
├──────────────────────────────────────┤
│                                      │
│         [unDraw illustration]        │
│         (person looking at map)      │
│                                      │
│  404                                 │ ← display-md, `neutral-300`
│                                      │
│  Esta página no existe              │ ← heading-md
│                                      │
│  Quizás el enlace está roto o el    │ ← body-md, `neutral-300`
│  evento fue removido.               │
│                                      │
│  [Explorar eventos →]               │ ← Primary CTA
│  [← Volver]                         │ ← Ghost button
│                                      │
└──────────────────────────────────────┘
```

**500 — Server Error**

```
┌──────────────────────────────────────┐
│ [Logo]                               │
├──────────────────────────────────────┤
│                                      │
│         [unDraw illustration]        │
│         (server with wrench)         │
│                                      │
│  Algo salió mal de nuestro lado     │ ← heading-md
│                                      │
│  Estamos trabajando en ello.         │ ← body-md
│  Por favor intenta de nuevo          │
│  en unos minutos.                    │
│                                      │
│  [Reintentar]                       │ ← Primary CTA
│  [Ir al inicio]                     │ ← Ghost
│                                      │
│  Si el problema persiste, escríbenos │
│  a ayuda@boletify.com               │ ← caption
│                                      │
└──────────────────────────────────────┘
```

**Offline Banner** (inline, not a full-page error)

```
┌──────────────────────────────────────┐
│ ⚠️ Sin conexión a internet           │ ← Sticky banner, top
│    Verifica tu conexión.             │   `color-warning` bg
└──────────────────────────────────────┘
```

**Behaviour (all error pages):**
- unDraw illustrations use brand palette (`purple-500`, `coral-500`).
- "Reintentar" on 500 re-fetches the same URL.
- Offline banner appears/disappears reactively via `navigator.onLine` + fetch heartbeat (§7.5).

---

### 3.4 Organiser — Onboarding

> **Phase 2 ref:** § 3.4

#### O-01: Organiser Sign Up

```
┌──────────────────────────────────────┐
│          [Boletify Logo]             │
├──────────────────────────────────────┤
│                                      │
│  Crea tu cuenta de organizador       │ ← heading-lg
│  y empieza a vender boletos          │
│                                      │
│  [🔵 Continuar con Google]          │
│                                      │
│  ──────── o ────────                │
│                                      │
│  Correo electrónico *               │
│  [                              ]    │
│                                      │
│  Contraseña *                        │
│  [                         👁]      │ ← Show/hide toggle
│  Mínimo 8 caracteres                │ ← caption helper text
│                                      │
│  [Crear cuenta →]                    │ ← Primary CTA
│                                      │
│  ¿Ya tienes cuenta? Inicia sesión   │ ← Link
│                                      │
└──────────────────────────────────────┘
```

#### O-02: Organiser Profile Setup

```
┌──────────────────────────────────────┐
│  Paso 1 de 2 · Tu perfil            │ ← Progress
├──────────────────────────────────────┤
│                                      │
│  ┌──────┐                           │
│  │ 📷  │  Sube tu logo o foto      │ ← Circular upload area
│  └──────┘                           │
│                                      │
│  Nombre del organizador *            │
│  [Raúl Promotions              ]     │
│                                      │
│  Teléfono de contacto *             │
│  [+52 55 1234 5678             ]     │
│                                      │
│  Bio (breve) — opcional             │
│  [Producimos los mejores shows…    ] │
│                                      │
│  [Continuar →]                      │
│                                      │
└──────────────────────────────────────┘
```

#### O-03: Payout Setup

```
┌──────────────────────────────────────┐
│  Paso 2 de 2 · Datos de pago        │
├──────────────────────────────────────┤
│                                      │
│  Para recibir tus pagos, necesitamos │
│  verificar tu identidad y datos      │
│  bancarios.                          │
│                                      │
│  🔒 Procesado de forma segura por   │
│  Stripe. Boletify no almacena tus   │
│  datos bancarios.                    │
│                                      │
│  [Configurar datos de pago →]       │ ← Opens Stripe Connect
│                                      │   onboarding (hosted)
│  [Omitir por ahora]                 │ ← Ghost button
│                                      │
│  ℹ️ Puedes configurar esto después, │ ← info callout
│  pero es necesario antes de          │
│  publicar un evento con costo.       │
│                                      │
└──────────────────────────────────────┘
```

---

### 3.5 Organiser — Event Creation

> **Phase 2 ref:** § 3.5

#### O-04: Create Event — Details (Step 1 of 4)

```
┌──────────────────────────────────────────────────────┐
│ ◀ Panel │ Crear Evento                    Paso 1/4  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Detalles del evento                                 │ ← heading-lg
│                                                      │
│  Imagen de portada *                                 │
│  ┌──────────────────────────────────────┐            │
│  │                                      │            │ ← Drag-and-drop zone
│  │     📷 Arrastra una imagen o         │            │   16:9 aspect ratio
│  │     haz clic para subir              │            │   Max 5 MB
│  │     JPG, PNG o WebP · Max 5 MB       │            │   Shows preview + crop
│  │                                      │            │   tool after upload
│  └──────────────────────────────────────┘            │
│                                                      │
│  Nombre del evento *                                 │
│  [Noche de Indie Rock                          ]     │
│                                                      │
│  ┌─────────────────┐  ┌─────────────────┐           │
│  │ Fecha *          │  │ Hora inicio *   │           │
│  │ [15/04/2026    ] │  │ [21:00        ] │           │
│  └─────────────────┘  └─────────────────┘           │
│                                                      │
│  ┌─────────────────┐                                │
│  │ Hora fin (opc.) │                                │
│  │ [02:00         ] │                                │
│  └─────────────────┘                                │
│                                                      │
│  Lugar *                                             │
│  [Foro Indie, Roma Norte, CDMX        🔍]          │ ← Autocomplete
│                                                      │
│  Género musical *                                    │
│  [Indie] [Rock] [+ Agregar]                         │ ← Tag chips
│                                                      │
│  Descripción *                                       │
│  ┌──────────────────────────────────────┐            │
│  │ [B] [I] [🔗] [•] Rich text editor  │            │ ← Floating toolbar
│  │                                      │            │
│  └──────────────────────────────────────┘            │
│                                                      │
│  [Siguiente: Boletos →]                              │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### O-05: Create Event — Ticket Configuration (Step 2 of 4)

```
┌──────────────────────────────────────────────────────┐
│ ◀ Panel │ Crear Evento                    Paso 2/4  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Configuración de boletos                            │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │  Tipo de boleto 1                         🗑  │    │
│  │                                              │    │
│  │  Nombre *           Precio (MXN) *           │    │
│  │  [General Admission] [$350              ]     │    │
│  │                      ☐ Evento gratuito       │    │
│  │                                              │    │
│  │  Cantidad disponible *   Máx. por orden      │    │
│  │  [200                ]   [10             ]    │    │
│  │                                              │    │
│  │  Periodo de venta (opcional)                  │    │
│  │  Inicio: [01/04/2026 09:00]                  │    │
│  │  Fin:    [15/04/2026 20:00]                  │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  [+ Agregar otro tipo de boleto]                     │
│                                                      │
│  ── Vista previa para el comprador ──               │
│  ┌──────────────────────────────────────────────┐    │
│  │ General Admission                            │    │
│  │ Precio: $350 MXN                             │    │
│  │ Cargo por servicio: $27.50 MXN               │    │ ← 5% + $10
│  │ Total para el comprador: $377.50 MXN         │    │
│  │                                              │    │
│  │ ☐ Absorber el cargo (el comprador paga       │    │
│  │   solo $350 MXN, el cargo se descuenta       │    │
│  │   de tu pago)                                │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  [← Anterior]           [Siguiente: Descuentos →]   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### O-06: Create Event — Promo Codes (Step 3 of 4)

```
┌──────────────────────────────────────────────────────┐
│ ◀ Panel │ Crear Evento                    Paso 3/4  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Códigos de descuento (opcional)                     │
│                                                      │
│  Crea códigos que tus fans puedan usar al            │
│  comprar boletos.                                    │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │  Código 1                                 🗑  │    │
│  │                                              │    │
│  │  Código *            Tipo de descuento       │    │
│  │  [AMIGOS50      ]    ◉ Monto fijo ($MXN)    │    │
│  │                      ○ Porcentaje (%)        │    │
│  │                                              │    │
│  │  Descuento *         Usos máximos            │    │
│  │  [$50 MXN       ]    [100            ]       │    │
│  │                                              │    │
│  │  Fecha de expiración                         │    │
│  │  [15/04/2026 20:00]                          │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  [+ Agregar otro código]                             │
│                                                      │
│  [← Anterior]       [Siguiente: Vista previa →]     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### O-07: Create Event — Preview & Publish (Step 4 of 4)

```
┌──────────────────────────────────────────────────────┐
│ ◀ Panel │ Crear Evento                    Paso 4/4  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Vista previa                                        │
│                                                      │
│  Así verán tu evento los compradores:                │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │  [Simulated Event Detail Page — B-03]        │    │ ← Mini preview
│  │  (Shows exactly what buyer sees, including   │    │   the cover image, details, ticket tiers)
│  │                                              │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  ── Resumen ──                                      │
│  • 1 tipo de boleto (General Admission)             │
│  • 200 boletos disponibles                          │
│  • $350 MXN por boleto (+$27.50 cargo)              │
│  • 1 código de descuento activo                     │
│  • Venta: 01 abr — 15 abr 2026                     │
│                                                      │
│  [← Anterior]                                        │
│                                                      │
│  [💾 Guardar borrador]   [🚀 Publicar evento]      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### O-08: Post-Publish — Share

```
┌──────────────────────────────────────────────────────┐
│              🎉                                      │
│                                                      │
│  ¡Tu evento está en línea!                          │
│                                                      │
│  boletify.com/eventos/noche-indie-rock-cdmx-2026    │ ← Selectable URL
│  [📋 Copiar enlace]                                 │
│                                                      │
│  Comparte en:                                        │
│  [WhatsApp] [Instagram Stories] [X] [Facebook]       │
│                                                      │
│  [📊 Ir al panel de ventas →]                       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### 3.6 Organiser — Sales Dashboard

> **Phase 2 ref:** § 3.6

#### O-09: Dashboard Home

```
┌───────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  Dashboard                            👤 Raúl  │
│            │                                                  │
│ 📊 Panel   │  Bienvenido, Raúl                               │
│ ➕ Crear   │                                                  │
│ 💰 Pagos   │  ┌────────────┐ ┌────────────┐ ┌────────────┐  │
│ ⚙️ Config  │  │  3         │ │  450       │ │  $157K MXN │  │
│            │  │  Eventos   │ │  Boletos   │ │  Ventas    │  │
│            │  │  activos   │ │  vendidos  │ │  totales   │  │
│            │  └────────────┘ └────────────┘ └────────────┘  │
│            │                                                  │
│            │  Eventos                         [+ Nuevo ▸]    │
│            │                                                  │
│            │  ┌──────────────────────────────────────────┐    │
│            │  │ 🖼️ │ Noche de Indie Rock                │    │
│            │  │    │ 15 abr · Foro Indie                │    │
│            │  │    │ 🟢 En venta · 156/200 vendidos     │    │
│            │  │    │ $54,600 MXN                         │    │
│            │  └──────────────────────────────────────────┘    │
│            │                                                  │
│            │  ┌──────────────────────────────────────────┐    │
│            │  │ 🖼️ │ Electronic Night Vol. 3            │    │
│            │  │    │ 22 abr · Club XYZ                  │    │
│            │  │    │ 🟡 Borrador                         │    │
│            │  └──────────────────────────────────────────┘    │
│            │                                                  │
│            │  ── Empty state (if no events) ──              │
│            │  🎤 Crea tu primer evento                      │
│            │  y empieza a vender.                             │
│            │  [➕ Crear evento]                               │
│            │                                                  │
└───────────────────────────────────────────────────────────────┘
```

#### O-10: Event Sales Detail

```
┌───────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  ← Dashboard  ·  Noche de Indie Rock           │
│            │                                                  │
│            │  [Ventas]  [Check-in]  [Config]                 │ ← Tabs
│            │                                                  │
│            │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│            │  │ 156/200  │ │ $54,600  │ │ $48,100  │        │
│            │  │ Vendidos │ │ Bruto    │ │ Neto     │        │
│            │  └──────────┘ └──────────┘ └──────────┘        │
│            │                                                  │
│            │  📈 Ventas por día                              │
│            │  ┌──────────────────────────────────────┐        │
│            │  │         ╱──╲                          │        │
│            │  │    ╱───╱    ╲──╲                      │        │ ← Line chart
│            │  │ ──╱              ╲────                │        │
│            │  │ 01 abr          15 abr                │        │
│            │  └──────────────────────────────────────┘        │
│            │                                                  │
│            │  Métodos de pago                                │
│            │  💳 Tarjeta: 62%  🟣 MP: 23%  🏪 OXXO: 15%   │
│            │                                                  │
│            │  Compradores                    [📥 Exportar]   │
│            │  ┌─────────────────────────────────────────┐     │
│            │  │ Nombre    │ Email        │ Boleto │ ✓  │     │
│            │  │ Diego M.  │ d@mail.com   │ General│ ⬜ │     │
│            │  │ Ana R.    │ a@mail.com   │ General│ ✅ │     │
│            │  │ Carlos S. │ c@mail.com   │ General│ ⬜ │     │
│            │  └─────────────────────────────────────────┘     │
│            │                                                  │
└───────────────────────────────────────────────────────────────┘
```

---

### 3.7 Organiser — QR Check-In

> **Phase 2 ref:** § 3.8

#### O-11: Check-In Scanner

```
┌──────────────────────────────────────┐
│ ← Ventas    Check-in     47/200 ✅  │ ← Live counter
├──────────────────────────────────────┤
│                                      │
│  ┌──────────────────────────────┐    │
│  │                              │    │ ← Live camera feed
│  │                              │    │   full-bleed, dark bg
│  │    ┌──────────────────┐      │    │
│  │    │                  │      │    │ ← Scan frame
│  │    │   Apunta aquí    │      │    │   (rounded corners,
│  │    │                  │      │    │    white/purple border)
│  │    └──────────────────┘      │    │
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
│  📷 Apunta la cámara al código QR   │ ← Instruction text
│                                      │
│  ─────────────────────────          │
│  🔍 Buscar por nombre               │ ← Manual fallback
│     o número de confirmación        │
│                                      │
└──────────────────────────────────────┘
```

**Behaviour:** Camera launches automatically when Check-in mode opens. QR decode happens continuously (every 100ms frame). On successful decode, auto-transitions to O-12 (valid) or O-13 (invalid). No tap required.

#### O-12: Check-In — Valid Result

```
┌──────────────────────────────────────┐
│                                      │
│  ┌──────────────────────────────┐    │
│  │        (green flash)         │    │
│  │                              │    │
│  │    ✅ VÁLIDO                 │    │ ← Full-screen green
│  │                              │    │   (#00C896 at 90% opacity)
│  │    Diego Martínez            │    │   Auto-dismiss 1.5s
│  │    General Admission         │    │
│  │    Boleto 1 de 2             │    │
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
│  48/200 ✅                           │ ← Updated counter
│                                      │
│  (Auto-returns to scanner)          │
│                                      │
└──────────────────────────────────────┘
```

#### O-13: Check-In — Invalid Result

```
┌──────────────────────────────────────┐
│                                      │
│  ┌──────────────────────────────┐    │
│  │        (red flash)           │    │
│  │                              │    │
│  │    ❌ NO VÁLIDO              │    │ ← Full-screen red
│  │                              │    │   (#FF4444 at 90% opacity)
│  │    Ya escaneado              │    │ ← Reason text
│  │    Check-in: 21:15           │    │
│  │                              │    │
│  │    [Escanear otro →]         │    │ ← Manual dismiss
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
└──────────────────────────────────────┘
```

**Behaviour (all check-in screens):**
- Valid: auto-dismiss after 1.5s, returns to scanner.
- Invalid: requires manual tap to dismiss (staff needs to communicate with buyer).
- Haptic feedback on scan result (`navigator.vibrate()`).
- Counter updates in real-time.
- Full-screen colour ensures visibility in dark/loud venue conditions.

---

### 3.8 Organiser — Payouts

> **Phase 2 ref:** § 3.7

#### O-14: Payout Summary

```
┌───────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  Pagos                                          │
│            │                                                  │
│            │  Balance disponible                              │
│            │  $48,100 MXN                                     │ ← heading-lg
│            │                                                  │
│            │  ┌──────────────────────────────────────────┐    │
│            │  │ Noche de Indie Rock · 15 abr 2026       │    │
│            │  │                                          │    │
│            │  │ Ventas brutas:       $54,600 MXN         │    │
│            │  │ Cargo Boletify:      −$4,730 MXN         │    │
│            │  │ Procesamiento pago:  −$1,770 MXN         │    │
│            │  │ ────────────────────────            │    │
│            │  │ Pago neto:           $48,100 MXN         │    │
│            │  │                                          │    │
│            │  │ 📅 Fecha estimada: 18 abr 2026          │    │ ← T+3 target
│            │  │ 🏦 CLABE: ****1234                      │    │
│            │  │ Estado: ⏳ Programado                    │    │
│            │  └──────────────────────────────────────────┘    │
│            │                                                  │
│            │  Historial de pagos                              │
│            │  ┌──────────────────────────────────────────┐    │
│            │  │ Fecha     │ Evento    │ Monto    │ Estado│    │
│            │  │ 10 mar    │ Show ABC  │ $23,400  │ ✅    │    │
│            │  │ 15 feb    │ Show XYZ  │ $18,200  │ ✅    │    │
│            │  └──────────────────────────────────────────┘     │
│            │                                                  │
│            │  ── Empty state (no payouts yet) ──            │
│            │  Tus pagos aparecerán aquí cuando vendas        │
│            │  tus primeros boletos.                           │
│            │                                                  │
└───────────────────────────────────────────────────────────────┘
```

---

## 4. Interaction Patterns & Micro-interactions

### 4.1 Loading States

| Context | Pattern |
|---------|---------|
| **Page load** | Skeleton screens matching the page layout. Animated shimmer effect (left-to-right gradient pulse). Content fades in as it loads (`motion-slow`, 300ms). |
| **Event cards** | Skeleton: grey rounded rectangle (image) + 3 grey lines (text). Cards load staggered (50ms delay between each) for a cascade effect. |
| **Checkout payment processing** | Button shows spinner + "Procesando…" text. Disable all form fields. Subtle pulse animation on the button. |
| **QR scanner** | Camera feed loads with a brief "Iniciando cámara…" message and spinner. |
| **Data tables (dashboard)** | Skeleton rows with shimmer. Table structure (headers) loads immediately. |
| **Image upload** | Progress bar overlay on the upload zone. Spinner → preview thumbnail on complete. |

### 4.2 Form Interactions

| Pattern | Behaviour |
|---------|-----------|
| **Inline validation** | Validate on blur (not on every keystroke). Show ✅ or ❌ icon inline. Error message appears with a slide-down animation (`motion-fast`). |
| **Quantity stepper** | Tap +/− to increment/decrement. Long-press to auto-increment. Number updates with a subtle scale animation. Haptic feedback on mobile (if supported). |
| **Promo code** | Enter code → "Aplicar" button → loading spinner (500ms API call) → success (green text + discount applied to total with number animation) or error (red shake animation + message). |
| **Image upload** | Drag-and-drop zone highlights on dragover (purple dashed border + "Suelta aquí" text). Progress bar during upload. Preview with crop handles on completion. |
| **Rich text editor** | Floating toolbar (bold, italic, link, list) appears on text selection. Minimal chrome — content-first. |
| **Date/time pickers** | Native date/time inputs on mobile (for OS-level pickers). Custom calendar dropdown on desktop. |

### 4.3 Transitions

| Transition | Animation |
|-----------|-----------|
| **Page navigation** | Fade + slight slide (`motion-slow`, 300ms). No full-page reloads (SPA). |
| **Modal open** | Backdrop fades in (200ms), modal slides up from bottom on mobile, fades in centred on desktop. |
| **Toast notification** | Slides in from top-right (desktop) or drops from top (mobile). Fades out on dismiss. |
| **Tab switch** | Content crossfades (150ms). Active tab indicator slides horizontally. |
| **Checkout steps** | Slide left/right between steps. Progress dots fill with colour as you advance. |
| **Check-in result** | Full-screen colour flash (green/red) with icon scale-up (`motion-spring`, 400ms). Auto-dismiss with fade after 1.5s. |

### 4.4 Celebration Moments

| Moment | Animation |
|--------|-----------|
| **Ticket purchased** | Confetti particle effect (subtle, 2–3s). ✅ icon bounces in with spring easing. "¡Listo!" text types in letter-by-letter (200ms total). |
| **Event published** | 🎉 emoji animation. Shareable link highlights with a brief glow. |
| **First ticket sold** | Dashboard shows one-time celebratory banner: "🎉 ¡Se vendió tu primer boleto!" |

### 4.5 Empty States

| Context | Content |
|---------|---------|
| **No events (buyer discovery)** | Illustration + "No hay eventos próximos en tu zona. ¡Pronto habrá más!" |
| **No tickets (My Tickets)** | Illustration + "Aún no tienes boletos. Explora eventos cerca de ti." + CTA |
| **No events (organiser dashboard)** | Illustration + "Crea tu primer evento y empieza a vender." + prominent CTA |
| **No search results** | "No encontramos resultados para '[query]'. Intenta con otros términos." + "Explorar todos" link |
| **No payouts yet** | "Tus pagos aparecerán aquí cuando vendas tus primeros boletos." |

---

## 5. Responsive & Multi-Device Strategy

### 5.1 Approach: Mobile-First

All designs start at 320px (iPhone SE) and scale up. CSS is written mobile-first with `min-width` media queries.

### 5.2 Breakpoint Behaviour

| Component | Mobile (< 768px) | Tablet (768–1023px) | Desktop (≥ 1024px) |
|-----------|-------------------|---------------------|---------------------|
| **Event cards grid** | 1 column (full-width) | 2 columns | 3–4 columns |
| **Event detail** | Single column, stacked | Single column, wider | Two columns: details left, ticket selection right (sticky) |
| **Checkout** | Full-width, stacked | Centred card (max 480px) | Centred card (max 480px) |
| **Organiser dashboard** | Bottom tabs, full-width | Sidebar collapses to icons | Full sidebar (240px) + content |
| **QR ticket display** | Full screen | Full screen | Centred card (max 400px) |
| **Navigation (buyer)** | Compact header + hamburger | Full header + inline links | Full header + inline links |
| **Navigation (organiser)** | Bottom tab bar | Collapsed icon sidebar | Full sidebar |
| **Sales data table** | Horizontal scroll or card-stack | Full table | Full table |
| **Check-in scanner** | Full viewport camera | Full viewport camera | Centred (max 600px) |

### 5.3 Touch Targets

- **Minimum touch target:** 44×44px (Apple HIG / WCAG 2.1 AA).
- **CTA buttons:** Full-width on mobile, minimum 48px height.
- **Form inputs:** 44px minimum height (prevents iOS zoom on 16px font).
- **Card taps:** Entire card surface is tappable (generous hit area).
- **Close buttons:** 44×44px hit area even if icon is visually smaller.

### 5.4 Platform-Specific Considerations

| Feature | Implementation |
|---------|---------------|
| **PWA** | Service worker for offline asset caching (not offline-first for MVP). `manifest.json` for "Add to Home Screen." |
| **Native share** | `navigator.share()` API on mobile for native share sheet. Fallback: copy-link + social buttons on desktop. |
| **Camera access** | `getUserMedia()` for QR scanner. Graceful fallback if denied: "Permite acceso a la cámara para escanear boletos." |
| **Wake lock** | `navigator.wakeLock` on QR display screen to prevent screen timeout. |
| **Haptics** | `navigator.vibrate()` for QR scan success/failure feedback (Android). |
| **Safe areas** | CSS `env(safe-area-inset-*)` for notch/dynamic island/home indicator on iOS. |

---

## 6. Accessibility (a11y)

> **Target:** WCAG 2.1 Level AA compliance.  
> **Reference:** Phase 2 § 10.6.

### 6.1 Semantic HTML

- Use native HTML elements over ARIA where possible: `<button>`, `<nav>`, `<main>`, `<header>`, `<footer>`, `<dialog>`.
- Logical heading hierarchy: single `<h1>` per page, sequential `<h2>`–`<h6>`.
- Lists for navigation items (`<ul>` / `<li>` / `<nav>`).
- `<table>` with `<thead>`, `<th scope>` for data tables (buyer list, payout history).
- `<form>` with `<fieldset>` and `<legend>` for grouped form controls (payment method selection).

### 6.2 Keyboard Navigation

| Pattern | Keyboard Behaviour |
|---------|-------------------|
| **All interactive elements** | Reachable via Tab. Logical tab order (visual order = DOM order). |
| **Buttons** | Activated with Enter or Space. |
| **Modals** | Focus trapped inside modal. Escape closes. Focus returns to trigger element on close. |
| **Dropdowns** | Arrow keys navigate options. Enter selects. Escape closes. |
| **Quantity stepper** | Arrow Up/Down increments/decrements. Direct number input also accepted. |
| **QR carousel** | Arrow Left/Right navigates between tickets. |
| **Tabs (dashboard)** | Arrow keys move between tabs. Tab key moves to tab panel content. |
| **Checkout steps** | Keyboard can navigate between steps via visible back/forward buttons. |

### 6.3 Focus Management

- **Focus ring:** 2px solid `color-primary` with 2px offset. Visible on all interactive elements.
- **`:focus-visible`:** Focus ring only on keyboard navigation (not on mouse click).
- **Route changes (SPA):** Programmatically move focus to the `<h1>` of the new page. Announce route change to screen readers via `aria-live` region.
- **Modal open:** Focus moves to the first focusable element inside the modal (or the modal's close button).
- **Toast notification:** Announced via `aria-live="polite"` (info/success) or `aria-live="assertive"` (error).

### 6.4 Screen Reader Support

| Pattern | Implementation |
|---------|---------------|
| **Images** | Decorative → `alt=""` + `aria-hidden="true"`. Informative → descriptive `alt`. Event covers: `alt="Imagen de portada para [event name]"`. |
| **Icons** | Decorative → `aria-hidden="true"`. Interactive → `aria-label` on the parent button. |
| **Price display** | `aria-label="Precio: trescientos cincuenta pesos mexicanos"` (avoid reading "$350 MXN" as gibberish). |
| **QR code** | `alt="Código QR para tu boleto de [event name]"`. Supplemented with visible text details. |
| **Form errors** | Connected to input via `aria-describedby`. `aria-invalid="true"` on the field. |
| **Loading states** | `aria-busy="true"` on the loading container. `aria-live="polite"` announces when content loads. |
| **Check-in result** | `role="alert"` for immediate announcement of valid/invalid result. |
| **Progress indicators** | Checkout steps announced: `aria-label="Paso 1 de 2: Información"`. |

### 6.5 Colour & Contrast

- All text meets **4.5:1** minimum (normal text) or **3:1** (large text ≥ 24px / ≥ 18.66px bold).
- Information never conveyed by colour alone — always paired with icon, text, or pattern.
- Error states: red colour **+** ⚠ icon **+** text message.
- Success states: green colour **+** ✅ icon **+** text message.
- Links in body text: distinguished by underline (not just colour).
- Check-in valid/invalid: colour **+** icon **+** text label **+** audio/haptic feedback.

### 6.6 Motion

- All animations respect `prefers-reduced-motion: reduce`.
- Celebration animations (confetti, spring) disabled for reduced motion.
- Essential state changes (loading → loaded) use opacity only — no transforms.
- No auto-playing video or audio.

---

## 7. Error States & Edge Cases

### 7.1 Payment Errors

| Scenario | UI Treatment |
|----------|-------------|
| **Card declined** | Inline error below card fields: *"Tu tarjeta fue rechazada. Verifica los datos o intenta con otro método."* Payment method selector remains available. Cart preserved. |
| **Mercado Pago failure** | Return from MP with error → banner: *"Hubo un problema con Mercado Pago. Intenta de nuevo o elige otro método."* |
| **OXXO reference generation fails** | Inline error: *"No pudimos generar tu referencia OXXO. Intenta de nuevo."* |
| **OXXO reference expires (72h)** | Email: *"Tu ventana de pago expiró. Los boletos fueron liberados."* My Tickets shows order as "Expirado" (grey). |
| **Duplicate charge (race condition)** | Detected via idempotency key → auto-refund. Email: *"Detectamos un cargo duplicado. Ya procesamos tu reembolso."* |
| **Network error mid-payment** | Retry prompt: *"Se perdió la conexión. Tus datos están seguros. [Reintentar]"*. Idempotency key prevents double charge. |

### 7.2 Inventory / Availability

| Scenario | UI Treatment |
|----------|-------------|
| **Event sells out during browse** | "Obtener Boletos" CTA changes to "Agotado" (disabled, `neutral-300`). Stepper hidden. |
| **Sells out during checkout** | Before payment: redirect to event page with banner: *"Lo sentimos, los boletos se agotaron mientras completabas tu compra."* After payment (rare): auto-refund + email apology. |
| **Tier sells out, others available** | Sold-out tier shows "Agotado" badge; other tiers remain selectable. |
| **OXXO hold active, inventory low** | *"Últimos boletos — ¡no te quedes sin el tuyo!"* urgency text. Don't show exact remaining count (prevents gaming). |

### 7.3 Event Issues

| Scenario | UI Treatment |
|----------|-------------|
| **Event cancelled** | Buyer email: *"El evento [name] ha sido cancelado. Tu reembolso de $X MXN se procesará automáticamente en 3–5 días hábiles."* My Tickets: "Cancelado — reembolso en proceso." Note: card refunds typically 3–5 business days (processor-dependent); OXXO refunds via bank transfer may take 5–7 business days. |
| **Event date changed** | Buyer email: *"El organizador cambió la fecha de [name]. Nueva fecha: [date]."* |
| **Past event accessed** | Event page shows "Este evento ya finalizó" banner. Purchase disabled. Excluded from discovery feed. |
| **Organiser suspended** | Organiser's events hidden. Existing ticket holders: *"Este evento está temporalmente suspendido. Te contactaremos."* |

### 7.4 Authentication & Account

| Scenario | UI Treatment |
|----------|-------------|
| **Wrong password** | Inline: *"Contraseña incorrecta. [¿Olvidaste tu contraseña?]"* After 5 failures: 15-min lockout + email notification. |
| **Magic link expired** | Landing page: *"Este enlace ha expirado. [Enviar nuevo enlace]."* |
| **Account exists (OAuth)** | *"Ya existe una cuenta con este correo. Inicia sesión con tu contraseña o [enviar enlace mágico]."* |
| **Session expired during checkout** | Cart preserved in `localStorage`. Login prompt: *"Tu sesión expiró. Inicia sesión para continuar con tu compra."* |

### 7.5 Technical Errors

| Scenario | UI Treatment |
|----------|-------------|
| **500 / Server error** | Full-page: Illustration + *"Algo salió mal de nuestro lado. Estamos trabajando en ello."* + "Reintentar" + "Ir al inicio". |
| **404 / Not found** | *"Esta página no existe. Quizás el enlace está mal o el evento fue removido."* + "Explorar eventos" CTA. |
| **No internet** | Sticky banner at top: *"Sin conexión a internet."* (Detected via `navigator.onLine` + fetch heartbeat.) |
| **Camera denied (scanner)** | *"Necesitamos acceso a tu cámara para escanear boletos. [Permitir acceso]"* + manual search fallback. |
| **Slow connection** | After 5s loading: *"Esto está tardando más de lo usual. Tu conexión podría ser lenta."* |

---

## 8. Open Questions

> Decisions needing input from Product (Phase 2), Engineering (Phase 4), or founders.

- [ ] **All-in vs. broken-out pricing display:** Closed for event cards: show `desde $350 MXN` (base price only) on cards; break out fees clearly at the ticket selection step and again at checkout. This is the honest middle ground — no sticker shock on discovery, no hidden surprise at payment. **This decision will be validated via user research Sprint 2 (Phase 2 §13.3 — buyer usability test).** If ≥5/8 users are confused by fee breakdown, switch to all-in pricing sitewide.
- [x] **Dark mode toggle for buyers?** Deferred. MVP ships dark-only for buyer pages. *Design decision 2026-04-10.*
- [ ] **Logo / wordmark:** App-icon-first design confirmed (rounded square, single recognisable glyph, strong at small sizes). Wordmark as secondary. **Boletify logo created** (`boletify_logo.png`) — redo pending with correct brand colours (`#7B2FF7` purple, `#FF3B5C` coral). Placeholder text wordmark used in wireframes until final logo is approved. *In progress 2026-04-10.*
- [x] **Tagline selection:** Deferred. No tagline for MVP. Revisit post-launch. *Founder decision 2026-04-03.*
- [x] **Colour palette:** Purple-coral gradient palette (§ 1.2) confirmed as final for MVP. *Founder decision 2026-04-03.*
- [x] **Illustration style:** Use **unDraw** with brand colours (purple-coral palette) for empty states, error pages, and onboarding screens. Commission custom illustrations post-launch. *Founder decision 2026-04-04.*
- [x] **Email template design:** Key content blocks and layouts defined in Appendix B (E-01 through E-06). Detailed HTML implementation deferred to Phase 4. *Design decision 2026-04-10.*
- [x] **QR code branding:** **Yes** — embed Boletify logo in QR centre. Use error correction level H (30% redundancy) to compensate for reduced capacity. *Founder decision 2026-04-04.*

---

## 9. Figma Artifact Map

> Maps every design artifact to a Figma page/frame. The Figma file is the visual source of truth; this document is the spec.
> **Live Figma file:** [Boletify — Design System & Screens](https://www.figma.com/design/p0C0ZYhxuDOX0XsWklEUT9/Boletify-%E2%80%94-Design-System---Screens?node-id=0-1&p=f&t=ijrRI730FPeFfnZp-0)

### 9.1 Figma File Structure

```
📁 Boletify — Design System & Screens
│
├── 📄 Cover
│   └── Project name, version, last updated, team
│
├── 📄 🎨 Design System
│   ├── Colour Palette (primitives + semantic tokens)
│   ├── Typography Scale (all tokens with specimens)
│   ├── Spacing & Grid (visual grid overlays)
│   ├── Border Radius & Elevation
│   ├── Iconography (Lucide samples with sizing)
│   └── Brand Gradient (swatches + usage examples)
│
├── 📄 🧩 Components
│   ├── Buttons (all variants × sizes × states)
│   ├── Input Fields (all variants × states × dark/light)
│   ├── Event Card (default, hover, sold-out, free)
│   ├── Ticket Card (upcoming, past, pending-OXXO)
│   ├── Navigation — Buyer (mobile header + menu, desktop header)
│   ├── Navigation — Organiser (sidebar desktop, bottom tabs mobile)
│   ├── Tags & Badges (genre, status, tier)
│   ├── Modals & Overlays
│   ├── Toast Notifications (success, error, warning, info)
│   ├── Skeleton Loaders (event card, page, table)
│   └── Empty States (with illustration placeholders)
│
├── 📄 📱 Buyer Flows
│   ├── B-01: Homepage / Discovery Feed
│   ├── B-02: Search Overlay
│   ├── B-03: Event Detail Page
│   ├── B-04: Checkout — Account/Guest
│   ├── B-05: Checkout — Payment
│   ├── B-06: Confirmation (Card/MP — with QR)
│   ├── B-07: Confirmation (OXXO Pending)
│   ├── B-08: My Tickets
│   ├── B-09: Full-Screen QR Display
│   ├── B-10: Login / Registration
│   ├── B-11: Error Pages (404, 500, Offline)
│   └── [Prototype flow connections]
│
├── 📄 💼 Organiser Flows
│   ├── O-01: Organiser Sign Up
│   ├── O-02: Profile Setup
│   ├── O-03: Payout Setup
│   ├── O-04: Create Event — Details (Step 1)
│   ├── O-05: Create Event — Tickets (Step 2)
│   ├── O-06: Create Event — Promo Codes (Step 3)
│   ├── O-07: Create Event — Preview & Publish (Step 4)
│   ├── O-08: Post-Publish Share
│   ├── O-09: Dashboard Home
│   ├── O-10: Event Sales Detail
│   ├── O-11: Check-In Scanner
│   ├── O-12: Check-In — Valid Result
│   ├── O-13: Check-In — Invalid Result
│   ├── O-14: Payout Summary
│   └── [Prototype flow connections]
│
└── 📄 📧 Email Templates (wireframe)
    ├── E-01: Order Confirmation (with QR)
    ├── E-02: OXXO Payment Reference
    ├── E-03: OXXO Payment Confirmed (with QR)
    ├── E-04: OXXO Expiry Notice
    ├── E-05: Event Reminder (24h before)
    └── E-06: Organiser Payout Notification
```

### 9.2 Figma Prototype Flows

| Flow Name | Screens (in order) | Entry Trigger |
|-----------|-------------------|---------------|
| **Buyer — Browse & Purchase (Card)** | B-01 → B-03 → B-04 → B-05 → B-06 | "Obtener Boletos" CTA |
| **Buyer — Purchase (OXXO)** | B-03 → B-04 → B-05 (OXXO) → B-07 | "Generar referencia OXXO" |
| **Buyer — View Tickets** | B-08 → B-09 | "Ver boletos" on ticket card |
| **Organiser — Onboarding** | O-01 → O-02 → O-03 → O-09 | "Crear cuenta" |
| **Organiser — Create Event** | O-09 → O-04 → O-05 → O-06 → O-07 → O-08 | "Crear Evento" |
| **Organiser — Check-In** | O-10 (Check-in tab) → O-11 → O-12 / O-13 | "Iniciar Check-in" |
| **Organiser — View Payouts** | O-09 → O-14 | Sidebar "Pagos" |

### 9.3 Figma Plugins & Tooling

| Plugin/Tool | Purpose |
|-------------|---------|
| **Figma Tokens Studio** | Export design tokens as JSON for engineering consumption. Keeps Figma ↔ code in sync. |
| **Figma Dev Mode** | Engineering inspects specs directly. CSS/token values available in-context. |
| **Autoflow** | Visualise flow connections between frames for prototype documentation. |
| **A11y — Color Contrast** | Validate contrast ratios directly in Figma during design. |
| **Content Reel** | Populate realistic Spanish-language content into mockups. |
| **Unsplash (Figma plugin)** | Source real concert/venue photography for mockups. |

---

## Appendix A: Design Decisions Log

| # | Decision | Rationale | Upstream Ref | Date |
|---|----------|-----------|-------------|------|
| D-01 | Dark mode for buyer-facing, light for organiser dashboard | Buyer = nightlife energy, images pop on dark. Organiser = data-heavy SaaS, light is readable. | Phase 2 § 6.5 | 2026-04-02 |
| D-02 | Inter as sole typeface | Excellent Spanish support, variable font (performance), open-source, tabular figures for prices/stats. | Phase 2 § 6.5 | 2026-04-02 |
| D-03 | Lucide for icons | Open-source, consistent 2px stroke, tree-shakeable, 1400+ icons, framework packages. | — | 2026-04-02 |
| D-04 | Purple-to-coral gradient as brand signature | Captures nightlife energy. Differentiates from Boletia (blue), Eventbrite (orange), Ticketmaster (blue). Both endpoints pass WCAG AA with white text. | Phase 2 § 6.5 | 2026-04-02 |
| D-05 | Skeleton screens over spinners | Better perceived performance, less CLS, modern pattern. Aligns with LCP < 2.0s target. | Phase 2 § 10.1 | 2026-04-02 |
| D-06 | Sticky bottom CTA on mobile event page | "Obtener Boletos" always reachable. Prevents loss after scrolling through long descriptions/lineups. | Phase 2 § 3.2 | 2026-04-02 |
| D-07 | Full-screen colour flash for check-in | Door staff need instant, unambiguous feedback in dark/loud venue conditions. Green/red fills are visible from several metres away. | Phase 2 § 3.8 | 2026-04-02 |
| D-08 | No native app — PWA-quality responsive web | 2-person team, 3-month timeline. PWA covers 95% of use cases. Native deferred per Phase 2 § 4.4. | Phase 2 § 4.4 | 2026-04-02 |
| D-09 | 4px base spacing unit | Industry standard (Figma, Material, Tailwind). Ensures consistent rhythm at all scales. | — | 2026-04-02 |
| D-10 | 16px minimum input font size | Prevents iOS Safari auto-zoom on input focus. Critical for mobile-first checkout experience. | Phase 2 § 10.4 | 2026-04-02 |
| D-11 | Fee shown at ticket selection, broken out — not all-in on event cards | Event cards show `desde $350 MXN` to avoid sticker shock. Fee broken out clearly at selection step and checkout. Honest without hiding anything. Decision to be validated in User Research Sprint 2. | Phase 2 §11, §13.3 | 2026-04-10 |
| D-12 | Motion token system defined (§1.7) | `motion-fast/slow/spring` referenced in §4 interactions but never formally defined. Adds §1.7 as the canonical source. Ensures consistency across animation implementations. | §4 | 2026-04-10 |
| D-13 | Payout date in email/dashboard targets T+3 | Aligns with Phase 2 competitive commitment (Boletia is T+7-10). Dashboard and payout email show `T+3 business days` as expected date. | Phase 2 §3.7 | 2026-04-10 |
| D-14 | O-11 scanner wireframe fixed | O-11 was showing the valid result screen (same as O-12) due to copy-paste error. Fixed to show camera feed with scan frame, instruction text, and manual fallback. | §3.7 | 2026-04-10 |

---

## Appendix B: Email Template Wireframes

> Detailed layouts deferred to Phase 4 implementation. Key content blocks defined here for design consistency.

### E-01: Order Confirmation Email

```
┌──────────────────────────────────────┐
│  [Boletify Logo]                     │
│                                      │
│  ¡Listo! Tienes tus boletos 🎉     │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Noche de Indie Rock            │  │
│  │ 📅 Sáb, 15 abr 2026 · 21:00  │  │
│  │ 📍 Foro Indie, Roma Norte     │  │
│  │ 🎫 2× General Admission       │  │
│  │ 💰 $650 MXN                   │  │
│  └────────────────────────────────┘  │
│                                      │
│  [QR Code 1]    [QR Code 2]         │
│   Boleto 1       Boleto 2           │
│                                      │
│  [📲 Ver Mis Boletos]              │
│                                      │
│  ¿Necesitas ayuda? Escríbenos a     │
│  ayuda@boletify.com                  │
│                                      │
│  ─────────────────────────────      │
│  Boletify · boletify.com            │
│  Aviso de Privacidad · Términos     │
└──────────────────────────────────────┘
```

### E-02: OXXO Payment Reference Email

```
┌──────────────────────────────────────┐
│  [Boletify Logo]                     │
│                                      │
│  Paga en OXXO para confirmar        │
│  tus boletos 🏪                     │
│                                      │
│  Evento: Noche de Indie Rock         │
│  Total: $650 MXN                     │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  Referencia:                   │  │
│  │  ||||||||||||||||||||||||||||  │  │
│  │  1234 5678 9012 3456          │  │
│  │                                │  │
│  │  Monto: $650 MXN              │  │
│  │  Vence: 18 abr 2026, 14:30   │  │
│  └────────────────────────────────┘  │
│                                      │
│  Instrucciones:                      │
│  1. Ve a cualquier tienda OXXO      │
│  2. Dile al cajero que quieres      │
│     hacer un pago de servicio       │
│  3. Muestra esta referencia         │
│  4. Paga $650 MXN en efectivo       │
│  5. Guarda tu comprobante           │
│                                      │
│  ⚠️ Si no pagas en 72 horas, tus   │
│  boletos serán liberados.           │
│                                      │
│  ─────────────────────────────      │
│  Boletify · boletify.com            │
└──────────────────────────────────────┘
```

### E-03: OXXO Payment Confirmed Email

```
┌──────────────────────────────────────┐
│  [Boletify Logo]                     │
│                                      │
│  ✅ ¡Pago confirmado! Aquí están    │
│  tus boletos.                        │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Noche de Indie Rock            │  │
│  │ 📅 Sáb, 15 abr 2026 · 21:00  │  │
│  │ 📍 Foro Indie, Roma Norte     │  │
│  │ 🎫 2× General Admission       │  │
│  │ 💰 $650 MXN                   │  │
│  └────────────────────────────────┘  │
│                                      │
│  [QR Code 1]    [QR Code 2]         │
│   Boleto 1       Boleto 2           │
│                                      │
│  [📲 Ver Mis Boletos]              │
│                                      │
│  ─────────────────────────────      │
│  Boletify · boletify.com            │
└──────────────────────────────────────┘
```

**Notes:** Triggered by OXXO payment webhook. Identical in structure to E-01 — same template, different headline. Sent within minutes of OXXO confirmation.

### E-04: OXXO Expiry Notice

```
┌──────────────────────────────────────┐
│  [Boletify Logo]                     │
│                                      │
│  Tu ventana de pago expiró          │
│                                      │
│  No recibimos tu pago para:          │
│  Noche de Indie Rock                 │
│  Referencia: 1234 5678 9012 3456    │
│                                      │
│  Tus boletos fueron liberados y       │
│  están disponibles nuevamente        │
│  para otros compradores.             │
│                                      │
│  ¿Todavía quieres ir?               │
│  [Ver boletos disponibles →]        │ ← CTA to event page
│                                      │
│  ─────────────────────────────      │
│  Boletify · boletify.com            │
└──────────────────────────────────────┘
```

**Notes:** Sent automatically when OXXO hold expires after 72h. Tone: informative, not guilt-tripping. Includes CTA to re-purchase if tickets still available.

### E-05: Event Reminder Email (24h before)

```
┌──────────────────────────────────────┐
│  [Boletify Logo]                     │
│                                      │
│  ¡Mañana es el día! 🎶             │
│                                      │
│  Noche de Indie Rock                 │
│  📅 Sáb, 15 abr 2026 · 21:00       │
│  📍 Foro Indie, Roma Norte, CDMX    │
│                                      │
│  📍 Cómo llegar: [Ver en Maps]      │
│                                      │
│  Tu(s) boleto(s):                    │
│  [📲 Ver Mis Boletos]              │
│                                      │
│  Tip: Ten tu código QR listo en      │
│  tu teléfono para entrar rápido.    │
│                                      │
│  ¡Disfruta el show! 🤘              │
│                                      │
│  ─────────────────────────────      │
│  Boletify · boletify.com            │
└──────────────────────────────────────┘
```

### E-06: Organiser Payout Notification

```
┌──────────────────────────────────────┐
│  [Boletify Logo]                     │
│                                      │
│  Tu pago está en camino 💸          │
│                                      │
│  Procesamos tu pago de:              │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Noche de Indie Rock            │  │
│  │ 15 abr 2026                    │  │
│  │                                │  │
│  │ Ventas brutas:    $54,600 MXN  │  │
│  │ Cargo Boletify:  −$4,730 MXN   │  │
│  │ Procesamiento:   −$1,770 MXN   │  │
│  │ ─────────────────────────      │  │
│  │ Pago neto:       $48,100 MXN   │  │
│  │                                │  │
│  │ CLABE destino: ****1234        │  │
│  │ Fecha estimada: 18 abr 2026    │  │ ← T+3
│  └────────────────────────────────┘  │
│                                      │
│  [Ver detalle en tu panel →]        │
│                                      │
│  ¿Preguntas sobre tu pago?           │
│  ayuda@boletify.com                  │
│                                      │
│  ─────────────────────────────      │
│  Boletify · boletify.com            │
└──────────────────────────────────────┘
```

**Notes:** Tone is peer-to-peer, celebratory but precise. Shows full fee breakdown (never hide the math — brand value: transparencia radical). Payout date uses T+3 target. Sent when payout is initiated, not when it arrives (bank transfer timing is processor-dependent).
