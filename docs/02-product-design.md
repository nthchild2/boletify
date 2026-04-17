# Phase 2 — Product Design & Roadmap

> **Status:** 🟡 In Progress — updated 2026-04-10 with competitive intel, launch sequencing, and user research plan
> **Owner Hat:** Product Manager
> **Upstream Input:** [Phase 1 — Business Model](01-business-model.md), [Competitive Battlecard](boletify-battlecard.html)
> **Downstream Consumer:** [Phase 3 — UX & Design](03-ux-design.md), [Phase 4 — Technical Architecture](04-technical-architecture.md)

---

## Purpose

Translate the validated business model into a concrete product definition: who the users are, what they can do, what the MVP includes, and in what order features get built. Every decision in this document traces back to a Phase 1 finding and serves as the specification that Phase 3 (UX) and Phase 4 (Architecture) implement.

---

## Table of Contents

1. [User Personas](#1-user-personas)
2. [Jobs to Be Done (JTBD)](#2-jobs-to-be-done-jtbd)
3. [Core User Flows](#3-core-user-flows)
4. [MVP Scope](#4-mvp-scope)
5. [Feature Roadmap](#5-feature-roadmap)
6. [Brand Identity](#6-brand-identity) _(incl. §6.9 PROFECO Market Moment)_
7. [Data & Analytics Strategy](#7-data--analytics-strategy)
8. [Ticket Types & Mechanics](#8-ticket-types--mechanics)
9. [Promotions & Discounts](#9-promotions--discounts)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Open Questions](#11-open-questions)
12. [Launch Sequencing](#12-launch-sequencing) ✨ _new_
13. [User Research Plan](#13-user-research-plan) ✨ _new_

---

## Competitive Context

> _Source: [Boletify Battlecard](boletify-battlecard.html) — last updated 2026-04-10. Use this section to ground product decisions in market reality._

| Competitor | Fatal Weakness | Boletify Counter | Urgency |
|------------|---------------|-----------------|---------|
| **Ticketmaster MX** | Fined MXN 5M by PROFECO (Feb 2026) for hidden fees. Fees total ~24% of ticket face value. | Radical fee transparency — show exact total from first screen. This is a live regulatory moment, not just positioning. | 🔴 High — act now while the news cycle is alive |
| **Boletia** | T+7-10 payout, 10% fees, no data export, locked ecosystem | T+3 payout, 5%+MXN 10 fee, full data export at any time | 🟡 Medium |
| **Eventbrite** | No OXXO, no SPEI, designed for US/EU market | OXXO, SPEI, Mercado Pago native from day one | 🟡 Medium |
| **Dice/Fever** | Acquired by Fever (June 2025), not in LatAm market | Local presence, Spanish-first, no acquisition premium | 🟢 Low |
| **SuperBoletos** | 40% MX market share but declining trust; fee-heavy | Community-owned feels vs. corporate | 🟢 Low |

**Key product implication:** Every pricing-related UI decision — how fees are shown, when they appear, how clearly they're labeled — is a direct competitive act. Boletify's UI is the argument.

---

## 1. User Personas

> Derived from Phase 1 § 1.3 (Target Segments), § 2 (Problem Statement), and § 8.2 (Early Adopter Profile).

### Persona 1 — Raúl, the Indie Promoter

| Attribute | Detail |
|-----------|--------|
| **Role** | Independent music promoter |
| **Age / Location** | 32, Mexico City (CDMX) |
| **Bio** | Raúl produces 4–8 concerts per month at mid-size venues (200–1,500 cap) across CDMX. He books indie rock, electronic, and Latin alternative acts. He currently splits between Boletia, Instagram DMs, and bank transfers to sell tickets. He runs a lean operation — himself plus two freelancers. |
| **Goals** | • Sell out shows and maximise attendance. • Own his audience data so he can promote future events directly. • Get paid quickly to cover upfront venue deposits and artist fees. • Present a professional, branded event page he can share on social media. |
| **Frustrations** | • Boletia's 10 %+ fees eat into thin margins. • Payouts take 7–10 business days — he often needs cash within 48 hours. • He can't export buyer emails or phone numbers for his own CRM. • The tools feel rigid: no custom branding, limited promo-code options. |
| **Tech & Devices** | iPhone 14, MacBook Air. Comfortable with tech, uses Canva, Google Sheets, WhatsApp Business. Not a developer. |
| **Quote** | *"I just want a platform that doesn't feel like it's competing with me for my own fans."* |

### Persona 2 — Mariana, the Venue Operator

| Attribute | Detail |
|-----------|--------|
| **Role** | Owner/manager of a 400-capacity live-music bar |
| **Age / Location** | 41, Guadalajara (GDL) |
| **Bio** | Mariana runs "La Madriguera," a bar-venue that hosts 3–5 ticketed events per week plus open-mic nights. She employs a small team of 8. She wants to professionalise her ticketing but can't justify Ticketmaster-level fees for a 400-cap room. She currently sells tickets at the door and via WhatsApp. |
| **Goals** | • Reduce walk-up uncertainty by moving to advance online sales. • Have a simple tool her staff can operate without training. • Track which events perform best (by genre, day-of-week, pricing). • Offer payment options her customers actually use (OXXO, Mercado Pago). |
| **Frustrations** | • Existing platforms are overkill or too expensive for small venues. • She loses 15–20 % of potential revenue to no-shows when tickets are free at the door. • Analytics are nonexistent — she tracks everything in a notebook. • English-language interfaces confuse her staff. |
| **Tech & Devices** | Android phone (Samsung A-series), shared desktop PC at the venue. Moderate tech comfort — can use social media and POS systems. |
| **Quote** | *"I need something my bartender can check at the door with his phone, not a NASA control panel."* |

### Persona 3 — Diego, the Young Fan

| Attribute | Detail |
|-----------|--------|
| **Role** | Ticket buyer / concert-goer |
| **Age / Location** | 24, Mexico City (CDMX) |
| **Bio** | Diego is a junior graphic designer who attends 2–4 live events per month — mostly indie concerts and electronic shows. He discovers events through Instagram, TikTok, and friends' stories. He doesn't have a credit card; he pays for everything via Mercado Pago or OXXO cash deposits. |
| **Goals** | • Easily discover what's happening this weekend in CDMX. • Know the real, final price before he commits (no surprise fees). • Pay with Mercado Pago or OXXO — no credit card required. • Have his ticket on his phone — no printing, no will-call lines. |
| **Frustrations** | • Ticketmaster shows MXN 400 then charges MXN 560 at checkout. Infuriating. • Many platforms don't accept OXXO — he has to ask friends with credit cards to buy for him. • Mobile experiences are slow, crash on sale day, and aren't designed for phones. • After buying, he gets zero useful info — no event-day directions, no lineup updates. |
| **Tech & Devices** | iPhone SE (budget), does everything on mobile. Heavy Instagram/TikTok user. Has Mercado Pago, no credit card, occasional OXXO cash payments. |
| **Quote** | *"Just tell me the real price, let me pay how I want, and put the ticket on my phone. That's it."* |

### Persona 4 — Lucía, the Cultural Programmer

| Attribute | Detail |
|-----------|--------|
| **Role** | Programming director at a public theatre / cultural centre |
| **Age / Location** | 48, Monterrey (MTY) |
| **Bio** | Lucía programmes 10–15 events per month at a mid-size government-funded cultural centre: theatre, dance, literary readings, film screenings. Ticket prices are low (MXN 50–200) or free. She reports attendance data to funders. She needs clean records, not just sales. |
| **Goals** | • Manage both paid and free (RSVP) events on one platform. • Generate attendance reports for government funders and sponsors. • Reach new audiences beyond the centre's existing mailing list. • Keep things affordable — she can't justify high per-ticket fees on MXN 80 tickets. |
| **Frustrations** | • Boletia's per-ticket fees are disproportionate on cheap tickets (10 % of MXN 80 = MXN 8, but feels like a lot to her audience). • Free events have no good RSVP tool — she uses Google Forms, which can't scan at the door. • She needs attendance counts and demographics for grant reports, which no platform provides. • Reserved seating for the theatre would be ideal, but only Ticketmaster offers it — and they won't work with a 300-seat house. |
| **Tech & Devices** | Android phone, office PC (Windows). Moderate tech comfort. Uses Excel for reports and WhatsApp for comms. |
| **Quote** | *"I don't just sell tickets — I need to prove to the government that people actually showed up."* |

---

## 2. Jobs to Be Done (JTBD)

> Format: "When [situation], I want to [motivation], so I can [expected outcome]."

### Raúl (Indie Promoter)

1. **When** I'm planning a new concert, **I want to** create a professional event page in minutes, **so I can** start promoting immediately on social media.
2. **When** I'm running a show next week, **I want to** see real-time ticket sales and buyer demographics, **so I can** adjust my marketing spend before it's too late.
3. **When** a show sells out, **I want to** access all my buyers' contact information, **so I can** notify them directly about my next event without paying for ads.
4. **When** an event ends, **I want to** receive my payout within 48 hours, **so I can** pay the venue and artists on time.
5. **When** I want to generate buzz, **I want to** create limited promo codes for influencers, **so I can** track which channels drive the most sales.

### Mariana (Venue Operator)

1. **When** I'm scheduling my weekly lineup, **I want to** create multiple events quickly with recurring templates, **so I can** avoid re-entering the same venue details every time.
2. **When** a customer arrives at the door, **I want** my staff to scan their QR ticket on any phone, **so I can** speed up entry and eliminate paper lists.
3. **When** the month ends, **I want to** see a dashboard of all events with sales, attendance, and revenue, **so I can** decide which genres and nights to book again.
4. **When** a customer doesn't have a credit card, **I want to** offer OXXO and Mercado Pago, **so I can** sell to 100 % of my audience, not just the banked ones.
5. **When** a buyer needs to cancel, **I want** clear refund policies handled by the platform, **so I can** avoid manual disputes and WhatsApp arguments.

### Diego (Young Fan)

1. **When** it's Thursday evening, **I want to** browse upcoming events in my city by genre and date, **so I can** plan my weekend.
2. **When** I find an event I like, **I want to** see the total price upfront (no hidden fees), **so I can** decide instantly without the checkout betrayal.
3. **When** I'm ready to pay, **I want to** use Mercado Pago or generate an OXXO payment reference, **so I can** buy without a credit card.
4. **When** I've purchased a ticket, **I want to** see my QR code in-app and add it to my phone wallet, **so I can** enter the venue without printing anything.
5. **When** I'm going with friends, **I want to** share the event or gift a ticket easily, **so I can** coordinate the group without screenshots and forwarded emails.

### Lucía (Cultural Programmer)

1. **When** I'm programming the monthly calendar, **I want to** create both free (RSVP) and paid events on the same platform, **so I can** manage everything in one place.
2. **When** a funded season ends, **I want to** export attendance and demographic reports, **so I can** satisfy grant-reporting requirements.
3. **When** ticket prices are very low (MXN 50–100), **I want** service fees to be minimal or flat, **so I can** avoid the fee being a disproportionate burden on my audience.
4. **When** I have a reserved-seating theatre, **I want** buyers to pick their seats on a visual map, **so I can** manage capacity and provide a better experience. *(Post-MVP)*
5. **When** I want to reach new audiences, **I want** my events to appear on a public discovery feed, **so I can** attract people beyond my existing mailing list.

---


## 3. Core User Flows

> Each flow lists the screens involved, decision points, and error / edge-case states. Personas referenced in parentheses.

### 3.1 Buyer — Event Discovery (Diego)

| Step | Screen / Context | Detail |
|------|-----------------|--------|
| 1 | **External link (primary path for MVP)** | Buyer clicks a link shared by the organiser on Instagram, TikTok, WhatsApp, or Twitter/X. Link goes directly to the event page. |
| 2 | **Homepage / Landing page** | If the buyer visits boletify.com directly, they see a curated feed of upcoming events in CDMX, filterable by date and genre. |
| 3 | **Search** | Buyer types event name, artist, or venue into search bar. Results returned with event cards (image, name, date, venue, starting price). |
| 4 | **Category browse** | Buyer selects a music sub-genre tag (indie, electronic, Latin alternative, hip-hop, etc.) to filter the event feed. |

**Edge cases:**
- No results found → friendly empty state with suggestion to browse all events.
- Event in the past → show "This event has ended" badge; do not allow purchase.

---

### 3.2 Buyer — Purchase Flow (Diego)

| Step | Screen | Detail |
|------|--------|--------|
| 1 | **Event Detail Page** | Hero image, event name, date/time, venue + map link, description, lineup, organiser name. Ticket tiers listed with **all-in prices** (or base + fee clearly broken out — pending pricing decision). "Get Tickets" CTA. |
| 2 | **Ticket Selection** | Buyer selects ticket tier (for MVP: General Admission, or Free RSVP) and quantity (1–10 max). Running total shown live. |
| 3 | **Account / Guest Checkout** | Buyer can: (a) sign in if returning, (b) create account (email + password or social login), or (c) continue as guest (email required for ticket delivery). |
| 4 | **Payment Method Selection** | Options: credit/debit card, Mercado Pago, OXXO cash. Each clearly labelled with icons. |
| 5a | **Card / Mercado Pago checkout** | Buyer enters payment details (hosted fields — no raw card data on our servers). Process is synchronous: success → step 6, failure → show error + retry. |
| 5b | **OXXO checkout (async)** | System generates an OXXO payment reference (barcode + reference number). Buyer has **72 hours** to pay at any OXXO store. Order status = "Pending Payment." Ticket is **not** issued yet; inventory is held (reserved) for the 72-hour window. |
| 6 | **Order Confirmation** | For card/Mercado Pago: immediate confirmation screen + email with QR ticket(s) attached. For OXXO: confirmation screen showing reference number + instructions + "you'll receive your ticket by email once payment is confirmed." |
| 7 | **OXXO Payment Webhook** | (Background) Payment processor fires webhook when OXXO payment is confirmed. System releases the ticket: sends email with QR code, marks order as "Paid." |

**Error / edge states:**

| Scenario | Handling |
|----------|----------|
| Payment fails (card declined) | Show inline error message, allow retry with same or different method. Do not lose cart. |
| OXXO reference expires (72h) | Release held inventory back to available pool. Send buyer email: "Your OXXO payment window expired. Tickets have been released." |
| Event sells out during checkout | Show "Sold out" message before payment is attempted (real-time inventory check at step 5). If race condition occurs post-payment, issue automatic refund + apology email. |
| Duplicate purchase detection | If same email buys same event twice, show warning "You already have tickets for this event — continue anyway?" |
| Network error mid-checkout | Idempotency keys prevent double charges. Show retry prompt. |

---

### 3.3 Buyer — Ticket Access on Event Day (Diego)

| Step | Screen / Context | Detail |
|------|-----------------|--------|
| 1 | **Email** | Buyer received a confirmation email with a QR code image and a "View My Tickets" link. |
| 2 | **My Tickets page (web)** | Buyer visits boletify.com/my-tickets (logged in or via magic link from email). Sees list of upcoming tickets with QR codes. |
| 3 | **QR display** | Full-screen QR code view optimised for door scanning (high contrast, max brightness prompt, no UI clutter). |
| 4 | **Wallet pass (post-MVP)** | Buyer can add ticket to Apple Wallet / Google Wallet from the confirmation email or My Tickets page. |
| 5 | **Door scan** | Staff scans QR → system validates → green checkmark (valid) or red X (invalid/already scanned). |

**Edge cases:**
- Buyer lost email → can access via "My Tickets" with email + magic link.
- No internet at venue → QR codes are static images; scanner needs connectivity, not the buyer's phone.
- Screenshot shared to friend → QR is single-use; first scan consumes it. Second scan shows "Already checked in."

---

### 3.4 Organiser — Onboarding & Account Setup (Raúl)

| Step | Screen | Detail |
|------|--------|--------|
| 1 | **Sign Up** | Organiser registers with email + password (or Google OAuth). Selects "I'm an organiser" during signup. |
| 2 | **Profile Setup** | Enters: organiser/business name, phone number, profile image/logo, short bio. |
| 3 | **Payout Setup** | Connects payout method: bank account (CLABE) or Stripe Connect onboarding. Required before first event can go live. Includes basic identity verification (government ID upload — scoped to payment processor's KYC requirements). |
| 4 | **Organiser Dashboard** | Lands on an empty-state dashboard with a prominent "Create Your First Event" CTA. |

**Edge cases:**
- KYC rejected by payment processor → clear error message + instructions to retry or contact support.
- Organiser tries to publish event without payout setup → system blocks and redirects to payout setup step.

---

### 3.5 Organiser — Create Event & Publish (Raúl)

| Step | Screen | Detail |
|------|--------|--------|
| 1 | **New Event Form** | Organiser enters: event name, date/time (start + optional end), venue name + address (with autocomplete), description (rich text), cover image upload (with crop tool), music genre tags. |
| 2 | **Ticket Configuration** | Add one or more ticket tiers. For each: tier name (e.g., "General", "VIP", "Early Bird"), price (MXN, or MXN 0 for free/RSVP), quantity available, sale start/end dates. |
| 3 | **Pricing & Fees Preview** | Shows the organiser exactly what the buyer will see: base price + service fee = total. Organiser can toggle "absorb fee" if desired. For free events, no fees. |
| 4 | **Promo Codes (optional)** | Organiser can create promo codes: discount type (flat MXN or %), max uses, expiry date. |
| 5 | **Review & Publish** | Summary preview of the event page as the buyer will see it. "Publish" button makes it live + generates shareable URL. "Save Draft" saves without publishing. |
| 6 | **Post-publish sharing** | Confirmation screen with shareable link, copy-to-clipboard button, and pre-formatted share buttons (WhatsApp, Instagram Stories, X, Facebook). |

**Edge cases:**
- Image upload fails → show error + retry; provide format/size guidance (max 5 MB, JPG/PNG/WebP).
- Organiser sets 0 tickets available → validation error: "Add at least 1 ticket."
- Duplicate event detection → warn if an event with same name + date already exists on their account.

---

### 3.6 Organiser — Sales Dashboard & Analytics (Raúl, Mariana)

| Step | Screen | Detail |
|------|--------|--------|
| 1 | **Dashboard Home** | List of all events (upcoming, live, past) with summary stats: tickets sold / total, revenue, status (Draft / Live / Ended). |
| 2 | **Event Detail View** | For a specific event: real-time sales chart (tickets over time), revenue breakdown (by tier), check-in count (day of event), buyer list (name, email, ticket tier, payment method, check-in status). |
| 3 | **Buyer Data Export** | Download buyer list as CSV (name, email, phone if provided, tier, purchase date). Available for each event or across all events. |
| 4 | **Aggregate Analytics (post-MVP enhancement)** | Cross-event view: total GMV, best-performing events, repeat buyer rate, top referral sources. |

---

### 3.7 Organiser — Payout / Settlement (Raúl)

| Step | Screen | Detail |
|------|--------|--------|
| 1 | **Payout Summary** | In the dashboard, organiser sees: gross sales, platform service fee deducted, payment processing fee deducted, net payout amount. |
| 2 | **Payout Schedule** | Display expected payout date. **Target: T+3 business days** (next business Monday for weekend events). Boletia pays T+7-10 — this gap is a key organiser win. Stripe Connect Express supports T+3 as a configurable schedule after sufficient account history; negotiate faster cadence as default for Boletify accounts. |
| 3 | **Payout History** | Log of all past payouts: date, amount, bank account (masked), status (processing / completed / failed). |
| 4 | **Payout Failure** | If bank transfer fails (wrong CLABE, etc.), show alert + prompt organiser to update banking details. Retry payout. |

**Note:** Free events generate no payout. Dashboard shows "No payout — this was a free event" with attendance stats instead.

---

### 3.8 Organiser — Door Check-In / QR Scanning (Mariana)

| Step | Screen | Detail |
|------|--------|--------|
| 1 | **Check-In Mode** | From the event detail in the organiser dashboard, tap "Start Check-In." Opens camera-based QR scanner in the browser (no app install required). |
| 2 | **Scan QR** | Staff points phone camera at buyer's QR code. |
| 3 | **Validation Result** | ✅ **Valid:** Green screen flash + attendee name + ticket tier. Ticket marked as "checked in." ❌ **Invalid:** Red screen + reason ("Already checked in", "Invalid ticket", "Wrong event"). |
| 4 | **Manual Check-In** | If scanner fails (damaged QR, glare), staff can search by buyer name or confirmation code and manually check in. |
| 5 | **Check-In Counter** | Real-time count displayed: "47 / 200 checked in." |

**Edge cases:**
- No internet at door → scanner needs at minimum intermittent connectivity. Offline mode is post-MVP.
- Same QR scanned twice → second scan shows "Already checked in at [time]."
- Buyer has multiple tickets (bought for friends) → each ticket has its own QR; each scanned individually.

---

## 4. MVP Scope

> **Constraint reminder:** Zero external capital. 1–2 TypeScript developers (founders). Music-only vertical. CDMX only. Must be shippable in ~3 months.

### 4.1 Must Have (MVP)

#### Buyer-Facing

| # | Feature | Description |
|---|---------|-------------|
| B1 | **Public event page** | Individual event page with cover image, details, date/time, venue + map, description, lineup, ticket tiers, "Get Tickets" CTA. Shareable URL. SEO-friendly (SSR). |
| B2 | **Ticket selection & cart** | Select tier, choose quantity (1–10), see running total with all fees visible. |
| B3 | **Guest checkout** | Purchase without creating an account — email address only. |
| B4 | **Account creation / login** | Email + password and Google OAuth. Enables "My Tickets" and order history. |
| B5 | **Card payment** | Credit/debit card via Stripe or Conekta hosted fields (PCI SAQ-A). |
| B6 | **OXXO payment** | Generate OXXO reference; async fulfilment via webhook. 72h expiry with inventory hold. |
| B7 | **Mercado Pago payment** | Mercado Pago checkout integration (covers Mercado Pago balance + linked cards). |
| B8 | **Order confirmation + QR ticket delivery** | Confirmation screen + email with unique QR code per ticket. |
| B9 | **My Tickets page** | Web page where logged-in buyers (or via magic email link) view upcoming tickets with QR codes. |
| B10 | **Free event RSVP** | "Register" button for free events; collects email, issues QR for check-in. No payment flow. |
| B11 | **Mobile-responsive design** | All buyer-facing pages fully responsive, mobile-first. |

#### Organiser-Facing

| # | Feature | Description |
|---|---------|-------------|
| O1 | **Organiser registration + profile** | Sign up, set organiser name/logo/bio, select "I'm an organiser." |
| O2 | **Payout setup (KYC)** | Connect bank account (CLABE) via Stripe Connect or Conekta. Basic identity verification. |
| O3 | **Event creation form** | Name, date/time, venue, description (rich text), cover image upload, genre tags. |
| O4 | **Ticket tier configuration** | Create 1+ ticket tiers: name, price (or MXN 0 for free), quantity, sale start/end dates. |
| O5 | **Fee preview + absorb-fee toggle** | Show organiser exactly what buyers pay. Toggle to absorb the service fee if desired. |
| O6 | **Promo code creation** | Create codes: flat MXN or % discount, max uses, expiry date. |
| O7 | **Event publish + shareable link** | Publish event → get URL + share buttons (WhatsApp, Instagram, X, copy link). Save as draft option. |
| O8 | **Sales dashboard** | Per-event view: tickets sold/total, revenue (gross & net), sales over time chart, buyer list. |
| O9 | **Buyer data export (CSV)** | Download buyer list: name, email, tier, purchase date, check-in status. |
| O10 | **QR check-in scanner** | Browser-based camera scanner. Green ✅ / Red ❌ result with attendee name. Manual search fallback. Check-in counter. |
| O11 | **Payout summary** | Gross sales, fees deducted, net amount, expected payout date, payout history. |

#### Platform / Admin

| # | Feature | Description |
|---|---------|-------------|
| A1 | **Admin dashboard (internal)** | View all events, all organisers, all transactions. Ability to suspend events or organisers. |
| A2 | **Event moderation** | Manual review queue for flagged events (reports, policy violations). |
| A3 | **Basic metrics view** | Platform-wide: total GMV, tickets sold, active organisers, active events. |

#### Payments & Billing

| # | Feature | Description |
|---|---------|-------------|
| P1 | **Service fee calculation** | Apply service fee per ticket (5% + MXN 10 baseline, configurable). |
| P2 | **OXXO async payment handling** | Webhook listener for OXXO confirmations; auto-release expired holds after 72h. |
| P3 | **Automated payout processing** | Batch payouts to organisers on schedule via Stripe Connect / Conekta. |
| P4 | **Refund processing** | Manual refund capability (admin-initiated for MVP; organiser self-serve in v1.1). |

#### Communications

| # | Feature | Description |
|---|---------|-------------|
| C1 | **Order confirmation email** | Sent immediately on purchase. Contains event details + QR ticket(s). |
| C2 | **OXXO payment reference email** | Sent on OXXO order. Contains barcode, reference number, instructions, 72h deadline. |
| C3 | **OXXO payment confirmed email** | Sent when OXXO webhook fires. Contains QR ticket(s). |
| C4 | **OXXO expiry notification** | Sent if 72h elapses without payment. "Your tickets were released." |
| C5 | **Event reminder email** | Sent 24h before event. Contains event details, venue directions, QR ticket link. |
| C6 | **Organiser payout notification** | Email when payout is processed. |

### 4.2 Should Have (v1.1 — Next Iteration)

| # | Feature | Description |
|---|---------|-------------|
| S1 | **Apple Wallet / Google Wallet pass** | Add ticket to phone wallet from confirmation email or My Tickets page. |
| S2 | **Event discovery feed** | Public homepage with curated/algorithmic event feed, search, and genre filters. SEO-optimised event listings. |
| S3 | **Early-bird pricing** | Time-based automatic tier transitions (e.g., "Early Bird" price until date X, then "Regular" price). |
| S4 | **Tiered tickets beyond GA** | VIP, meet-and-greet, table packages — multiple price tiers with different descriptions/perks. |
| S5 | **Organiser-initiated refunds** | Organisers can process refunds from their dashboard (within policy). |
| S6 | **Event edit after publish** | Edit event details (description, image, time) after publishing. With buyer notification for material changes. |
| S7 | **Aggregate organiser analytics** | Cross-event analytics: total GMV, top events, repeat-buyer rate, referral sources. |
| S8 | **Social sharing incentives** | "Share this event" flow with tracking links to measure which shares convert. |
| S9 | **Event cancellation flow** | Organiser cancels event → all buyers auto-refunded → notification emails sent. |
| S10 | **Waitlist for sold-out events** | Buyers can join a waitlist; notified if tickets become available (cancellation or capacity increase). |

### 4.3 Could Have (v1.2+)

| # | Feature | Description |
|---|---------|-------------|
| C1 | **Reserved seating** | Interactive seat map; buyers pick specific seats. Complex to build (Lucía's need). |
| C2 | **Multi-day / festival passes** | Single ticket valid across multiple dates or a date range. |
| C3 | **Group tickets** | Discounted bundles (e.g., "buy 4 for the price of 3"). |
| C4 | **BNPL (Buy Now Pay Later)** | Integration with Kueski Pay, Mercado Crédito, or Aplazo for instalment payments. |
| C5 | **Referral programme** | Buyers share a referral link → both parties get a discount on next purchase. |
| C6 | **Organiser subscription tiers (Pro/Enterprise)** | Paid plans with advanced features (custom branding, priority payouts, API access). |
| C7 | **Embeddable ticket widget** | Organiser embeds a Boletify ticket-purchase widget on their own website. |
| C8 | **Multi-city expansion** | Extend discovery and onboarding beyond CDMX (GDL, MTY, etc.). |

### 4.4 Won't Have (Explicitly Deferred)

| Feature | Reason for Deferral |
|---------|---------------------|
| **Ticket resale / secondary market** | Founder decision: primary-only. Regulatory complexity. Revisit post-Series A. |
| **White-label platform** | MVP is Boletify-branded. White-label is post-MVP Pro/Enterprise feature. |
| **Non-music verticals** | MVP is music-only. Theatre, conferences, sports are later-phase expansion. |
| **Native mobile apps (iOS/Android)** | PWA-quality responsive web is sufficient for MVP. Native apps require disproportionate dev effort for a 2-person team. |
| **Dynamic / surge pricing** | Ethically controversial, complex to implement, not aligned with "transparent pricing" brand. Revisit when data supports it. |
| **Offline check-in mode** | Requires significant engineering for local caching + sync. Venues can use mobile data as fallback. |
| **Multi-language (English, etc.)** | Spanish-first. English is deferred until international expansion. |
| **Chat / messaging system** | Buyer-organiser messaging adds support burden. Use email and WhatsApp links instead. |

---

## 5. Feature Roadmap

> Scored using **RICE**: Reach (users/month affected), Impact (0.25–3), Confidence (50–100 %), Effort (person-months).
> **RICE Score** = (Reach × Impact × Confidence) / Effort.
>
> Reach assumptions — Month 6: ~30 organisers, ~2,500 tickets/month, ~1,500 unique buyers. Month 12: ~120 organisers, ~7,000 tickets/month, ~5,000 unique buyers.

### Phase A — MVP (Months 1–3)

| Feature | Reach | Impact | Confidence | Effort | RICE | Notes |
|---------|-------|--------|------------|--------|------|-------|
| Public event page (SSR, SEO) | 2,500 | 3 | 90 % | 1.5 | **4,500** | Core product. Every buyer sees this. |
| Checkout — card payment | 2,500 | 3 | 95 % | 1.0 | **7,125** | Must-have for revenue. |
| Checkout — OXXO async payment | 1,500 | 3 | 80 % | 1.5 | **2,400** | Unlocks unbanked segment (~40 % of buyers). |
| Checkout — Mercado Pago | 1,200 | 2 | 85 % | 1.0 | **2,040** | Second most-used payment method. |
| QR ticket generation + delivery | 2,500 | 3 | 95 % | 1.0 | **7,125** | No ticket = no product. |
| Organiser event creation + publish | 30 | 3 | 90 % | 2.0 | **41** | Low reach (organisers), but blocking — no events = no buyers. |
| Organiser sales dashboard | 30 | 2 | 85 % | 1.5 | **34** | Core organiser value prop (data ownership). |
| QR door scanner (browser-based) | 30 | 2 | 80 % | 1.0 | **48** | Critical for event-day operations. |
| Free event / RSVP flow | 500 | 2 | 80 % | 0.5 | **1,600** | Drives organiser adoption at zero cost. |
| Guest checkout (no account required) | 2,000 | 2 | 90 % | 0.5 | **7,200** | Reduces conversion friction. |
| Promo code engine (basic) | 500 | 1 | 80 % | 0.5 | **800** | Enables organiser-driven marketing. |
| Transactional emails (confirmation, reminders) | 2,500 | 1 | 95 % | 0.5 | **4,750** | Table-stakes comms. |
| Organiser payout + settlement | 30 | 3 | 80 % | 1.5 | **48** | Blocking — organisers won't use platform without payouts. |

### Phase B — Growth (Months 4–6)

| Feature | Reach | Impact | Confidence | Effort | RICE | Notes |
|---------|-------|--------|------------|--------|------|-------|
| Event discovery feed + search + SEO | 3,000 | 2 | 70 % | 2.0 | **2,100** | Moves from "organiser shares link" to "buyer discovers on platform." |
| Apple Wallet / Google Wallet passes | 2,000 | 1 | 80 % | 1.0 | **1,600** | Quality-of-life for buyers. High perceived value. |
| Early-bird / time-based pricing tiers | 1,000 | 1 | 75 % | 1.0 | **750** | Requested by promoters for pre-sale hype. |
| Organiser-initiated refunds | 200 | 2 | 85 % | 0.5 | **680** | Removes admin burden from founders. |
| Event edit after publish | 30 | 1 | 90 % | 0.5 | **54** | Common organiser request (typo fixes, time changes). |
| Event cancellation + auto-refund | 30 | 2 | 80 % | 1.0 | **48** | Legal requirement (LFPC). Automates painful manual process. |
| Waitlist for sold-out events | 500 | 1 | 65 % | 1.0 | **325** | Captures unmet demand. Signals popularity. |
| Aggregate organiser analytics | 30 | 1 | 70 % | 1.5 | **14** | Stickiness for power users (Raúl). |
| Social share tracking links | 1,000 | 0.5 | 60 % | 0.5 | **600** | Helps organisers understand which channels convert. |
| **Fee transparency calculator** | 2,500 | 2 | 85 % | 0.5 | **8,500** | Marketing landing page (and checkout widget) showing exact final price vs. Ticketmaster/Boletia equivalent. Converts PROFECO fine into a product story. Time-sensitive: launch while news cycle is active (Ticketmaster MXN 5M fine, Feb 2026). |
| **Organiser data export — full history** | 120 | 2 | 90 % | 0.5 | **432** | Pitch directly against Boletia's locked ecosystem. Organiser can export all buyers, all events, any time, no restrictions. Self-serve, one click. |

### Phase C — Scale (Months 7–12)

| Feature | Reach | Impact | Confidence | Effort | RICE | Notes |
|---------|-------|--------|------------|--------|------|-------|
| Multi-city expansion (GDL, MTY) | 3,000 | 2 | 60 % | 2.0 | **1,800** | Multiplies SAM. Requires local organiser outreach. |
| BNPL integration (Kueski / Mercado Crédito) | 2,000 | 1 | 60 % | 1.5 | **800** | Increases AOV for higher-priced events. |
| Reserved seating (seat map) | 500 | 2 | 50 % | 4.0 | **125** | High effort, but unlocks theatre/cultural segment (Lucía). |
| Embeddable ticket widget | 50 | 2 | 70 % | 1.5 | **47** | White-label-lite; organisers embed on their own site. |
| Referral programme (buyer) | 2,000 | 1 | 50 % | 1.5 | **667** | Viral growth loop. |
| Organiser subscription tiers (Pro) | 50 | 2 | 60 % | 2.0 | **30** | New revenue stream. Low reach initially but high LTV. |
| Multi-day / festival passes | 300 | 1 | 60 % | 1.5 | **120** | Needed for festival season. |
| Group ticket bundles | 500 | 0.5 | 50 % | 1.0 | **125** | Nice-to-have for group outings. |
| Organiser API (public) | 20 | 2 | 50 % | 3.0 | **7** | Enables integrations; low reach at this stage. |

---

## 6. Brand Identity

> Boletify's brand should feel like it was born in Mexico City — modern, trustworthy, a little irreverent, and never corporate.

### 6.1 Name & Meaning

**Boletify** = *boleto* (Spanish: ticket) + *-ify* (to make / to enable). "Making ticketing simple." The name is bilingual-friendly, memorable, and domain-available. It signals tech-forward (the "-ify" suffix à la Spotify, Shopify) while staying rooted in Spanish.

### 6.2 Mission Statement

*Empoderar a organizadores independientes para vender boletos de forma justa, transparente y sin complicaciones — y darle a los fans la experiencia de compra que merecen.*

**English:** Empower independent organisers to sell tickets fairly, transparently, and without hassle — and give fans the buying experience they deserve.

### 6.3 Brand Personality & Voice

| Trait | What it means in practice |
|-------|--------------------------|
| **Transparente** (Transparent) | We say the real price. We explain our fees. We don't hide things in small print. |
| **Cercano** (Approachable) | We talk like a friend, not a corporation. We use "tú" not "usted." We use Mexican slang when appropriate. |
| **Moderno** (Modern) | Clean design, fast tech, current references. We don't look like a government website. |
| **Confiable** (Trustworthy) | We do what we say. Payouts on time. Tickets always work. Data is safe. |
| **Con actitud** (With attitude) | We have personality. We're not afraid to call out bad industry practices (hidden fees, scalping). Think: the rebellious underdog that's also reliable. |

**Tone of voice guidelines:**
- **Marketing/social:** Fun, direct, culturally aware. Memes are fine. Pop-culture references welcome. *"¿Otra vez Ticketmaster te clavó fees escondidos? Nosotros no hacemos eso."*
- **Product UI:** Clear, concise, helpful. Never condescending. Use action verbs. *"Selecciona tus boletos" not "Proceda a la selección de entradas."*
- **Support/errors:** Empathetic, honest, solution-oriented. *"Algo salió mal con tu pago. Intenta de nuevo o prueba otro método."*
- **Organiser comms:** Professional but warm. We're a partner, not a vendor. *"Tu evento ya está en línea. Comparte el link y empieza a vender."*

### 6.4 Core Values

1. **Transparencia radical** — No hidden fees. Ever. The price you see is the price you pay.
2. **Tus fans, tus datos** — Organisers own their audience data. We never sell it or lock it behind a paywall.
3. **Hecho para México** — Built for local payment methods, local culture, local realities. Not a translated US product.
4. **Tecnología al servicio** — Tech should simplify, not complicate. If our grandma can't buy a ticket, we've failed.
5. **Comunidad primero** — We grow when the live-music ecosystem grows. Our success is tied to organisers' success.

### 6.5 Visual Identity Direction

> Final design system to be defined in Phase 3. This section provides creative direction.

| Element | Direction |
|---------|-----------|
| **Primary colour** | A vibrant, saturated hue — electric purple, hot coral, or deep magenta. Should pop on dark backgrounds and feel energetic (live music, nightlife). |
| **Secondary palette** | Rich darks (near-black for backgrounds, card surfaces), clean whites, and 1–2 accent colours for CTAs and success states. |
| **Vibe** | Night-out energy. Event posters. Neon signs. Not corporate blue. Not startup minimal-grey. Think: the feeling of walking into a great venue. |
| **Typography** | Modern sans-serif (e.g., Inter, Satoshi, or Plus Jakarta Sans). Bold weights for headings, clean regular for body. Must render well in Spanish (accents, ñ, ¿, ¡). |
| **Imagery** | Real concert photography (not stock photos). Diverse crowds. Mexican venues and urban settings. User-generated content feel. |
| **Logo direction** | App-icon-first: design the icon/mark to feel like a social app or common iOS app (rounded square, single recognisable glyph, strong at small sizes). Wordmark as secondary for web header and marketing. Must work on dark and light backgrounds. |

### 6.6 Naming Conventions

| Concept | Spanish term (in product) | Notes |
|---------|--------------------------|-------|
| Event organiser | **Organizador** | Not "promotor" (too industry-jargon) or "vendedor" (too transactional). |
| Ticket buyer / fan | **Asistente** or **Fan** | "Asistente" in formal contexts (confirmation emails). "Fan" in casual/marketing contexts. |
| Event | **Evento** | Universal. |
| Ticket | **Boleto** | Core brand word. Not "entrada" (more Spain-Spanish) or "ticket" (anglicism). |
| Check-in | **Check-in** | Borrowed term — universally understood in Mexico. |
| Dashboard | **Panel** | "Panel de organizador." |

### 6.7 Tagline

> **Status:** Deferred. No tagline for MVP. Revisit post-launch when brand voice is more established. *Founder decision 2026-04-03.*

### 6.8 Competitive Brand Positioning

```
                    INDIE / APPROACHABLE
                           │
                    Dice   │   ★ Boletify
                           │
         GLOBAL ───────────┼─────────── LOCAL
                           │
                Eventbrite │   Boletia
                           │
                    CORPORATE / FORMAL
                           │
                    Ticketmaster
```

Boletify occupies the **local + indie/approachable** quadrant — the space no one else owns in Mexico. Dice has the right personality but isn't local (and was acquired by Fever in June 2025, reducing its indie credibility). Boletia is local but feels dated and organiser-hostile. Ticketmaster and Eventbrite are corporate/global.

### 6.9 Market Moment — PROFECO Window

> _This is a time-sensitive product-marketing opportunity. It informs Phase B roadmap priorities._

In February 2026, Mexico's PROFECO (consumer protection agency) fined Ticketmaster Mexico **MXN 5 million** for charging undisclosed fees — exactly the practice Boletify is architecturally designed to prevent. This creates a narrow but potent window:

**What it means for product:**
- The "transparent pricing" brand claim is now validated by a government enforcement action against our biggest indirect competitor.
- Fee transparency is not a nice-to-have — it is a regulatory expectation that Ticketmaster failed to meet.
- Boletify can lean into this structurally: every event page must show the final all-in price before the buyer commits. This is non-negotiable for MVP.

**What it means for roadmap (Phase B):**
- Build the **Fee Transparency Calculator** (added to Phase B RICE table above) during the news cycle while consumer awareness is elevated.
- Prepare a landing page: *"Lo que Ticketmaster te cobra en cargos ocultos vs. lo que Boletify cobra"* — with real numbers.
- Coordinate with the marketing team (or founder) on a social/PR push timed to launch.

**Risk:** The news cycle fades within 60–90 days of the fine. If Phase B ships in months 4–6, the window is still open. If delayed past month 8–9, the urgency diminishes significantly.

---

## 7. Data & Analytics Strategy

> All data practices must comply with Mexico's LFPDPPP. See Phase 1 § 7.3.

### 7.1 Buyer Data Collected

| Field | Required? | Purpose | Consent model |
|-------|-----------|---------|---------------|
| Email address | Yes | Ticket delivery, order communications | Collected at checkout; covered by Terms of Service (legitimate interest). |
| Full name | Yes | Ticket personalisation, check-in display | Same as above. |
| Phone number | Optional | Event-day notifications (SMS), account recovery | Explicit opt-in checkbox. |
| Payment method (tokenised) | Yes | Transaction processing | PCI-compliant; no raw card data stored. Covered by payment terms. |
| Purchase history | Automatic | Order history, recommendations | Terms of Service. |
| Marketing preferences | Explicit opt-in | Newsletters, event recommendations, promotional emails | Checkbox at checkout: *"Quiero recibir recomendaciones de eventos."* Must be unchecked by default per LFPDPPP. |

**Aviso de Privacidad (Privacy Notice):** Displayed as a link at checkout and during account creation. Full version hosted at boletify.com/privacidad. Short version summarised in the checkout flow.

**ARCO Rights:** Users can exercise Access, Rectification, Cancellation, and Opposition rights via a dedicated email (privacidad@boletify.com) or a self-service settings page. Response within 20 business days per LFPDPPP.

### 7.2 Organiser Data Collected

| Field | Required? | Purpose |
|-------|-----------|---------|
| Business/organiser name | Yes | Public profile, event attribution |
| Contact email + phone | Yes | Account comms, payout notifications |
| Government ID (for KYC) | Yes | Payment processor identity verification |
| Bank account (CLABE) | Yes | Payout processing |
| RFC (tax ID) | Optional (for factura) | Invoice generation |
| Event history + sales data | Automatic | Dashboard analytics, platform metrics |

### 7.3 Organiser-Facing Analytics (Dashboard)

**Per-event metrics:**
- Tickets sold vs. available (with progress bar)
- Revenue: gross, fees, net payout
- Sales over time (line chart — by day)
- Sales by ticket tier (bar chart)
- Payment method breakdown (card / OXXO / Mercado Pago)
- Check-in count and rate (day of event)
- Buyer list (name, email, tier, status)

**Aggregate metrics (post-MVP, v1.1):**
- Total GMV across all events
- Top-performing events (by revenue, by attendance)
- Repeat buyer rate
- Referral source tracking (UTM-based)
- Buyer demographics (if phone/location data available)

### 7.4 Internal Product Analytics

> For Boletify's own product decisions. Tracked via a lightweight analytics tool (e.g., PostHog, Plausible, or Mixpanel free tier).

- **Funnel conversion:** Event page view → ticket selection → checkout started → payment completed. Track drop-off at each stage.
- **Payment method distribution:** % of transactions by card / OXXO / Mercado Pago. OXXO completion rate (reference generated → actually paid).
- **Organiser activation:** Sign-up → first event created → first event published → first ticket sold. Track drop-off.
- **Retention cohorts:** Organisers who create 2+ events within 90 days. Buyers who purchase 2+ tickets within 90 days.
- **Page performance:** Core Web Vitals (LCP, FID, CLS) per page.
- **Error rates:** Payment failures, QR scan failures, webhook failures.

### 7.5 Data Retention & Deletion Policy

| Data Type | Retention | Rationale |
|-----------|-----------|-----------|
| Active account data | Indefinite (while account active) | Needed for service delivery. |
| Deleted account data | Purged within 90 days of deletion request | LFPDPPP compliance. |
| Financial/transaction records | 5 years after transaction | SAT (Mexican tax authority) requires 5-year record retention. |
| Server logs | 90 days | Security & debugging. |
| Analytics data | Aggregated indefinitely; individual-level for 12 months | Balance between product insight and privacy. |

### 7.6 Privacy-by-Design Principles

1. **Collect minimally:** Only request data essential for the service. No "nice to have" fields at checkout.
2. **Never sell data:** Buyer data is never sold to third parties. Organisers get *their own buyers'* data — not other organisers' data.
3. **Tokenise payments:** No raw card data ever touches Boletify servers. All payment handled via processor-hosted fields.
4. **Encrypt at rest and in transit:** All PII encrypted in the database. All traffic over HTTPS (TLS 1.2+).
5. **Consent is granular and revocable:** Marketing opt-in is separate from transactional consent. Users can opt out at any time.
6. **Organiser data ownership is real:** Organisers can export 100 % of their buyer data at any time (CSV). If an organiser leaves Boletify, they take their data with them.

---

## 8. Ticket Types & Mechanics

### 8.1 Ticket Types

| Type | Description | MVP? | Key Rules |
|------|-------------|------|-----------|
| **General Admission (GA)** | Single-tier, unreserved standing/seating. The default ticket type. | ✅ MVP | Organiser sets price + quantity. Buyer selects quantity (1–10 per order). |
| **Free / RSVP** | No-cost registration. Issues a QR for check-in tracking. | ✅ MVP | No payment flow. Organiser still gets attendee data (name, email). Quantity-limited. |
| **Tiered Pricing (named tiers)** | Multiple price levels for the same event: e.g., "Early Bird" (MXN 200), "General" (MXN 350), "VIP" (MXN 600). | 🔜 v1.1 | Each tier has its own name, price, quantity, and sale window. Organiser defines tier descriptions/perks. |
| **Early-Bird (time-based auto-transition)** | Price automatically increases after a date or sales threshold. | 🔜 v1.1 | Built on top of tiered pricing: "Early Bird" tier closes at a date; "Regular" tier opens simultaneously. |
| **Reserved Seating** | Buyer selects a specific seat from an interactive venue map. | 🔮 v1.2+ | Requires seat-map builder (significant UX + eng effort). Deferred per Phase 1 scoping. |
| **Multi-Day / Festival Pass** | Single ticket valid for multiple dates (e.g., 3-day festival). | 🔮 v1.2+ | QR valid across multiple days. Check-in tracked per day. |
| **Group Tickets** | Discounted bundle (e.g., "4-pack" at a reduced per-ticket price). | 🔮 v1.2+ | Generates individual QR per person in the group. Organiser sets group size + discount. |
| **Complimentary / Guest List** | Free tickets issued directly by the organiser (not via public sale). | ✅ MVP | Organiser enters email addresses → system sends free QR tickets. No public listing. Counts against capacity. |
| **Timed-Entry / Time-Slot** | Tickets for a specific entry time window (e.g., museum, immersive experience). | 🔮 v1.2+ | Not relevant for music-only MVP. Deferred to vertical expansion. |

### 8.2 Ticket Mechanics

#### Max Quantity Per Order
- **MVP default:** 1–10 tickets per order.
- Organiser can customise the max per order (e.g., limit to 4 for high-demand shows to reduce scalping).
- System enforces per-email purchase limits if the organiser enables it (e.g., max 2 orders per email per event).

#### Ticket Transfers
- **MVP:** No transfers. The ticket is tied to the email address that purchased it.
- **Rationale:** Simplifies anti-scalping. Reduces engineering complexity. Matches the Dice model.
- **Post-MVP consideration:** Allow name-change transfers via organiser approval or a peer-to-peer transfer with identity verification.

#### Refund & Cancellation Policy
- **Platform-wide minimum (per LFPC):** Full refund if the event is cancelled by the organiser.
- **Organiser-configurable policy:** For buyer-initiated cancellations, organisers choose from:
  - **No refunds** (default)
  - **Full refund up to X days before event**
  - **Partial refund (e.g., 50 %) up to X days before event**
- **MVP implementation:** Refunds processed manually by Boletify admin (founders). Organiser-initiated self-serve refunds in v1.1.
- **OXXO refunds:** If buyer paid via OXXO, refund is processed to the email's associated Mercado Pago account or via bank transfer (requires buyer to provide CLABE). More complex — document and handle case-by-case in MVP.

#### QR Code Generation & Validation
- **Generation:** Unique QR code per ticket, generated at purchase confirmation (or at OXXO payment confirmation for async payments). Contains a signed token with: order ID, ticket ID, event ID.
- **Format:** QR code rendered as a high-contrast PNG, displayed on the My Tickets page and embedded in the confirmation email. Minimum size: 200×200 px.
- **Validation:** QR scanned via the browser-based organiser scanner. Server validates the token and checks:
  1. Is this a valid Boletify ticket? (Cryptographic signature check.)
  2. Is this for the correct event? (Event ID match.)
  3. Has this ticket already been scanned? (Check-in status in database.)
- **Result:** ✅ Valid → mark as checked in, show attendee name + tier. ❌ Invalid → show reason (already used, wrong event, not found).

#### Anti-Fraud Measures
- **Bot prevention:** CAPTCHA (hCaptcha or Turnstile) on checkout for events exceeding a sales-velocity threshold (e.g., >50 tickets/minute).
- **Duplicate purchase warning:** If the same email attempts to buy the same event again, show a confirmation prompt.
- **Inventory hold limits:** OXXO references hold inventory for 72h max. Expired holds auto-release.
- **Rate limiting:** Max 5 checkout attempts per IP per minute. Max 10 OXXO references per email per day.
- **QR forgery prevention:** QR tokens are cryptographically signed (HMAC or JWT). Cannot be guessed or fabricated.

---

## 9. Promotions & Discounts

| Mechanism | Description | MVP? | Rules & Limits |
|-----------|-------------|------|----------------|
| **Promo codes (flat MXN)** | Organiser creates a code that gives a fixed-amount discount (e.g., "AMIGOS50" → MXN 50 off). | ✅ MVP | Organiser sets: code string, discount amount, max total uses, per-user limit (1 or unlimited), expiry date. Cannot reduce price below MXN 0. |
| **Promo codes (percentage)** | Code gives a percentage discount (e.g., "EARLY20" → 20 % off). | ✅ MVP | Same controls as flat codes. Organiser sets max discount cap (e.g., "20 % off, max MXN 100 discount"). |
| **Absorb-fee toggle** | Organiser can choose to absorb the Boletify service fee so the buyer pays only the base ticket price. | ✅ MVP | Per-event toggle. If enabled, the organiser's net payout is reduced by the absorbed fee. Fee is still charged — just shifted from buyer to organiser. |
| **Free events (RSVP)** | Events with MXN 0 tickets. No payment flow. QR issued for check-in tracking. | ✅ MVP | No service fee charged. Organiser still gets attendee data. Max RSVPs = ticket quantity set by organiser. |
| **Launch promotion (Boletify-funded)** | 0 % Boletify service fee for the first 3 months or first 500 tickets sold (whichever comes first) for new organisers onboarded during launch. | ✅ MVP | Applied at the platform level (not a promo code). Tracked per organiser account. Payment processing fees still apply (Stripe/Conekta pass-through). Displayed in organiser dashboard: "Launch promo: X tickets / 500 remaining" or "Y days / 90 remaining." |
| **Early-bird pricing** | Time-based automatic tier pricing. "Early Bird" price available until a specific date, then price rises to "Regular." | 🔜 v1.1 | Built on the tiered-ticket system (§ 8.1). Organiser sets start/end dates per tier. System auto-hides expired tiers. |
| **Bundle deals** | Discounted multi-ticket packages (e.g., "4-pack for MXN 1,000" instead of MXN 300 each). | 🔮 v1.2+ | Requires group-ticket mechanics. Generates individual QR per ticket in the bundle. |
| **Referral discounts** | Buyers share a referral link. Both referrer and referee get a discount on their next purchase. | 🔮 v1.2+ | Requires referral tracking infrastructure, unique referral codes per buyer, and a credit/wallet system. |
| **Complimentary tickets (guest list)** | Organiser issues free tickets directly to specific email addresses (not publicly available). | ✅ MVP | Organiser enters emails in dashboard → system generates QR tickets and sends them. Counts against event capacity. No promo code needed. |

### Promo Code UX (MVP)

**Organiser side:**
1. In the event creation flow (or post-publish via dashboard), organiser taps "Add Promo Code."
2. Enters: code string (auto-generated or custom), discount type (flat/%), discount amount, max uses, expiry date.
3. Can create multiple codes per event.
4. Dashboard shows: code, times used / max, revenue impact (total discount given).

**Buyer side:**
1. On the ticket selection screen, a collapsible "¿Tienes un código de descuento?" (Got a promo code?) field.
2. Buyer enters code → system validates → discount applied instantly to the total. Invalid code → inline error ("Código inválido o expirado").
3. Discount shown as a line item in the order summary: "Descuento (AMIGOS50): −MXN 50".

---

## 10. Non-Functional Requirements

> Measurable targets that inform Phase 3 (UX) and Phase 4 (Architecture) decisions.

### 10.1 Performance

| Metric | Target | Notes |
|--------|--------|-------|
| **Largest Contentful Paint (LCP)** | < 2.0 s on 4G mobile | Event pages are the most-visited pages; must load fast from social-media clicks. SSR/SSG required. |
| **First Input Delay (FID)** | < 100 ms | Interactive elements (ticket selector, checkout form) must respond immediately. |
| **Cumulative Layout Shift (CLS)** | < 0.1 | No unexpected layout jumps — especially during image loading on event pages. |
| **API response time (p95)** | < 300 ms | For ticket availability checks, cart operations, and QR validation. |
| **Checkout completion time** | < 60 s (card/Mercado Pago) | From "Get Tickets" tap to confirmation screen. OXXO is async and excluded from this target. |
| **QR scan-to-result time** | < 2 s | From camera scan to green ✅ or red ❌ on the organiser's phone. |

### 10.2 Availability & Uptime

| Metric | Target (MVP) | Target (12-month) |
|--------|-------------|-------------------|
| **Uptime** | 99.5 % | 99.9 % |
| **Planned maintenance windows** | Off-peak only (Tue–Thu, 3–6 AM CST) | Same |
| **Recovery Time Objective (RTO)** | < 1 hour | < 15 minutes |
| **Recovery Point Objective (RPO)** | < 1 hour | < 5 minutes |

### 10.3 Scalability

| Scenario | Target |
|----------|--------|
| **Concurrent users (normal)** | 200 simultaneous users |
| **Concurrent users (on-sale spike)** | 500 simultaneous users (small/mid-venue on-sale events). |
| **Peak throughput** | 50 ticket purchases/minute |
| **Database connections** | Handle 100 concurrent connections |

> Note: We are not designing for stadium-scale on-sales (50,000+ concurrent). Our target is indie/mid-size events (50–2,000 cap). If a larger event requires more scale, that becomes a Phase C infrastructure investment.

### 10.4 Supported Devices & Browsers

| Platform | Minimum Support |
|----------|----------------|
| **Mobile (primary)** | iOS Safari 15+, Chrome for Android 100+, Samsung Internet 18+ |
| **Desktop** | Chrome 100+, Firefox 100+, Safari 15+, Edge 100+ |
| **Screen sizes** | 320px (iPhone SE) to 2560px (large desktop). Mobile-first responsive breakpoints. |
| **OS** | iOS 15+, Android 10+, macOS 12+, Windows 10+ |

> No native app for MVP. All experiences delivered via responsive web (PWA-quality).

### 10.5 Localisation & i18n

| Aspect | MVP Implementation |
|--------|-------------------|
| **Language** | Spanish (Mexico) as the only language. All UI, emails, and content in es-MX. |
| **Currency** | Mexican Peso (MXN). Displayed as "$1,200 MXN" with comma as thousands separator. |
| **Date format** | `dd/MM/yyyy` and `dd MMM yyyy` (e.g., "15 abr 2026"). Times in 12h format with AM/PM. |
| **Timezone** | CST (Ciudad de México) — `America/Mexico_City`. All event times displayed in local timezone. |
| **Future i18n** | English (en) as second language targeted shortly after MVP release. Architecture supports i18n from the start via `next-intl` (externalised strings, no hardcoded text). *Updated 2026-04-04.* |

### 10.6 Accessibility

| Requirement | Target |
|-------------|--------|
| **Standard** | WCAG 2.1 Level AA |
| **Keyboard navigation** | All interactive elements reachable and operable via keyboard. |
| **Screen reader** | Semantic HTML, ARIA labels where needed, logical heading hierarchy. |
| **Colour contrast** | Minimum 4.5:1 for normal text, 3:1 for large text. |
| **Focus indicators** | Visible focus ring on all interactive elements. |
| **Form errors** | Inline error messages associated with form fields via `aria-describedby`. |
| **Motion** | Respect `prefers-reduced-motion`. No essential info conveyed only through animation. |

### 10.7 SEO

| Requirement | Detail |
|-------------|--------|
| **Server-side rendering** | Event pages must be fully rendered on the server (SSR or SSG) for search engine crawlability. |
| **Structured data** | Event pages emit JSON-LD `Event` schema (name, date, location, ticket price, availability). |
| **Meta tags** | Unique `<title>` and `<meta description>` per event page. Open Graph + Twitter Card tags for social sharing. |
| **Sitemap** | Auto-generated `sitemap.xml` with all public event pages. |
| **Canonical URLs** | Prevent duplicate content. `<link rel="canonical">` on every page. |
| **URL structure** | Human-readable: `boletify.com/eventos/[slug]` (e.g., `/eventos/indie-fest-cdmx-2026`). |

### 10.8 Security

| Measure | Detail |
|---------|--------|
| **HTTPS everywhere** | TLS 1.2+ enforced. HSTS header. No mixed content. |
| **Content Security Policy (CSP)** | Strict CSP headers to prevent XSS. |
| **Rate limiting** | Checkout: 5 attempts/IP/minute. Login: 10 attempts/IP/minute. API: 100 requests/IP/minute. |
| **Bot protection** | CAPTCHA (Cloudflare Turnstile or hCaptcha) on checkout when sales velocity exceeds threshold. |
| **Input validation** | Server-side validation on all inputs. Parameterised queries to prevent SQL injection. |
| **CSRF protection** | Anti-CSRF tokens on all state-changing requests. |
| **Dependency scanning** | Automated vulnerability scanning in CI/CD (e.g., `npm audit`, Dependabot). |
| **Secrets management** | No secrets in code. Environment variables + secrets manager. |

---

## 11. Open Questions

> Product decisions that need founder input, user research, or downstream resolution in Phase 3/4.

### Resolved

- [x] **Payout speed:** **T+7 business days** (Stripe Mexico Connect Express default). Display "Pago estimado en 7 días hábiles" in dashboard. Faster payouts (T+2) available after account history is established. *Resolved in Phase 4 § 8.5.*
- [x] **Ticket transfers:** **No transfers for MVP.** Ticket tied to buyer email. Rationale: prevents scalping/resale, prevents chargeback fraud (buy with stolen card → transfer → dispute), preserves organiser data integrity ("tus fans, tus datos"). Post-MVP consideration: name-change transfers with organiser approval + optional fee. Defer to v1.1 based on user demand. *Resolved 2026-04-03.*
- [x] **Default refund policy:** **No refunds for buyer-initiated cancellations** (industry standard for music events). Mandatory full refund for organiser-cancelled events (LFPC legal requirement). Organisers can configure more generous policies if desired. *Resolved 2026-04-03.*
- [x] **Low-price ticket fee structure:** **Waive the flat MXN 10 fee on tickets priced MXN 100 or below.** Only the 5% percentage fee applies. For free events (MXN 0), no fee at all. This improves adoption for cultural/low-price events (Lucía persona) at minimal revenue impact. *Founder decision 2026-04-03.*
- [x] **OXXO convenience fee:** **Pass to the buyer.** Display as a separate line item at checkout: "Cargo OXXO: ~MXN 13" (exact amount depends on Stripe's OXXO processing fee). Only visible when OXXO is selected. Card and Mercado Pago do not show an additional convenience fee. *Founder decision 2026-04-03.*
- [x] **Organiser identity verification level:** **Minimal / manual for MVP.** Founders onboard organisers directly (personal relationships). Account setup done manually or via guided walkthrough. Stripe Connect Express handles KYC (government ID + CLABE) as part of payout setup — no additional verification layer from Boletify. At MVP scale (<30 organisers), every organiser is a known relationship. Automated self-serve onboarding deferred to Phase B when volume grows. *Founder decision 2026-04-03.*
- [x] **Event moderation policy:** **Relaxed. Legal compliance only.** Policy: "Any event is welcome on Boletify as long as it does not promote or facilitate illegal activity." No content-based restrictions on genre, language, or artistic expression. Note on hate speech in Mexico: not specifically criminalized as a standalone offence, but incitement to violence (Código Penal Federal Art. 208/209) and discrimination (Ley Federal para Prevenir y Eliminar la Discriminación) ARE illegal. Practical policy: no events inciting violence, no events facilitating illegal activity. Everything else is fair game. At MVP scale, all events are from known organisers (see verification above), so moderation is implicit. Formal content policy page deferred to Phase B. *Founder decision 2026-04-03.*
- [x] **Persona scoping for MVP:** **Soft CDMX focus.** ~90% of events will be CDMX. Don't reject organisers from other cities — platform is technically city-agnostic. Occasional MTY/GDL events are fine. No city-specific features or marketing outside CDMX for MVP. *Founder decision 2026-04-03.*

### Still Open

- [ ] **All-in pricing commitment:** Do we show buyers one final price (Dice model) or break out "base price + service fee" transparently? Both are honest — the question is which converts better and which organisers prefer. *Recommendation: A/B test post-MVP. For MVP, show fee as a separate line item but make it very clear upfront (no surprise at checkout).*
- [ ] **Brand visual identity:** Colour palette confirmed — purple-coral gradient (Phase 3 § 1.2). Tagline deferred (no tagline for MVP). Logo direction updated to app-icon-first (social app / iOS style). *Founder decisions 2026-04-03.*
- [ ] **All-in vs. fee breakdown pricing:** Revisit after user research Sprint 1 (§ 13.2). For now, show fee as a separate line item that's visible immediately — not hidden at checkout.
- [ ] **Payout speed SLA:** Confirm T+3 with Stripe Connect Mexico Express. If not achievable at launch, show T+5 with a commitment to move to T+3 after 90 days of account history.

---

## 12. Launch Sequencing

> Translates Phase 1 Cold-Start Playbook into product milestones. Every phase has a clear "done" gate before the next starts.

### Phase 0 — Pre-Launch: Private Beta (Weeks 1–8)

**Goal:** Validate core flows with real money and real events. Prove the product works before opening to the public.

**Supply side (organizers):**
- Target: 5 pilot organizers, recruited directly from Carlos's husband's music network (indie/rock/electronic scene, CDMX).
- All onboarded manually by the founders. No self-serve signup required.
- Organizer selection criteria: at least 2 events planned in the next 60 days, willing to give weekly feedback, comfortable being first users.

**Demand side (buyers):**
- Events are real, ticketed, open to the public — but discovered only via the organizer's own social channels.
- No public discovery feed yet. No Boletify-owned marketing.
- Target: 200–500 tickets sold across the 5 pilot events.

**Product must-haves for Phase 0:**
- All MVP flows (B1–B11, O1–O11) functional and tested.
- OXXO + Mercado Pago payment paths working end-to-end.
- At least 1 full event cycle: event created → tickets sold → day-of QR scan → payout received.
- Founders personally attend at least 2 pilot events to observe door operations.

**Done gate:** 5 events completed, at least 3 organizers willing to continue on the platform, ≥1 payout successfully sent, 0 critical payment bugs.

---

### Phase 1 — Soft Launch (Months 3–4)

**Goal:** Expand to 20–30 organizers via referral. Let product-market fit drive growth, not marketing spend.

**Supply:**
- Referral from pilot organizers ("can you recommend a friend?"). Each pilot organizer is asked to refer 2–3 peers.
- Add lightweight self-serve signup — organizers can register themselves. Founders review and approve each account for the first 60 days.
- Begin tracking Organizer Activation Rate: signup → first published event.

**Demand:**
- Launch the public homepage (S2 — Event Discovery Feed, Phase B). Basic list of upcoming events, filterable by genre and date.
- Lightweight SEO: each event page is indexable and shareable.

**Marketing unlock (PROFECO moment):** If Phase 1 coincides with months 4–6, launch the Fee Transparency Calculator (see §6.9 and Phase B roadmap). Pitch 1–3 Mexican music media outlets (Indie Rocks, NME México, Chilango) with the Ticketmaster vs. Boletify fee story.

**Done gate:** 20 organizers with ≥1 published event, 2,500 total tickets sold, first organizer cohort retention ≥ 60% (creates 2nd event within 60 days of 1st).

---

### Phase 2 — Growth (Months 5–12)

**Goal:** Hit 120 organizers, 7,000 tickets/month, and begin the path to unit-economics self-sufficiency.

**Supply:** Open self-serve signup. Reduce manual approval to flagged accounts only. Target GDL and MTY organizers opportunistically (inbound only — no outbound sales effort yet).

**Demand:** Event Discovery Feed with genre filters, SEO, and social sharing incentives (S8). Begin tracking buyer retention cohorts.

**Revenue unlock:** Turn off the launch-promo fee waiver (or adjust to a more targeted promo for new organizers only). Full 5%+MXN 10 fee becomes the default.

**Infrastructure:** Observability and alerting (Phase 4 concern, but product must define SLA requirements by month 4 for architecture to implement).

---

## 13. User Research Plan

> Research informs product decisions — especially the ones currently in "Open Questions." Each sprint is scoped to answer a specific question before the corresponding product milestone.

### 13.1 Research Principles

- **Tú no eres el usuario.** Even with a founder embedded in the scene, validate assumptions with people who aren't Carlos or his network.
- **Bias toward organizer research in Phase 0.** Organizers are the scarce side of the marketplace; their friction kills the business.
- **Triangulate:** Each insight should come from ≥2 independent sources (interview + observed behavior, or interview + analytics).
- **Document, don't just discuss.** All research findings go in a living research log (`/docs/research-log.md`).

---

### 13.2 Sprint 1 — Organizer Discovery (Before MVP Launch)

**Question:** What does the ticket-selling workflow actually look like today for indie CDMX promoters? Where does it break?

**Method:** 5 in-depth interviews (45–60 min each) with indie CDMX promoters. Semi-structured. Include at least 1 Boletia current user, 1 Instagram-DM-only seller, 1 Ticketmaster user.

**Key topics:**
- Walk me through how you set up and sell tickets for your last event.
- Where did you lose time, money, or fans?
- What does a "successful" post-event day look like for you?
- What would make you switch platforms?

**Decision this answers:** Feature priority within MVP scope. Which O-features are truly blocking vs. nice-to-have.

**Target:** Complete before Week 4 of development (while there's still time to adjust scope).

---

### 13.3 Sprint 2 — Buyer Checkout Usability (Phase 0)

**Question:** Do buyers understand the fee structure? Does the all-in price vs. fee breakdown affect conversion?

**Method:** Moderated usability test on 8 buyers (mix of Diego and Lucía profiles). Use a staging-environment prototype with a real event page. Observe the checkout flow without prompting.

**Key tasks:**
- "Find out how much a ticket to [event] costs."
- "Buy 2 tickets using OXXO."
- After checkout: "Were there any surprises in the price you paid?"

**Decision this answers:** Closes the "All-in pricing commitment" open question (§ 11). If ≥ 5/8 users are confused by the fee breakdown, switch to all-in pricing for MVP.

**Target:** Complete during Phase 0 beta (weeks 5–8).

---

### 13.4 Sprint 3 — Organizer Onboarding (Month 4)

**Question:** Where does self-serve organizer onboarding break down?

**Method:** Unmoderated task-based test (Maze or Lookback). 10 participants. Task: "Sign up as an organizer and publish your first event."

**Success metric:** Task completion rate ≥ 70%. Time-on-task < 15 minutes.

**Key drop-off points to watch:** KYC (identity verification), CLABE setup, event creation form, publish step.

**Decision this answers:** Which friction points to fix before opening self-serve signup in Phase 1.

**Target:** Run during month 3 (pre-Phase 1 launch).

---

### 13.5 Research Backlog (Post-MVP)

| Research Question | Method | When |
|------------------|--------|------|
| Why do organizers churn after 1 event? | Exit interviews (organizers who created ≥1 event but didn't create a second within 90 days) | Month 6 |
| What makes buyers return to the platform vs. just to the organizer? | Buyer survey after 2nd purchase | Month 6 |
| Is there demand for a Boletify mobile app? | In-app prompt + survey (buyers and organizers) | Month 9 |
| Is the multi-city expansion (GDL/MTY) supply-led or demand-led? | Inbound interest analysis + 5 GDL organizer interviews | Month 10 |
| Do cultural programmers (Lucía) need a fundamentally different product? | 3 in-depth interviews with cultural centre programmers | Month 8 |

