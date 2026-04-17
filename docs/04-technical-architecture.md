# Phase 4 — Technical Architecture

> **Status:** 🟡 In Progress  
> **Owner Hat:** CTO / Architect  
> **Upstream Input:** [Phase 2 — Product Design](02-product-design.md), [Phase 3 — UX & Design](03-ux-design.md)  
> **Downstream Consumer:** Development (code in `apps/` + `packages/`)  
> **Last updated:** 2026-04-11 — mobile app added, cross-platform shared-core architecture live; Phase 5 refactor complete

---

## Purpose

Review all upstream specs for technical feasibility, design the system architecture, choose infrastructure, and define how the first product ships from this repo. This document is the engineering contract.

---

## Table of Contents

1. [Feasibility Review](#1-feasibility-review)
2. [Tech Stack](#2-tech-stack)
3. [System Design](#3-system-design)
4. [Data Model](#4-data-model)
5. [API Design](#5-api-design)
6. [Infrastructure & DevOps](#6-infrastructure--devops)
7. [Authentication & Authorisation](#7-authentication--authorisation)
8. [Payments Integration](#8-payments-integration)
9. [Security & Compliance](#9-security--compliance)
10. [First Product Architecture](#10-first-product-architecture)
11. [Product Roadmap — Technical View](#11-product-roadmap--technical-view)
12. [Architecture Decision Records (ADRs)](#12-architecture-decision-records-adrs)
13. [Open Questions](#13-open-questions)

---

## 1. Feasibility Review

> Walk through Phase 2 MVP scope and Phase 3 UX spec. Flag technical risks, R&D spikes, or scope adjustments.

### 1.1 MVP Features — Feasibility Assessment

| Feature | Phase 2 Ref | Feasibility | Notes |
|---------|-------------|-------------|-------|
| **SSR event pages (SEO)** | B1, § 10.7 | ✅ Straightforward | Next.js App Router with `generateMetadata` + JSON-LD. Core strength of the framework. |
| **Card payment (Stripe Elements)** | B5 | ✅ Straightforward | Stripe.js + hosted fields. PCI SAQ-A. Well-documented. |
| **OXXO async payment** | B6, P2 | ✅ Feasible, moderate | Stripe supports OXXO natively via `PaymentIntent`. Webhook for confirmation. Cron for 72h expiry. Requires careful inventory hold logic. |
| **Mercado Pago payment** | B7 | ✅ Feasible, moderate | MP Checkout Pro SDK. Redirect-based flow. Separate webhook listener. Two payment providers adds integration surface. |
| **QR code generation** | B8, § 8.2 | ✅ Straightforward | `qrcode` npm package. HMAC-signed tokens. Server-side PNG generation. |
| **Browser-based QR scanner** | O10 | ⚠️ Feasible with caveats | `html5-qrcode` library works on iOS Safari 15+ and Chrome Android 100+. **Risk:** Low-light venues may need flashlight toggle (camera torch API). **Risk:** Camera permission UX varies by browser. Need manual check-in fallback (already spec'd in Phase 3 § O-11). |
| **Real-time sales dashboard** | O8 | ✅ Feasible | Polling every 30s is sufficient for MVP. SSE or WebSockets deferred. The data volumes (max 50 purchases/min) don't justify real-time infra. |
| **Guest checkout** | B3 | ✅ Straightforward | Session-based cart + email-only order. No account required. |
| **Promo codes** | O6, § 9 | ✅ Straightforward | Flat or percentage discount, max uses, expiry. Server-side validation. Standard CRUD. |
| **Rich text event description** | O3 | ✅ Straightforward | Tiptap editor (headless, React, free). Store as HTML or JSON. Render server-side for SEO. |
| **Image upload + crop** | O3 | ✅ Feasible | Client-side crop (`react-cropper` or similar), upload to Vercel Blob / Cloudflare R2. Max 5 MB, JPG/PNG/WebP. |
| **Transactional emails** | C1–C6 | ✅ Straightforward | Resend + React Email. 6 templates defined in Phase 3 § Appendix B. Free tier: 3K/mo. |
| **Organiser payout / settlement** | O11, P3 | ✅ Feasible, moderate | Stripe Connect Express accounts. `application_fee_amount` on each payment. Automatic payouts to organiser's CLABE. KYC handled by Stripe. |
| **Mobile-responsive (PWA)** | B11 | ✅ Straightforward | Tailwind CSS + mobile-first breakpoints. `manifest.json` + basic service worker. |
| **WakeLock API (QR display)** | Phase 3 § B-09 | ⚠️ Partial support | Supported on Chrome, Safari (iOS 16.4+), Edge. Not on Firefox desktop. Acceptable since QR display is a mobile use case. Graceful degradation. |
| **navigator.share()** | Phase 3 § 5.4 | ⚠️ Partial support | Mobile Safari + Chrome Android. Not desktop Firefox/Chrome. Fallback to copy-link + social buttons (already spec'd). |

### 1.2 Post-MVP Feasibility Flags

| Feature | Phase | Risk Level | Notes |
|---------|-------|------------|-------|
| **Reserved seating (seat map)** | C (v1.2+) | 🔴 High effort | Interactive SVG/Canvas seat map editor + buyer picker. Recommend a separate `@boletify/seatmap` package. May consider a third-party library (e.g., `seatsio`). Spike needed at month 6. |
| **Apple/Google Wallet passes** | B (v1.1) | 🟡 Moderate | Requires generating `.pkpass` (Apple) and JWT-based passes (Google). Libraries exist (`passkit-generator`, `google-auth-library`). 1–2 week effort. |
| **BNPL (Kueski/Mercado Crédito)** | C | 🟡 Moderate | Third payment provider integration. API maturity varies. Evaluate at month 7. |
| **Offline check-in** | Deferred | 🔴 High effort | Requires local IndexedDB cache + service worker + sync protocol. Not MVP. |
| **Public organiser API** | C | 🟡 Moderate | tRPC procedures can be exposed via `trpc-openapi` to auto-generate REST endpoints. Design for this from day 1 by keeping procedures well-structured. |

---

## 2. Tech Stack

> **Constraints:** TypeScript end-to-end. React for frontend. Zero capital (free tiers only). 2-person team. Ship in 3 months.

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Language** | TypeScript 5.x | Project constraint. Strict mode enabled. |
| **Frontend (Web)** | **Next.js 15 (App Router)** | SSR/SSG for SEO event pages (Phase 2 § 10.7). React (founder constraint). API routes (no separate server). Image optimisation. Middleware for auth. Vercel-native. See [ADR-001](#adr-001-nextjs-app-router-over-remix--vite). |
| **Frontend (Mobile)** | **React Native 0.81 + Expo SDK 54 (Expo Router)** | Cross-platform native buyer + organiser app. File-based routing via Expo Router. Shares screen logic and design system with web. See [ADR-009](#adr-009-react-native-expo-for-mobile). |
| **Styling (Web)** | **Tailwind CSS 3.x** | Maps 1:1 to Phase 3 design tokens (colours, spacing, typography). Utility-first. `class` strategy for dark/light mode. Built-in responsive breakpoints matching Phase 3 § 1.4. See [ADR-008](#adr-008-tailwind-css-for-styling). |
| **Styling (Mobile)** | **NativeWind 4** | Tailwind CSS compiled to React Native StyleSheet at build time. Shared class names across web and native. Same design tokens. |
| **Component library** | **@boletify/design-system** (cross-platform primitives) + **Radix UI** (web-only) | Shared primitives (Button, Text, View, Stack, Screen, TextInput, Image, ScrollView, Pressable) with platform-specific renderers (`*.web.tsx` / `*.native.tsx`). Radix used for web-only accessible overlays (modals, dropdowns, tabs, toasts). |
| **Backend / API** | **tRPC v11** | End-to-end type safety with zero codegen. Natural pairing with Next.js App Router. See [ADR-002](#adr-002-trpc-over-rest-for-internal-api). |
| **Database** | **PostgreSQL on Neon** (serverless) | Relational data essential for event→ticket→order→payment graph. ACID transactions for inventory holds. Neon free tier: 0.5 GB storage, auto-suspend, branch-per-PR. See [ADR-004](#adr-004-neon-postgres-over-supabase--planetscale). |
| **ORM** | **Drizzle ORM** | 5× smaller serverless bundle than Prisma. SQL-like query builder. Schema-as-code. See [ADR-003](#adr-003-drizzle-over-prisma). |
| **Validation** | **Zod** | Runtime schema validation. Shared between tRPC inputs, form validation, and Drizzle schema inference. Single source of truth for types. |
| **Auth** | **Auth.js v5 (NextAuth)** | Free. Google OAuth + email/password + magic links. Database sessions via Drizzle adapter. Role-based access. See [ADR-006](#adr-006-authjs-over-clerk). |
| **Payments** | **Stripe Mexico** (primary) + **Mercado Pago SDK** | Stripe: cards + OXXO + Connect for payouts + KYC. MP: wallet/balance payments. See [ADR-005](#adr-005-stripe--mercado-pago-over-conekta-only). |
| **Email** | **Resend** + **React Email** | Free tier 3K/mo. JSX email templates. Branded HTML matching Phase 3 § Appendix B. |
| **File storage** | **Vercel Blob** | Event cover images. Free tier included with Vercel Pro. Simple API, CDN-backed. |
| **QR generation** | `qrcode` (npm) | Server-side PNG/SVG generation. HMAC-signed tokens per Phase 2 § 8.2. |
| **QR scanning** | `html5-qrcode` | Browser-based camera scanner. No native app required. Phase 3 § O-11. |
| **Rich text editor** | **Tiptap** | Headless, React-native, extensible. Event descriptions (Phase 2 § O3). |
| **Hosting (Web)** | **Vercel** | Free hobby tier → $20/mo Pro. Zero DevOps. Auto-scaling. Preview deploys. CDN. Native Next.js support. See [ADR-007](#adr-007-single-nextjs-app-with-route-groups). |
| **Hosting (Mobile)** | **Expo Application Services (EAS)** | Cloud builds for iOS/Android. OTA updates. Submission to App Store / Google Play. |
| **Monorepo** | **Turborepo 2.x** + **pnpm 9 workspaces** | Simple config, Vercel-native build caching. Workspace paths: `apps/*`, `packages/*`, `packages/config/*`. See [§ 10](#10-first-product-architecture). |
| **CI/CD** | **GitHub Actions** | Lint, type-check, test, preview deploy on PR. Production deploy on `main` merge. |
| **Error tracking** | **Sentry** (free tier) | 5K errors/mo. Source maps. Next.js integration. |
| **Product analytics** | **PostHog** (free tier) | 1M events/mo. Funnels matching Phase 2 § 7.4. Self-hostable later. |
| **Bot protection** | **Cloudflare Turnstile** (free) | Checkout CAPTCHA. Invisible by default, challenge on suspicious behaviour. Phase 2 § 8.2. |
| **Cron jobs** | **Vercel Cron** | OXXO 72h expiry cleanup. Event reminder emails (24h before). Included in Vercel Pro. |
| **Search (MVP)** | **PostgreSQL full-text search** | `tsvector` + `tsquery` on event name, description, venue. Sufficient for hundreds of events. |
| **Search (future)** | **Meilisearch** (Phase B) | Typo-tolerant, faceted search for discovery feed. Self-hostable. Swap in when event volume justifies it. |
| **i18n** | **`next-intl`** | App Router compatible. ICU message syntax for plurals/currencies. es-MX at launch; en shortly after MVP. All strings externalised. |

---

## 3. System Design

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                     │
│  📱 Expo Mobile App     📱 Mobile Browser    💻 Desktop Browser        │
│  buyer + organiser       buyer                org + admin + buyer        │
└──────┬──────────────────────┬─────────────────────┬─────────────────────┘
       │ HTTPS (tRPC)         │ HTTPS               │ HTTPS
       │ (Bearer token auth)   │ (Cookie sessions)   │ (Cookie sessions)
       │                      ┴──────────┬──────────┘
       │         ┌───────────────┴────────────────────────────────────┐
       │         │                VERCEL EDGE NETWORK                    │
       │         │  CDN (static assets, images)  │  Edge Middleware     │
       │         └───────────────┬────────────────────────────────────┘
       │                         │
       └────────────┐            │
                    ┴────────────┘
                    │
┌─────────────────┴───────────────────────────────────────────────────────┐
│                      NEXT.JS APPLICATION (apps/web)                      │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐          │
│  │  SSR Pages   │  │  tRPC API    │  │  Webhook Routes       │          │
│  │  /events/*   │  │  /api/trpc/* │  │  /api/webhooks/stripe │          │
│  │  /org/*      │  │  ◄── both    │  │  /api/webhooks/mp     │          │
│  │  /admin/*    │  │  web & mobile│  │  /api/auth/*          │          │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬────────────┘          │
│         │                 │                      │                       │
│         └────────┬────────┴──────────────────────┘                       │
│                  ┴────────────────┘                                        │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │     @boletify/api (tRPC routers) → @boletify/db (Drizzle ORM)   │    │
│  └──────────────────────────────┬───────────────────────────────┘    │
│                                 │                                        │
└─────────────────────────────────┴───────────────────────────────────────┘
                                  │
                                  ▼
                 ┌────────────────────────────────┐
                 │   Neon PostgreSQL (Serverless)  │
                 │   Primary: us-east-1           │
                 └────────────────────────────────┘

        EXTERNAL SERVICES
        ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
        │   Stripe     │  │ Mercado Pago │  │   Resend     │
        │  (payments)  │  │  (payments)  │  │   (email)    │
        └──────────────┘  └──────────────┘  └──────────────┘
        ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
        │ Vercel Blob  │  │   Sentry     │  │   PostHog    │
        │  (images)    │  │  (errors)    │  │ (analytics)  │
        └──────────────┘  └──────────────┘  └──────────────┘
```

> **Note:** The Expo mobile app calls the same tRPC API hosted by the Next.js app at `boletify.com`. It does **not** run its own backend. Auth on mobile uses Bearer token sessions via `@boletify/auth` instead of cookie sessions (which are web-only).

### 3.2 Application Boundaries (Route Groups)

The single Next.js app serves three audiences via **route groups**:

```
app/
├── (buyer)/                    # Dark mode, public + authenticated
│   ├── page.tsx                # Homepage / discovery feed (B-01)
│   ├── events/
│   │   └── [slug]/page.tsx     # Event detail (B-03) — SSR + SEO
│   ├── checkout/
│   │   └── [eventId]/page.tsx  # Checkout flow (B-04, B-05, B-06, B-07)
│   ├── my-tickets/
│   │   ├── page.tsx            # My Tickets list (B-08)
│   │   └── [ticketId]/page.tsx # Full-screen QR (B-09)
│   └── layout.tsx              # Dark theme wrapper
│
├── (organiser)/org/            # Light mode, authenticated (organiser role)
│   ├── dashboard/page.tsx      # Dashboard home (O-09)
│   ├── events/
│   │   ├── new/page.tsx        # Create event wizard (O-04–O-07)
│   │   └── [eventId]/page.tsx  # Event detail — sales, check-in, config (O-10)
│   ├── payouts/page.tsx        # Payout summary (O-14)
│   ├── profile/page.tsx        # Profile + payout setup (O-02, O-03)
│   └── layout.tsx              # Light theme wrapper + sidebar
│
├── (admin)/admin/              # Light mode, authenticated (admin role)
│   ├── dashboard/page.tsx      # Platform metrics (A3)
│   ├── events/page.tsx         # Event moderation queue (A2)
│   ├── organisers/page.tsx     # Organiser management (A1)
│   └── layout.tsx              # Admin layout
│
├── (auth)/auth/                # Auth pages (both themes)
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── magic-link/page.tsx
│
├── api/
│   ├── trpc/[trpc]/route.ts   # tRPC handler
│   ├── webhooks/
│   │   ├── stripe/route.ts    # Stripe webhooks
│   │   └── mercadopago/route.ts # MP webhooks
│   └── cron/
│       ├── oxxo-expiry/route.ts  # OXXO 72h cleanup
│       └── event-reminders/route.ts # 24h reminder emails
│
└── layout.tsx                  # Root layout (fonts, providers, metadata)
```

### 3.3 tRPC Router Structure

```typescript
// Domain-driven router split
appRouter
├── event
│   ├── getBySlug          // Public — SSR event page
│   ├── list               // Public — discovery feed, search
│   ├── create             // Organiser — create event
│   ├── update             // Organiser — edit event
│   ├── publish            // Organiser — publish draft
│   └── delete             // Organiser — soft delete
├── ticket
│   ├── getAvailability    // Public — real-time tier availability
│   ├── getMyTickets       // Buyer — list purchased tickets
│   └── getQrData          // Buyer — QR code data for display
├── order
│   ├── create             // Buyer — initiate order (inventory hold)
│   ├── getConfirmation    // Buyer — order confirmation data
│   └── getByEmail         // Buyer — magic link access to tickets
├── payment
│   ├── createIntent       // Buyer — Stripe PaymentIntent
│   ├── createMpPreference // Buyer — Mercado Pago preference
│   └── getStatus          // Buyer — check payment status
├── promo
│   ├── validate           // Buyer — validate promo code
│   ├── create             // Organiser — create promo code
│   └── list               // Organiser — list codes for event
├── organiser
│   ├── getProfile         // Organiser — own profile
│   ├── updateProfile      // Organiser — edit profile
│   ├── getSales           // Organiser — sales dashboard data
│   ├── getBuyers          // Organiser — buyer list + export
│   └── getPayouts         // Organiser — payout history
├── checkin
│   ├── validate           // Organiser — validate QR token
│   ├── manual             // Organiser — manual check-in by name/code
│   └── getStats           // Organiser — live check-in counter
├── user
│   ├── getProfile         // Buyer — own profile
│   └── updatePreferences  // Buyer — marketing opt-in, etc.
└── admin
    ├── getMetrics         // Admin — platform-wide stats
    ├── listEvents         // Admin — all events + moderation
    ├── suspendEvent       // Admin — suspend an event
    └── suspendOrganiser   // Admin — suspend an organiser
```

---

## 4. Data Model

### 4.1 Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│    User      │     │ OrganiserProfile │     │    Event     │
│──────────────│     │──────────────────│     │──────────────│
│ id (PK)      │────▶│ id (PK)          │────▶│ id (PK)      │
│ email        │     │ userId (FK→User) │     │ organiserId  │
│ name         │     │ businessName     │     │ slug (unique)│
│ passwordHash │     │ phone            │     │ title        │
│ role (enum)  │     │ bio              │     │ description  │
│ googleId     │     │ logoUrl          │     │ coverImageUrl│
│ emailVerified│     │ stripeAccountId  │     │ date         │
│ createdAt    │     │ payoutReady      │     │ startTime    │
│ updatedAt    │     │ createdAt        │     │ endTime      │
└──────────────┘     └──────────────────┘     │ venueName    │
       │                                       │ venueAddress │
       │                                       │ venueLat     │
       │                                       │ venueLng     │
       │             ┌──────────────┐          │ genreTags[]  │
       │             │  TicketTier  │          │ status (enum)│
       │             │──────────────│          │ absorbFee    │
       │             │ id (PK)      │◀─────────│ publishedAt  │
       │             │ eventId (FK) │          │ deletedAt    │
       │             │ name         │          │ createdAt    │
       │             │ price        │          └──────────────┘
       │             │ quantity     │
       │             │ sold         │          ┌──────────────┐
       │             │ maxPerOrder  │          │  PromoCode   │
       │             │ saleStartsAt│          │──────────────│
       │             │ saleEndsAt   │          │ id (PK)      │
       │             │ isFree       │          │ eventId (FK) │
       │             └──────┬───────┘          │ code         │
       │                    │                  │ type (enum)  │
       │                    │                  │ amount       │
       │                    │                  │ maxUses      │
       │                    ▼                  │ usedCount    │
       │             ┌──────────────┐          │ expiresAt    │
       │             │    Order     │          │ createdAt    │
       └────────────▶│ id (PK)      │          └──────────────┘
                     │ userId (FK)  │
                     │ eventId (FK) │
                     │ email        │   ◀── Guest checkout (no userId)
                     │ name         │
                     │ status (enum)│   pending | confirmed | cancelled
                     │ totalAmount  │        | expired | refunded
                     │ serviceFee   │
                     │ discountAmt  │
                     │ promoCodeId  │
                     │ idempotencyKey│
                     │ createdAt    │
                     └──────┬───────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             │             ▼
       ┌──────────────┐     │      ┌──────────────┐
       │  OrderItem   │     │      │   Payment    │
       │──────────────│     │      │──────────────│
       │ id (PK)      │     │      │ id (PK)      │
       │ orderId (FK) │     │      │ orderId (FK) │
       │ ticketTierId │     │      │ provider     │ stripe | mercadopago
       │ quantity     │     │      │ method       │ card | oxxo | mp
       │ unitPrice    │     │      │ status (enum)│ pending | completed
       │ createdAt    │     │      │ amount       │   | failed | refunded
       └──────────────┘     │      │ stripePaymentIntentId │
                            │      │ mpPreferenceId │
                            │      │ oxxoReference  │
                            │      │ oxxoBarcode    │
                            ▼      │ oxxoExpiresAt │
                     ┌──────────────┐  │ paidAt       │
                     │   Ticket    │  │ createdAt    │
                     │──────────────│  └──────────────┘
                     │ id (PK)      │
                     │ orderId (FK) │
                     │ orderItemId  │
                     │ eventId (FK) │
                     │ tierId (FK)  │
                     │ holderEmail  │
                     │ holderName   │
                     │ qrToken      │  HMAC-signed unique token
                     │ qrImageUrl   │  Pre-rendered PNG
                     │ status (enum)│  active | checkedIn | cancelled
                     │ checkedInAt  │
                     │ createdAt    │
                     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   CheckIn    │
                     │──────────────│
                     │ id (PK)      │
                     │ ticketId (FK)│
                     │ scannedBy    │  userId of staff
                     │ result (enum)│  valid | invalid | duplicate
                     │ reason       │  Why invalid
                     │ scannedAt    │
                     └──────────────┘
```

### 4.2 Key Enums

```typescript
enum UserRole {
  BUYER = 'buyer',
  ORGANISER = 'organiser',
  ADMIN = 'admin',
}

enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  ENDED = 'ended',
}

enum OrderStatus {
  PENDING = 'pending',       // OXXO: awaiting payment
  CONFIRMED = 'confirmed',   // Payment received, tickets issued
  CANCELLED = 'cancelled',   // Organiser or admin cancelled
  EXPIRED = 'expired',       // OXXO 72h expired
  REFUNDED = 'refunded',     // Payment refunded
}

enum PaymentProvider {
  STRIPE = 'stripe',
  MERCADOPAGO = 'mercadopago',
}

enum PaymentMethod {
  CARD = 'card',
  OXXO = 'oxxo',
  MERCADOPAGO = 'mercadopago',
}

enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

enum PromoType {
  FLAT = 'flat',         // Fixed MXN amount
  PERCENTAGE = 'percentage',
}
```

### 4.3 Key Constraints & Rules

| Rule | Implementation |
|------|---------------|
| **Slug uniqueness** | `Event.slug` has unique index. Auto-generated from title + date + city (e.g., `noche-indie-rock-cdmx-2026`). |
| **Inventory management** | `TicketTier.sold` incremented atomically on order creation. Decremented on OXXO expiry/refund. Use Postgres `SELECT ... FOR UPDATE` for concurrent purchase safety. |
| **OXXO inventory hold** | On OXXO order creation: increment `sold`. Cron job checks `Payment.oxxoExpiresAt` every 15 min. Expired → decrement `sold`, set `Order.status = 'expired'`, send email. |
| **Idempotency** | `Order.idempotencyKey` (UUID) prevents duplicate charges on retry. Stripe's built-in idempotency key mirrors this. |
| **QR token security** | `Ticket.qrToken = HMAC-SHA256(ticketId + eventId + orderId, SECRET_KEY)`. Verified server-side on scan. Cannot be guessed or forged. |
| **Soft delete** | `Event.deletedAt` timestamp. Deleted events excluded from queries but retained for financial records (SAT 5-year requirement, Phase 1 § 7.5). |
| **Guest orders** | `Order.userId` is nullable. Guest checkout creates an order with `email` + `name` but no `userId`. If buyer later creates an account with that email, orders are linked via a migration/claim flow. |
| **Data retention** | Financial records: 5 years (Phase 2 § 7.5). Deleted accounts: purge PII within 90 days, keep anonymised transaction records. |

---

## 5. API Design

### 5.1 Internal API (tRPC)

- **Protocol:** tRPC over HTTP (Next.js API route at `/api/trpc/[trpc]`).
- **Transport:** HTTP batch link (multiple queries in one request).
- **Validation:** Zod schemas on all inputs. Shared between client and server.
- **Error handling:** tRPC error codes mapped to user-facing messages. `TRPCError` with `code: 'NOT_FOUND' | 'UNAUTHORIZED' | 'BAD_REQUEST' | 'INTERNAL_SERVER_ERROR'`.
- **Auth context:** Session injected into tRPC context via Auth.js. Middleware checks role per router.

### 5.2 Webhook API (REST)

| Endpoint | Method | Source | Purpose |
|----------|--------|--------|---------|
| `/api/webhooks/stripe` | POST | Stripe | Payment confirmations (card, OXXO), Connect events, refunds |
| `/api/webhooks/mercadopago` | POST | Mercado Pago | Payment confirmations for MP wallet payments |

- **Verification:** Stripe: `stripe.webhooks.constructEvent()` with signing secret. MP: HMAC signature verification.
- **Idempotency:** Webhook handlers check `Payment.stripePaymentIntentId` / `Payment.mpPreferenceId` to prevent duplicate processing.
- **Retry safety:** All webhook handlers are idempotent. Re-processing the same event produces the same result.

### 5.3 Future Public API (Phase C)

- tRPC procedures are structured to be exposable via `trpc-openapi` as RESTful endpoints.
- Naming convention: `event.getBySlug` → `GET /api/v1/events/:slug`.
- API key auth for organiser integrations.
- Versioned: `/api/v1/`.

---

## 6. Infrastructure & DevOps

### 6.1 Environments

| Environment | URL | Database | Purpose |
|-------------|-----|----------|---------|
| **Local** | `localhost:3000` | Neon branch or local Docker Postgres | Development |
| **Preview** | `*.vercel.app` (per-PR) | Neon branch (auto-created) | PR review, QA |
| **Staging** | `staging.boletify.com` | Neon `staging` branch | Pre-production testing |
| **Production** | `boletify.com` | Neon `main` branch | Live |

### 6.2 CI/CD Pipeline (GitHub Actions)

```
PR Opened / Updated:
  ├── pnpm install (cached)
  ├── turbo lint          # ESLint across all packages
  ├── turbo type-check    # TypeScript strict mode
  ├── turbo test          # Vitest unit + integration tests
  ├── Vercel Preview Deploy (automatic)
  └── Neon branch created (for DB migrations testing)

Merge to main:
  ├── All checks pass (required)
  ├── Drizzle migrations applied to production
  ├── Vercel Production Deploy (automatic)
  └── Sentry release + source map upload
```

### 6.3 Branch Strategy

- **`main`** — Production. Protected. Requires PR + passing checks.
- **`feat/*`** — Feature branches. One per feature/ticket.
- **`fix/*`** — Bug fixes.
- **No `develop` branch.** Trunk-based development. Ship to production on every merge.

### 6.4 Observability

| Concern | Tool | Free Tier |
|---------|------|-----------|
| **Error tracking** | Sentry | 5K events/mo |
| **Uptime monitoring** | BetterStack (or Vercel built-in) | 5 monitors |
| **Product analytics** | PostHog | 1M events/mo |
| **Web Vitals** | Vercel Speed Insights | Included |
| **Logs** | Vercel Logs | 1h retention (free), 3d (Pro) |
| **Database monitoring** | Neon dashboard | Included |

### 6.5 Performance Budgets

| Metric | Target | Phase 2 Ref |
|--------|--------|-------------|
| LCP (event page, 4G mobile) | < 2.0s | § 10.1 |
| FID | < 100ms | § 10.1 |
| CLS | < 0.1 | § 10.1 |
| API p95 response time | < 300ms | § 10.1 |
| QR scan → result | < 2s | § 10.1 |
| JS bundle (buyer pages) | < 150 KB gzipped | — |

---

## 7. Authentication & Authorisation

### 7.1 Auth Provider: Auth.js v5

| Method | Buyer | Organiser | Admin |
|--------|-------|-----------|-------|
| **Email + password** | ✅ | ✅ | ✅ |
| **Google OAuth** | ✅ | ✅ | ❌ (internal only) |
| **Magic link (email)** | ✅ (ticket access) | ❌ | ❌ |
| **Guest (no account)** | ✅ (checkout only) | ❌ | ❌ |

### 7.2 Session Strategy

- **Storage:** Database sessions (Drizzle adapter, Postgres). Not JWT — allows server-side invalidation.
- **Cookie:** `__Secure-session-token`, `HttpOnly`, `SameSite=Lax`, `Secure`. 30-day expiry.
- **Auth middleware:** Next.js middleware checks session on protected routes (`/org/*`, `/admin/*`, `/my-tickets/*`). Redirects to `/auth/login` if unauthenticated.

### 7.3 Role Model

| Role | Can Access | Assignment |
|------|-----------|------------|
| `buyer` | Public pages, checkout, My Tickets, account settings | Default on sign-up |
| `organiser` | Everything buyer can + `/org/*` dashboard | Self-selected during registration ("Soy organizador" toggle) or upgraded later |
| `admin` | Everything + `/admin/*` | Manually assigned in DB by founders |

- A user can be **both** a buyer and an organiser (one role field with `organiser` role implies buyer access too).
- Admin is a superuser role — includes organiser + buyer permissions.
- Role checked in tRPC middleware per router.

### 7.4 Guest Checkout Flow

1. Buyer enters email + name at checkout (Phase 3 § B-04).
2. No `User` record created (unless "Crear cuenta" is checked).
3. `Order` created with `email` + `name`, `userId = null`.
4. Ticket access via magic link sent to email → lands on `/my-tickets` with email-scoped session.
5. If buyer later creates account with same email → existing orders linked to new `userId`.

---

## 8. Payments Integration

### 8.1 Architecture Overview

```
Buyer → Checkout UI
  │
  ├── Card → Stripe Elements (hosted fields)
  │          → createPaymentIntent (server)
  │          → confirmPayment (client)
  │          → Webhook: payment_intent.succeeded → confirm order + issue tickets
  │
  ├── OXXO → createPaymentIntent with oxxo method (server)
  │          → Return voucher (reference + barcode) to client
  │          → Buyer pays at OXXO store
  │          → Webhook: payment_intent.succeeded → confirm order + issue tickets
  │          → Cron: check oxxoExpiresAt → expire unpaid orders
  │
  └── Mercado Pago → createPreference (server)
                    → Redirect to MP checkout
                    → Buyer pays with MP balance / linked card
                    → Webhook: payment.approved → confirm order + issue tickets
```

### 8.2 Stripe Integration Detail

**Stripe Products Used:**

| Product | Purpose |
|---------|---------|
| **Stripe Payments** | Card + OXXO payment processing |
| **Stripe Elements** | Hosted card input fields (PCI SAQ-A) |
| **Stripe Connect (Express)** | Organiser onboarding, KYC, payouts to CLABE |
| **Stripe Webhooks** | Async payment confirmations |

**Payment Flow (Card):**

```
1. Buyer selects tickets → tRPC order.create → hold inventory
2. Client calls tRPC payment.createIntent:
   - Server creates Stripe PaymentIntent:
     amount: totalAmount (MXN cents)
     currency: 'mxn'
     payment_method_types: ['card']
     application_fee_amount: serviceFee (MXN cents)  ← Boletify's cut
     transfer_data: { destination: organiser.stripeAccountId }
     idempotency_key: order.idempotencyKey
     metadata: { orderId, eventId }
   - Returns clientSecret to browser
3. Client confirms payment via Stripe.js confirmCardPayment(clientSecret)
4. Stripe fires webhook → /api/webhooks/stripe:
   - Verify signature
   - Find order by metadata.orderId
   - Set Order.status = 'confirmed'
   - Generate QR tickets (HMAC-signed tokens + PNG images)
   - Send confirmation email (Resend + React Email)
```

**Payment Flow (OXXO):**

```
1. Same order.create → hold inventory
2. tRPC payment.createIntent with method: 'oxxo':
   - PaymentIntent with payment_method_types: ['oxxo']
   - payment_method_data: { type: 'oxxo', billing_details: { name, email } }
   - Stripe generates OXXO voucher
   - Store oxxoReference, oxxoBarcode, oxxoExpiresAt (now + 72h)
   - Return voucher data to client
3. Client shows OXXO reference screen (Phase 3 § B-07)
4. Send OXXO reference email (Phase 3 § E-02)
5. Buyer pays at OXXO → Stripe webhook (may take hours/days):
   - payment_intent.succeeded → confirm order + issue tickets + send email (§ E-03)
6. Vercel Cron (every 15 min):
   - Find orders where Payment.oxxoExpiresAt < now AND Payment.status = 'pending'
   - Set Order.status = 'expired'
   - Decrement TicketTier.sold (release inventory)
   - Send expiry email (Phase 3 § E-04)
```

### 8.3 Mercado Pago Integration

```
1. tRPC payment.createMpPreference:
   - Create MP Preference via API:
     items: [{ title, quantity, unit_price, currency_id: 'MXN' }]
     back_urls: { success, failure, pending }
     notification_url: '/api/webhooks/mercadopago'
     external_reference: orderId
     marketplace_fee: serviceFee
   - Return preference.init_point (redirect URL)
2. Client redirects to Mercado Pago
3. Buyer pays with MP balance or linked card
4. MP fires webhook → /api/webhooks/mercadopago:
   - Verify HMAC signature
   - Check payment status via MP API
   - If approved: confirm order + issue tickets
5. Buyer redirected back to success URL → confirmation page (Phase 3 § B-06)
```

### 8.4 Fee Structure Implementation

Per Phase 1 § 5.3, updated with founder decisions (2026-04-03):

```typescript
const SERVICE_FEE_PERCENT = 0.05;       // 5%
const SERVICE_FEE_FLAT = 1000;           // MXN 10.00 in cents
const LOW_PRICE_THRESHOLD = 10000;       // MXN 100.00 in cents — flat fee waived at or below this
const OXXO_CONVENIENCE_FEE = 1300;       // ~MXN 13.00 in cents (Stripe OXXO processing fee)

function calculateFees(
  ticketPrice: number,   // in MXN cents
  quantity: number,
  absorbFee: boolean,
  paymentMethod: 'card' | 'oxxo' | 'mercadopago',
) {
  // Service fee: 5% + flat MXN 10 (flat waived on tickets ≤ MXN 100)
  const flatFee = ticketPrice <= LOW_PRICE_THRESHOLD ? 0 : SERVICE_FEE_FLAT;
  const serviceFeePerTicket = Math.round(ticketPrice * SERVICE_FEE_PERCENT) + flatFee;
  const totalServiceFee = serviceFeePerTicket * quantity;

  // OXXO convenience fee: passed to buyer (only when OXXO selected)
  const oxxoFee = paymentMethod === 'oxxo' ? OXXO_CONVENIENCE_FEE : 0;

  // Free events: no fees at all
  if (ticketPrice === 0) {
    return { buyerPays: 0, serviceFee: 0, oxxoFee: 0, organiserReceives: 0 };
  }

  if (absorbFee) {
    // Organiser absorbs service fee: buyer pays ticket price + OXXO fee only
    return {
      buyerPays: (ticketPrice * quantity) + oxxoFee,
      serviceFee: totalServiceFee,
      oxxoFee,
      organiserReceives: (ticketPrice * quantity) - totalServiceFee,
    };
  } else {
    // Buyer pays: service fee + OXXO fee added on top
    return {
      buyerPays: (ticketPrice * quantity) + totalServiceFee + oxxoFee,
      serviceFee: totalServiceFee,
      oxxoFee,
      organiserReceives: ticketPrice * quantity,
    };
  }
}
```

**Fee display at checkout (Phase 3 § B-05):**
```
Subtotal:                $660 MXN     (2× $330 base)
Cargo por servicio:       $53 MXN     (5% + $10 flat per ticket)
Cargo OXXO:              $13 MXN     ← only shown when OXXO selected
────────────────────────────────
Total:                   $726 MXN
```

**Low-price example (MXN 80 ticket, flat fee waived):**
```
Subtotal:                $160 MXN     (2× $80)
Cargo por servicio:        $8 MXN     (5% only, no flat fee)
────────────────────────────────
Total:                   $168 MXN
```
```

### 8.5 Organiser Payouts (Stripe Connect)

- **Account type:** Express (Stripe-hosted onboarding, minimal dev effort).
- **Onboarding:** Organiser clicks "Configurar datos de pago" (Phase 3 § O-03) → redirected to Stripe Connect onboarding → completes KYC + CLABE setup → redirected back.
- **Payout flow:** Stripe automatically pays out to the organiser's connected account on the standard schedule.
- **Payout speed:** Stripe Mexico Express accounts: **T+7 business days** after payment. This is Stripe's default for Mexico. Faster payouts (T+2) available on request after account history is established.
- **Free events:** No Stripe PaymentIntent created. No payout. Organiser sees "Sin pago — evento gratuito" with attendance stats.

> **Resolves Phase 2 § 11 open question:** Payout speed is T+7 (Stripe Mexico default). Display "Pago estimado en 7 días hábiles" in dashboard.

---

## 9. Security & Compliance

### 9.1 OWASP Top 10 Mitigations

| Threat | Mitigation |
|--------|-----------|
| **A01: Broken Access Control** | tRPC middleware checks `UserRole` per router. Organisers can only access their own events/data. Admin routes restricted. |
| **A02: Cryptographic Failures** | All traffic HTTPS (Vercel enforced). DB connections over TLS. Secrets in Vercel env vars (never in code). Passwords hashed with `bcrypt` (cost factor 12). |
| **A03: Injection** | Drizzle ORM uses parameterised queries (no raw SQL). Zod input validation on all tRPC inputs. |
| **A04: Insecure Design** | Idempotency keys on payments. Inventory holds with atomic DB operations. Rate limiting on sensitive endpoints. |
| **A05: Security Misconfiguration** | CSP headers via Next.js `next.config.js`. HSTS enforced by Vercel. No default credentials. |
| **A06: Vulnerable Components** | `pnpm audit` in CI. Dependabot/Renovate for dependency updates. |
| **A07: Auth Failures** | Auth.js with secure session cookies. bcrypt passwords. Rate-limited login (10 attempts/IP/min). Account lockout after 5 failures. |
| **A08: Data Integrity** | Stripe webhook signature verification. HMAC-signed QR tokens. CSRF protection via `SameSite=Lax` cookies + Auth.js built-in CSRF tokens. |
| **A09: Logging Failures** | Sentry for errors. Vercel logs for requests. PostHog for user events. Structured logging with request IDs. |
| **A10: SSRF** | No user-supplied URLs fetched server-side. Image uploads go to Vercel Blob (not fetched from URL). |

### 9.2 Rate Limiting

| Endpoint | Limit | Implementation |
|----------|-------|---------------|
| Checkout (`order.create`) | 5/IP/min | Vercel Edge Middleware or `upstash/ratelimit` |
| Login | 10/IP/min | Same |
| tRPC general | 100/IP/min | Same |
| Webhook endpoints | No limit (verified by signature) | — |

### 9.3 PCI-DSS Scope

- **Scope:** SAQ-A (no card data touches Boletify servers).
- **Implementation:** Stripe Elements (hosted iframes) for card input. `PaymentIntent` created server-side with amount only. Card details go directly from browser to Stripe.
- **Requirement:** Never log or store card numbers, CVV, or full PAN. Tokenised `PaymentMethod` IDs only.

### 9.4 Data Encryption

| Data | At Rest | In Transit |
|------|---------|-----------|
| Database (Neon) | AES-256 (Neon-managed) | TLS 1.3 (Neon-enforced) |
| Passwords | bcrypt (cost 12) | HTTPS |
| Session tokens | Random (Auth.js) | Secure cookie + HTTPS |
| QR tokens | HMAC-SHA256 signed | HTTPS |
| Images (Vercel Blob) | Encrypted at rest | HTTPS CDN |

### 9.5 Mexico Data Privacy (LFPDPPP)

| Requirement | Implementation | Phase 1 Ref |
|------------|---------------|-------------|
| **Aviso de Privacidad** | Full privacy notice at `/privacidad`. Short version in checkout flow. | § 7.3 |
| **ARCO rights** | Self-service account settings page + `privacidad@boletify.com` email. Response within 20 business days. | § 7.3 |
| **Marketing consent** | Checkbox UNCHECKED by default at checkout. Stored in `User.marketingConsent`. | Phase 2 § 7.1 |
| **Data deletion** | Account deletion purges PII within 90 days. Financial records anonymised but retained 5 years (SAT). | Phase 2 § 7.5 |
| **Organiser data ownership** | CSV export of all buyer data per event. No restrictions on export. | Phase 2 § 7.6 |

---

## 10. Cross-Platform Architecture

> **Cross-reference:** See [`docs/05-cross-platform-refactor.md`](05-cross-platform-refactor.md) for the full migration plan and progress log of the shared-core refactor (Phase 5).

### 10.1 Ships Today

Two platform apps sharing a common core:

- **`apps/web`** — Next.js 15 (App Router) serving all three user types (buyers, organisers, admins) via route groups. SSR/SSG for SEO event pages. Deployed on Vercel.
- **`apps/mobile`** — React Native 0.81 + Expo SDK 54 (Expo Router) for native iOS/Android buyer + organiser experience. Deployed via EAS.

Both apps share the same backend API (`@boletify/api`), database (`@boletify/db`), auth logic (`@boletify/auth`), design system (`@boletify/design-system`), screens (`@boletify/screens`), and features (`@boletify/features`). The platform shells (`apps/web`, `apps/mobile`) are thin wrappers — route files, platform-specific layouts, native permissions, and SSR metadata.

### 10.2 Monorepo Structure

```
boletify/
├── apps/
│   ├── web/                          # Next.js application (platform shell)
│   │   ├── app/                      # App Router route groups (per § 3.2)
│   │   │   ├── (buyer)/              # Dark mode buyer pages
│   │   │   ├── (organiser)/org/      # Light mode organiser dashboard
│   │   │   ├── (admin)/admin/        # Admin dashboard
│   │   │   ├── (auth)/auth/          # Auth pages
│   │   │   ├── api/                  # tRPC handler, webhooks, cron routes
│   │   │   └── layout.tsx            # Root layout
│   │   ├── components/               # Web-specific composite components
│   │   ├── lib/                      # Web-specific utilities
│   │   │   ├── trpc/                 # tRPC client + server context
│   │   │   └── middleware.ts          # Auth guards (imported from @boletify/navigation)
│   │   ├── server/                   # Server-side tRPC caller (API routes)
│   │   │   ├── routers/              # tRPC router composition
│   │   │   └── trpc.ts              # Server-side tRPC init
│   │   ├── middleware.ts             # Route guards (uses @boletify/navigation)
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts        # Imports @boletify/config/tailwind
│   │   └── package.json
│   │
│   └── mobile/                        # React Native / Expo (platform shell)
│       ├── app/                       # Expo Router file-based routes
│       │   ├── (auth)/               # Auth routes
│       │   ├── (buyer)/              # Buyer routes (checkout, my-tickets, events)
│       │   ├── (organiser)/          # Organiser routes (dashboard, checkin, etc.)
│       │   └── _layout.tsx            # Root layout
│       ├── lib/                       # Mobile-specific setup
│       │   └── trpc/                  # Mobile tRPC client
│       ├── app.config.ts             # Expo config (scheme, plugins)
│       ├── metro.config.js           # NativeWind Metro config
│       ├── tailwind.config.ts        # Imports @boletify/config/tailwind
│       └── package.json
│
├── packages/
│   ├── api/                           # tRPC router definitions
│   │   ├── src/
│   │   │   ├── routers/              # Domain routers (event, order, payment, etc.)
│   │   │   ├── trpc.ts              # Context, procedures, auth middleware
│   │   │   └── index.ts             # Root router + re-exports
│   │   └── package.json
│   │
│   ├── auth/                          # Platform-agnostic auth core
│   │   ├── src/
│   │   │   ├── credentials.ts       # Password hashing, credential validation
│   │   │   ├── providers.ts         # Auth provider configs
│   │   │   ├── session.ts           # Session types
│   │   │   └── index.ts             # Public exports
│   │   └── package.json
│   │
│   ├── db/                           # Database layer
│   │   ├── schema/                   # Drizzle schema files (per § 4)
│   │   ├── migrations/               # SQL migrations
│   │   ├── seed.ts                   # Development seed data
│   │   ├── client.ts                 # Neon + Drizzle client
│   │   └── package.json
│   │
│   ├── design-system/                 # Cross-platform UI primitives
│   │   ├── src/
│   │   │   ├── primitives/           # Button, Text, View, Input, etc.
│   │   │   ├── hooks/               # useAuth, useTheme, etc.
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── screens/                       # Cross-platform screen components
│   │   ├── src/
│   │   │   ├── buyer/               # EventDetailScreen, CheckoutScreen, MyTicketsScreen, etc.
│   │   │   ├── organiser/           # DashboardScreen, CheckinScreen, EventsScreen, PayoutsScreen
│   │   │   ├── auth/                # LoginScreen, RegisterScreen
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── features/                      # Data hooks and use-cases
│   │   ├── src/
│   │   │   ├── hooks/               # useEvent, useOrder, useCheckout, etc.
│   │   │   ├── trpc.ts             # Shared tRPC client setup
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── navigation/                    # Route map, guards, app-router runtime
│   │   ├── src/
│   │   │   ├── routes.ts            # Route configuration
│   │   │   ├── guards.ts            # Auth guard logic (shared by web + mobile)
│   │   │   ├── client.ts           # Navigation client (for mobile)
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── tokens/                        # Design token values
│   │   ├── src/
│   │   │   ├── colors.ts
│   │   │   ├── spacing.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── shared/                       # Shared types, validators, constants
│   │   ├── src/
│   │   │   ├── types/               # TypeScript types
│   │   │   ├── validators/          # Zod schemas
│   │   │   ├── constants/           # Fee rates, limits, enums
│   │   │   └── utils/              # Pure utility functions
│   │   └── package.json
│   │
│   └── config/                       # Shared tooling config
│       ├── eslint/                   # ESLint preset
│       ├── typescript/               # tsconfig base
│       └── tailwind/                 # Tailwind preset with design tokens
│           └── preset.ts
│
├── turbo.json                        # Turborepo pipeline config
├── pnpm-workspace.yaml               # pnpm workspaces
├── package.json                      # Root scripts
├── .github/
│   └── workflows/
│       └── quality.yml               # CI: lint, type-check, test
├── .env.example                      # Environment variable template
├── AGENTS.md
└── docs/
    ├── 01-business-model.md
    ├── 02-product-design.md
    ├── 03-ux-design.md
    ├── 04-technical-architecture.md
    └── 05-cross-platform-refactor.md  # Shared-core migration plan
```

### 10.3 Package Dependency Graph

```
apps/web
├── @boletify/api           # tRPC routers
├── @boletify/db            # Drizzle schema + client
├── @boletify/auth          # Session verification helpers
├── @boletify/design-system # Cross-platform UI primitives
├── @boletify/screens       # Shared screen components
├── @boletify/features      # Data hooks (useEvent, useOrder, etc.)
├── @boletify/navigation    # Route guards
├── @boletify/shared        # Types, validators, constants
├── @boletify/tokens        # Design token values
└── @boletify/config        # ESLint, TS, Tailwind configs

apps/mobile
├── @boletify/api           # tRPC routers
├── @boletify/db            # Drizzle schema (for local queries if needed)
├── @boletify/auth          # Token-based session (SecureStore adapter)
├── @boletify/design-system # Cross-platform UI primitives
├── @boletify/screens       # Shared screen components
├── @boletify/features      # Data hooks (useEvent, useOrder, etc.)
├── @boletify/navigation    # Route guards + runtime
├── @boletify/shared        # Types, validators, constants
├── @boletify/tokens        # Design token values
└── @boletify/config        # NativeWind, ESLint, TS configs

@boletify/api
├── @boletify/db            # Database access
├── @boletify/auth          # Session types
└── @boletify/shared        # Zod validators, types, constants

@boletify/screens
├── @boletify/design-system # Primitives (Button, Text, etc.)
├── @boletify/features      # Data hooks
├── @boletify/shared        # Types
└── react-native-web        # Platform adapter (native/web)

@boletify/features
├── @boletify/api           # tRPC client
├── @boletify/shared        # Types, validators
└── @boletify/design-system # UI primitives

@boletify/design-system
├── @boletify/tokens        # Design token values
└── react-native-web        # Platform primitive renderers

@boletify/db
└── @boletify/shared        # Enums, types

@boletify/auth
└── @boletify/shared        # Session types, constants
```

**Platform shell pattern:** `apps/web` and `apps/mobile` are the only packages that import from Next.js / React Native directly. All business logic, UI content, and data hooks live in shared packages.

### 10.4 Cross-Platform Strategy

#### Principle: Platform Shells, Shared Core

The codebase follows a **shared-core architecture** — business logic, UI components, and data hooks live in shared packages; only platform-specific concerns (routing, layout chrome, native permissions, SSR metadata) live in the platform shells.

```
apps/web          → Route files, SSR, Next metadata, cookie auth middleware
apps/mobile       → Route files, Expo layouts, native permissions, token auth
packages/screens  → Screen content + view models (no platform imports)
packages/features → Data hooks + use-cases (no platform imports)
packages/design-system → Cross-platform primitives
packages/navigation → Guards + runtime (shared by both shells)
```

#### File-Naming Convention for Platform Variants

| Pattern | Platform | Example |
|---------|----------|---------|
| `*.tsx` | Default (shared) | `Button.tsx` — shared implementation |
| `*.web.tsx` | Web override | `Button.web.tsx` — web-specific renderer |
| `*.native.tsx` | Native override | `Button.native.tsx` — native-specific renderer |

For this codebase, screens primarily use the shared default (`*.tsx`) via `@boletify/design-system` primitives. Platform overrides are added only when behavior truly diverges.

#### Shared Route Guards

Auth and role guards are declared once in `@boletify/navigation` and consumed by both platform shells:

- **`apps/web/middleware.ts`** — Uses `guards.requireAuth()` for protected Next.js routes
- **`apps/mobile/app/(organiser)/_layout.tsx`** — Uses `guards.requireOrganiser()` for protected Expo Router groups
- **`apps/mobile/app/(buyer)/mis-boletos/index.tsx`** — Uses `guards.requireAuth()` for buyer-protected routes

#### Shared Screen Modules

Screen content is extracted to `@boletify/screens` so both apps render the same UI:

| Screen | Package | Used By |
|--------|---------|---------|
| `EventDetailScreen` | `@boletify/screens/src/buyer/event-detail` | web `(buyer)/events/[slug]`, mobile `(buyer)/events/[slug]` |
| `CheckoutScreen` | `@boletify/screens/src/buyer/checkout` | web `(buyer)/checkout`, mobile `(buyer)/checkout` |
| `MyTicketsScreen` | `@boletify/screens/src/buyer/my-tickets` | web `(buyer)/my-tickets`, mobile `(buyer)/my-tickets` |
| `LoginScreen` / `RegisterScreen` | `@boletify/screens/src/auth` | web `(auth)`, mobile `(auth)` |
| Organiser screens | `@boletify/screens/src/organiser/*` | web `(organiser)`, mobile `(organiser)` |

#### Migration Safety Rules

1. **Migrate in vertical slices** — one route family per PR.
2. **Keep old implementations until parity is verified** — don't delete until both platforms render the shared screen.
3. **Preserve web server concerns** — Next shell files retain `metadata`, server `fetch`, and `notFound()` calls.
4. **Prefer shared defaults** — add `*.web.tsx` / `*.native.tsx` only when behavior truly diverges.
5. **Enforce boundaries** — `@boletify/screens` and `@boletify/design-system` must not import from `apps/web` or `apps/mobile`.

See [`docs/05-cross-platform-refactor.md`](05-cross-platform-refactor.md) for the full migration plan and completed steps.

---

## 11. Product Roadmap — Technical View

### 11.1 Phase A — MVP (Months 1–3)

**Cross-platform from day one. Web ships first; mobile follows as parity is established.**

| Month | Focus | Key Technical Work |
|-------|-------|-------------------|
| **1** | Foundation | Monorepo setup (Turbo + pnpm). Next.js app scaffold. Drizzle schema + Neon DB. Auth.js (email/password + Google OAuth). `@boletify/api` tRPC router scaffolding. Tailwind + NativeWind config from Phase 3 tokens. CI/CD pipeline. `@boletify/design-system` shared primitives. |
| **2** | Core flows | Event CRUD (organiser). Event page SSR + SEO. Stripe integration (card + OXXO). Mercado Pago integration. Checkout flow. QR generation. Shared screens refactor (Phase 5). |
| **3** | Polish + launch | QR check-in scanner. Sales dashboard. Promo codes. Payout display. Admin basics. `@boletify/screens` parity for buyer flow. Bug fixes. Performance tuning (LCP < 2s). Soft launch with first organisers. |

### 11.2 Phase B — Growth (Months 4–6)

| Feature | Technical Work |
|---------|---------------|
| Event discovery feed + search | Postgres full-text search. Genre filter. Date sort. SSR listing pages. Sitemap generation. |
| Apple/Google Wallet passes | `passkit-generator` for Apple. Google Wallet API. 1–2 week spike. |
| Early-bird pricing | Time-based tier auto-transition logic. Cron or event-time check. |
| Organiser-initiated refunds | Stripe Refund API. UI in dashboard. Notification emails. |
| Event cancellation + auto-refund | Batch refund all orders for event. Cascade status updates. |
| Mobile push notifications | Expo Notifications. Event reminders, check-in alerts. |

### 11.3 Phase C — Scale (Months 7–12)

| Feature | Technical Work |
|---------|---------------|
| Multi-city expansion | No code change needed (platform is city-agnostic). Marketing/ops effort. |
| Meilisearch | Replace Postgres full-text with Meilisearch for typo-tolerant, faceted event discovery. |
| Reserved seating | Major effort. `@boletify/seatmap` package. SVG/Canvas seat picker. Venue map builder (organiser). Separate spike/POC. |
| Embeddable widget | `apps/widget/` — lightweight React app. Iframe or Web Component. Shared `@boletify/shared` types. |
| Public API | `trpc-openapi` to expose tRPC procedures as REST. API key auth. Rate limiting. Documentation (OpenAPI spec). |
| Organiser subscriptions (Pro) | Stripe Billing for recurring subscriptions. Feature flags per tier. |

---

## 12. Architecture Decision Records (ADRs)

### ADR-001: Next.js App Router over Remix / Vite+React

- **Status:** Accepted
- **Context:** Need SSR for SEO event pages (Phase 2 § 10.7), React (founder constraint), API routes, and minimal ops overhead for a 2-person team.
- **Decision:** Next.js 14+ with App Router.
- **Alternatives considered:**
  - *Remix:* Excellent DX, but smaller ecosystem, less mature hosting story on Vercel, fewer community resources for Mexico-specific integrations (Stripe Mexico, MP).
  - *Vite + React SPA:* No built-in SSR. Would need a separate server for SEO pages. Added complexity.
- **Consequences:** Locked into Vercel ecosystem (acceptable — it's the best platform for Next.js). Must use App Router patterns (server components, streaming). Team must learn RSC mental model.

### ADR-002: tRPC over REST for Internal API

- **Status:** Accepted
- **Context:** 2-person team building full-stack. Need type safety between client and server to move fast without API documentation overhead.
- **Decision:** tRPC for all internal client-server communication.
- **Alternatives considered:**
  - *REST:* More portable, but requires manual type duplication or codegen (OpenAPI → TypeScript). Overhead for a 2-person team.
  - *GraphQL:* Powerful but overkill for a single-client app. Schema maintenance is high.
- **Consequences:** No public API out of the box (acceptable — public API is Phase C). When needed, `trpc-openapi` can expose procedures as REST endpoints. All procedures must be well-structured to support this future conversion.

### ADR-003: Drizzle over Prisma

- **Status:** Accepted
- **Context:** Serverless deployment on Vercel. Need fast cold starts and small bundle sizes.
- **Decision:** Drizzle ORM.
- **Alternatives considered:**
  - *Prisma:* More popular, better documentation, larger community. But: Prisma Client binary adds ~15 MB to serverless functions, cold starts are 500ms–2s. Known pain point on Vercel.
  - *Kysely:* Good query builder but less full-featured ORM, fewer helpers for migrations.
- **Consequences:** Smaller community than Prisma. Schema syntax is different (TypeScript objects vs. Prisma schema language). Team must learn Drizzle-specific patterns. Trade-off is worth it for 5× smaller bundles and faster cold starts.

### ADR-004: Neon Postgres over Supabase / PlanetScale

- **Status:** Accepted
- **Context:** Need PostgreSQL for relational data (events, tickets, orders), ACID transactions (inventory management), and full-text search (MVP discovery).
- **Decision:** Neon serverless PostgreSQL.
- **Alternatives considered:**
  - *Supabase:* Postgres + auth + storage + realtime in one. But: unwanted abstraction layer, vendor lock-in on auth (we want Auth.js), and their free tier has a 500 MB limit.
  - *PlanetScale:* MySQL, not Postgres. No native full-text search. Vitess-based, which means no foreign keys (dealbreaker for our relational model).
- **Consequences:** Must manage auth separately (Auth.js). Must manage file storage separately (Vercel Blob). Trade-off is worth it for pure Postgres control, branching per PR, and serverless auto-scaling.

### ADR-005: Stripe + Mercado Pago over Conekta-only

- **Status:** Accepted
- **Context:** Need card payments, OXXO (async), Mercado Pago wallet, and organiser payouts to CLABE. Must work in Mexico.
- **Decision:** Stripe as primary processor (cards + OXXO + Connect for payouts) + Mercado Pago SDK for MP wallet payments.
- **Alternatives considered:**
  - *Conekta only:* Mexican processor, supports cards + OXXO + SPEI. But: no equivalent to Stripe Connect for organiser payouts — would need to build payout infrastructure manually. Worse DX, less documentation.
  - *Stripe only:* Stripe doesn't natively process Mercado Pago wallet payments. We'd lose ~23% of payment volume (Phase 2 estimate for MP usage).
- **Consequences:** Two payment provider integrations (more webhook handlers, more testing). Stripe Connect handles KYC/payouts (reduces our compliance burden). International scalability path via Stripe.

### ADR-006: Auth.js over Clerk

- **Status:** Accepted
- **Context:** Zero capital. Need Google OAuth, email/password, magic links, and role-based access.
- **Decision:** Auth.js v5 (NextAuth).
- **Alternatives considered:**
  - *Clerk:* Superior DX, pre-built UI components, webhook-based syncing. But: $25/mo after 10K MAU. Not free. And: introduces vendor dependency for a core feature.
  - *Supabase Auth:* Free, but ties us to Supabase ecosystem.
  - *Lucia Auth:* Good, but deprecated / transitioning to Auth.js ecosystem.
- **Consequences:** More code to write (custom login/register UI, role management). But: zero cost, full control, no vendor lock-in. Acceptable trade-off given the constraint.

### ADR-007: Single Next.js App with Route Groups

- **Status:** Accepted
- **Context:** Three user types (buyer, organiser, admin) with different layouts and themes within the Next.js app. Should they be separate Next.js apps?
- **Decision:** One Next.js app with route groups. Separate later when needed.
- **Alternatives considered:**
  - *Three separate Next.js apps from day 1:* Cleaner boundaries, independent deploys. But: 3× build config, 3× auth setup, shared code complexity, 3× Vercel projects. Way too much overhead for a 2-person team.
- **Consequences:** All web users share one deployment. Route groups provide layout separation without separate apps.

### ADR-009: React Native + Expo for Mobile

- **Status:** Accepted
- **Context:** Buyer mobile experience requires native iOS/Android delivery. PWA is insufficient for App Store presence and push notifications.
- **Decision:** React Native 0.81 + Expo SDK 54 with Expo Router. Native mobile app ships alongside web (not instead of).
- **Alternatives considered:**
  - *PWA only:* Covers MVP needs but no App Store presence, no push notifications, lower perceived trust for payment flows.
  - *React Native without Expo:* More control but significantly more build/deploy overhead for a small team.
  - *Native Swift/Kotlin:* Full native performance but 2× the codebase (web + mobile) with no code sharing.
- **Consequences:** Mobile app shares all business logic from `@boletify/api`, `@boletify/screens`, `@boletify/features`, `@boletify/design-system`. Platform shells (`apps/web`, `apps/mobile`) are thin wrappers. Mobile uses Bearer token auth (not cookie sessions) via `@boletify/auth`.

### ADR-008: Tailwind CSS for Styling

- **Status:** Accepted
- **Context:** Phase 3 defines a complete design token system (colours, spacing, typography, breakpoints). Need a CSS approach that maps tokens to code efficiently.
- **Decision:** Tailwind CSS with a custom preset encoding Phase 3 design tokens.
- **Alternatives considered:**
  - *CSS Modules:* Good encapsulation but verbose for utility patterns. Doesn't map tokens as naturally.
  - *styled-components / Emotion:* Runtime CSS-in-JS adds bundle size. Poor streaming SSR support with RSC.
  - *Vanilla Extract:* Good (zero-runtime), but less community tooling for Tailwind-like utility workflows.
- **Consequences:** Large utility class strings in JSX (team must be comfortable with this). Excellent performance (zero runtime). Phase 3 design tokens map directly to `tailwind.config.ts` `extend` block. Dark/light mode via Tailwind `dark:` variant with `class` strategy.

---

## 13. Open Questions

> Technical unknowns, spikes needed, decisions awaiting upstream or founder input.

### Resolved

- [x] **OXXO convenience fee pass-through:** **Pass to buyer.** Display as "Cargo OXXO: ~MXN 13" at checkout when OXXO selected. Not shown for card/MP. See updated fee calculation in § 8.4. *Founder decision 2026-04-03.*
- [x] **Organiser identity verification level:** **Minimal / manual for MVP.** Founders onboard organisers personally (<30 at MVP). Stripe Connect Express handles KYC. No additional Boletify verification layer. Automated self-serve onboarding deferred to Phase B. *Founder decision 2026-04-03.*
- [x] **Stripe Connect onboarding flow:** **Express accounts.** Stripe-hosted UI, minimal dev work. KYC + CLABE payout handled by Stripe. Confirmed appropriate for MVP where founders manually onboard known organisers. *Resolved 2026-04-03.*
- [x] **i18n library:** **`next-intl`** — small footprint, works with App Router, supports ICU message syntax for plurals/currencies. Spanish (es-MX) at launch; English (en) shortly after MVP release. All strings externalised from day 1. *Founder decision 2026-04-04.*

### Still Open

- [ ] **Stripe Mexico Connect payouts — exact timeline:** Documented as T+7 based on standard terms. Need to confirm with Stripe during account setup whether faster payouts are available.
- [ ] **Mercado Pago marketplace fee:** MP charges ~3.49% + IVA for marketplace payments. Need to confirm exact rates for Mexico and model the margin.
- [ ] **Image CDN / optimisation:** Vercel Image Optimization is included in Pro ($20/mo). Sufficient for MVP. Or use Cloudflare R2 + Cloudflare Image Resizing for cheaper at scale.
- [ ] **Database region:** Neon default is `us-east-1`. Users are in Mexico. Latency impact? Neon offers `us-west-2` which is geographically closer to CDMX. Need to benchmark.
- [ ] **Real-time dashboard:** Polling every 30s is the MVP approach. If organisers demand faster updates, evaluate Vercel's `unstable_noStore` + short cache TTL, or Server-Sent Events via a long-polling tRPC subscription.

---

*Last updated: 2026-04-11 — mobile app added, cross-platform shared-core architecture live, Phase 5 refactor complete*
