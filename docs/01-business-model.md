# Phase 1 — Business Model & Opportunity

> **Status:** 🟡 In Progress — assumptions unvalidated; co-founder terms and entity structure open
> **Owner Hat:** CFO / Strategist
> **Upstream Input:** None (this is the first phase)
> **Downstream Consumer:** [Phase 2 — Product Design](02-product-design.md)

---

## Purpose

Define *what* business Boletify is in, *why* the opportunity exists, and *how* it will make money. This document is the foundation every subsequent phase builds on.

---

## Table of Contents

1. [Founding Team](#1-founding-team)
2. [Market Research](#2-market-research)
3. [Problem Statement](#3-problem-statement)
4. [Business Model Canvas](#4-business-model-canvas)
5. [Lean Canvas](#5-lean-canvas)
6. [Revenue Model & Pricing Strategy](#6-revenue-model--pricing-strategy)
7. [Competitive Landscape](#7-competitive-landscape)
8. [Key Assumptions & Validation Plan](#8-key-assumptions--validation-plan)
9. [Regulatory & Compliance Considerations](#9-regulatory--compliance-considerations)
10. [Go-to-Market Hypothesis](#10-go-to-market-hypothesis)
11. [Key Metrics & Success Criteria](#11-key-metrics--success-criteria)
12. [Risk Register](#12-risk-register)
13. [Open Questions](#13-open-questions)
14. [References](#14-references)

---

## 1. Founding Team

> **Why this section exists:** Investors and early partners bet on the team before the idea. Boletify's founding story is inseparable from its unfair advantage.

### 1.1 Founder

| Attribute | Detail |
|-----------|--------|
| **Name** | Carlos (founder & CEO) |
| **Role** | Product, engineering, and strategy — solo technical founder |
| **Location** | Mexico City (CDMX) |
| **Background** | Software engineer with full-stack experience. Builds the product himself — no outsourced dev, no agency dependency. Direct cost control and engineering speed are meaningful advantages at this stage. |
| **Cultural fit** | Middle-class, Mexico City native. Attends indie events regularly. Intimately familiar with the friction of buying tickets on platforms that were not designed for this market. |
| **Domain access** | Partner is a working musician active in the CDMX indie scene. This provides direct, trusted relationships with the exact promoter and venue audience Boletify needs to acquire first — not as leads, but as people who will give honest product feedback and refer peers. |

### 1.2 Why This Team Wins the Early Market

The single most credible signal a pre-product startup can offer is that the founder *lives inside the problem*. Carlos is a ticket buyer who has felt the hidden fees. His partner is a working artist who has navigated the organiser side. Combined, they have personal networks that map directly onto Boletify's two-sided early-adopter target — indie music promoters and digitally native fans in CDMX. This is not a team that is guessing at the problem; they are the problem's target user.

### 1.3 Team Gaps & Mitigation

| Gap | Mitigation |
|-----|-----------|
| **No dedicated sales / BD person** | Founder will own organiser outreach during MVP phase; partner's network reduces cold-outreach burden. |
| **No finance / legal co-founder** | Engage a Mexican tax advisor and corporate lawyer on a retainer basis pre-launch. |
| **Solo founder execution risk** | Prioritise ruthlessly; scope MVP to what one engineer can ship in 3–4 months. Document decisions so a future co-founder or first hire can onboard quickly. |
| **Potential co-founders under consideration** | Two potential partners identified; formalise terms and contribution expectations before any product equity is granted. |

---

## 2. Market Research

### 1.1 Industry Overview

The global event-ticketing market was valued at approximately **USD 85–90 billion in 2025** and is projected to reach **USD 120–130 billion by 2030**, growing at a CAGR of ~6–8 %. *(Sources: Grand View Research "Event Tickets Market" 2024; Statista "Ticketing Revenue Worldwide" 2025.)*

**Latin America** accounts for roughly **5–7 % of global ticket revenue** (~USD 4.5–6 B). Brazil and Mexico together represent over **60 %** of that share. Mexico's live-entertainment ticketing market is estimated at **USD 1.5–2 B** (2025), buoyed by a population of 130 M+, a young median age (~29), and rising smartphone penetration (~85 %).

**Key trends (2025–2026):**

| Trend | Detail |
|-------|--------|
| **Digital-first / mobile ticketing** | Paper and will-call are nearly extinct. QR/NFC mobile tickets are the default; Apple Wallet / Google Wallet integration is expected. |
| **Post-pandemic recovery completed** | Live-event attendance surpassed 2019 levels by mid-2024. Pent-up demand has normalised into a new, higher baseline. |
| **Dynamic & surge pricing** | Adopted by Ticketmaster ("Official Platinum") and increasingly by mid-market platforms. Controversial but effective at capturing willingness-to-pay. |
| **Anti-scalping technology** | Governments (UK DCMS Act 2025, US state bills, Mexico NOM discussions) pushing for identity-linked or non-transferable tickets. |
| **Creator/promoter self-service** | Eventbrite, Dice, Luma, and others empower organisers to self-list and manage events without intermediary. |
| **Embedded finance & BNPL** | "Pay in 3/4" instalments (Klarna, Mercado Crédito, Kueski Pay) integrated at checkout. |
| **NFT/blockchain tickets** | Hype cooled significantly; practical adoption limited to niche use cases (collectible stubs, royalty splits). Not a market driver. |

### 1.2 TAM / SAM / SOM

| Level | Definition | Estimate | Rationale |
|-------|-----------|----------|-----------|
| **TAM** | Global online event-ticketing revenue | **~USD 90 B** (2025) | Grand View Research; includes primary + secondary, all verticals, all geographies. |
| **SAM** | Mexico + select LatAm (Colombia, Chile, Argentina) online primary ticketing | **~USD 2.5–3.5 B** | Mexico ~USD 1.5–2 B + secondary markets. Excludes resale; excludes sports leagues with exclusive deals. |
| **SOM** | Capturable share in first 3 years (indie/mid-size events in Mexico) | **~USD 8–15 M** (~0.3–0.5 % of SAM) | New entrant can realistically capture small/mid-tier organiser segment by year 3 with competitive fees and strong local UX. Benchmark: Boletia reportedly processes low tens of millions annually. |

### 1.3 Target Segments

**Side A — Event Organisers (B2B):**

- Independent promoters and producers (50–5,000 capacity events)
- Music venues and bars with recurring programming
- Conference & corporate-event organisers
- Cultural institutions (theatres, museums, festivals)
- Universities and student organisations

**Side B — Ticket Buyers (B2C):**

- Urban millennials & Gen-Z (18–40) in Mexico City, Guadalajara, Monterrey
- Digital-native, mobile-first, accustomed to Mercado Pago / OXXO payments
- Value transparency (no surprise fees at checkout)

**Vertical priority:** Music (concerts & festivals) → Theatre & performing arts → Conferences & corporate → Sports (deferred — exclusive league deals create high barriers to entry)

---

## 3. Problem Statement

### For Event Organisers

| # | Pain Point | Detail |
|---|-----------|--------|
| 1 | **High & opaque fees** | Ticketmaster charges 20–30 % all-in (service fee + order processing + facility fee). Eventbrite charges 3.7 % + USD 1.79 per ticket + payment processing. These stack up and are poorly explained to organisers, who often bear pass-through costs. |
| 2 | **Loss of customer data** | On major platforms, the ticket buyer is the *platform's* customer, not the organiser's. Organisers get limited data export, no CRM integration, and can't retarget their own audience. |
| 3 | **Slow payouts** | Many platforms hold funds 5–15 business days post-event. For cash-strapped indie promoters, this creates real working-capital pressure. |
| 4 | **Lack of localisation** | Global platforms treat LatAm as an afterthought: limited Spanish-language support, no OXXO/convenience-store payment, poor understanding of local promoter workflows. |
| 5 | **Inflexible tooling** | Self-service platforms offer rigid templates. Organisers want branded event pages, flexible seating charts, promo-code logic, and instalment-payment support. |

### For Ticket Buyers

| # | Pain Point | Detail |
|---|-----------|--------|
| 1 | **Hidden fees revealed at checkout** | The #1 consumer complaint in ticketing globally. "Drip pricing" leads to 25–40 % price increases between browsing and payment. |
| 2 | **Scalping & bots** | High-demand events sell out in seconds to automated buyers; genuine fans are pushed to resale at 2–5× markups. |
| 3 | **Poor mobile experience** | Many LatAm platforms have slow, non-responsive mobile sites. Crashes during high-demand on-sales are common (Ticketmaster Mexico / SuperBoletos). |
| 4 | **Limited payment options** | Not everyone in Mexico has a credit card (~35 % bancarisation). Platforms that only accept cards exclude a massive segment. OXXO pay, SPEI, Mercado Pago, and cash-at-store are essential. |
| 5 | **No post-purchase relationship** | Buyers get a confirmation email and nothing else. No personalised recommendations, no event-day info push, no community features. |

---

## 4. Business Model Canvas

| Block | Description |
|-------|-------------|
| **Key Partners** | Payment processors (Stripe Mexico, Conekta, Mercado Pago), venue operators, independent promoters, OXXO (cash payments), marketing/media partners (Spotify, Instagram), infrastructure providers (AWS/Vercel), print/wristband fulfilment vendors. |
| **Key Activities** | Platform development & maintenance, event-organiser onboarding & success, payment processing & fraud prevention, marketing & demand generation, customer support (bilingual ES/EN), data analytics for organisers. |
| **Key Resources** | Engineering team (TypeScript full-stack), brand & domain (boletify.com), organiser relationships, buyer audience/email list, transaction data & recommendation engine. |
| **Value Propositions** | *For organisers:* Lower transparent fees; faster payouts (next-day or T+2); full customer-data ownership; branded event pages; local payment methods out-of-the-box; bilingual platform. *For buyers:* All-in pricing (no hidden fees); mobile-first UX; OXXO/SPEI/card/BNPL payment options; anti-scalp protections (queue, identity-link); event discovery & recommendations. |
| **Customer Relationships** | Self-service dashboard for small organisers; dedicated account management for high-volume organisers; automated buyer communications (confirmation, reminders, post-event surveys); community & social features (share, invite friends). |
| **Channels** | Web app (responsive PWA), native-like mobile experience, social-media embeds & widgets, organiser API for white-label integration, SEO/content marketing (event discovery), partnership referrals. |
| **Customer Segments** | Primary: Independent event organisers in Mexico (50–5,000 cap). Secondary: Ticket buyers aged 18–40 in major Mexican metros. Tertiary (future): Mid-size promoters, corporate-event planners, LatAm expansion. |
| **Cost Structure** | Engineering salaries (largest), cloud infrastructure (AWS/Vercel), payment-processing fees (~2.9 % + pass-through), customer support, marketing & user acquisition, legal & compliance, office/ops overhead. |
| **Revenue Streams** | Per-ticket service fee (primary), payment-processing margin, organiser subscription tiers (premium features), promoted-event listings (advertising), ancillary (merchandise add-ons, ticket insurance). |

---

## 5. Lean Canvas

| Block | Description |
|-------|-------------|
| **Problem** | 1) High & opaque ticketing fees hurt organisers and anger buyers. 2) Organisers lose ownership of their audience data. 3) LatAm buyers lack local payment options and Spanish-first UX. |
| **Existing Alternatives** | Ticketmaster Mexico (dominant, expensive, poor UX), Boletia (local but limited features & scale), Eventbrite (English-centric, weak local payments), manual sales via social media / WhatsApp / spreadsheets. |
| **Solution** | 1) Transparent, all-in pricing with competitive fees (target ≤ 10 % total buyer cost). 2) Organiser dashboard with full CRM data export, audience analytics, and remarketing tools. 3) Mexico-native: OXXO, SPEI, Mercado Pago, and BNPL baked in; 100 % Spanish-first. |
| **Key Metrics** | Gross Merchandise Volume (GMV), number of events listed, tickets sold per month, organiser retention rate, buyer repeat-purchase rate, Net Promoter Score (NPS), average revenue per ticket. |
| **Unique Value Proposition** | *"The ticketing platform that puts organisers and fans first — transparent pricing, local payments, and your data stays yours."* |
| **High-Level Concept** | "Eventbrite meets Mercado Libre for live events in Latin America." |
| **Unfair Advantage** | (1) **Founder insider access:** Solo technical founder whose partner is a working musician in the CDMX indie scene — direct, trusted relationships with the exact early-adopter segment. Cold outreach is not needed to get the first 10 organisers. (2) **Data-ownership philosophy as brand pillar:** Incumbents (Ticketmaster, Eventbrite) cannot offer organisers full data ownership without cannibalising their own audience-monetisation business. This is a structural constraint, not a feature gap. (3) **Local-first from day one:** OXXO, SPEI, and Mercado Pago integration built before launch — not bolted on later. Foreign competitors treat this as an edge case; we treat it as the default. |
| **Channels** | Organic search (SEO for "[city] + events"), social media (Instagram, TikTok, X), organiser referrals & word-of-mouth, strategic partnerships with venues & promoter collectives, content marketing (event-planning guides). |
| **Customer Segments** | Early adopters: Independent music promoters & small venue operators in Mexico City, Guadalajara, Monterrey. Mass market (later): Mid-size festivals, theatre companies, corporate events, LatAm expansion. |
| **Cost Structure** | Fixed: Engineering team (~60 % of burn), office, legal. Variable: Payment processing (~2.9 % of GMV), cloud hosting (scales with traffic), marketing spend, customer support headcount. |
| **Revenue Streams** | Service fee per ticket (primary, ~4–8 % of face value), payment processing spread (~0.5–1 % margin), premium organiser subscriptions (analytics, custom branding, priority support), promoted listings, ancillary add-ons (ticket insurance, merch). |

---

## 6. Revenue Model & Pricing Strategy

### 5.1 Revenue Streams

1. **Service fee per ticket sold** — Core revenue. Charged as a % of ticket face value + small fixed fee.
2. **Payment-processing margin** — Pass through at cost + small spread (e.g., charge organiser 3.9 %, pay processor 2.9 %, keep 1 %).
3. **Organiser subscriptions** — Free tier (basic), Pro tier (~USD 30/mo: custom branding, advanced analytics, priority payouts), Enterprise (custom pricing: API access, dedicated support, SLA).
4. **Promoted event listings** — Organisers pay to boost visibility in discovery feed / email digests.
5. **Ancillary** — Ticket-protection/refund insurance (partner with insurer, earn commission), merchandise add-on at checkout, on-site upgrades (VIP, parking).

### 5.2 Pricing Benchmarks

| Platform | Market | Fee to Buyer | Fee to Organiser | Payout Speed | Notes |
|----------|--------|-------------|------------------|-------------|-------|
| **Ticketmaster** | Global | 15–25 % of face value (service + order + facility fees) | Negotiated per deal; often 0 % for large promoters (fees pushed entirely to buyers) | Negotiated, often post-event | Dominant; exclusive venue contracts. |
| **Eventbrite** | Global | Free or up to 7.9 % + USD 0.99 depending on organiser plan | 3.7 % + USD 1.79/ticket (Essentials); 6.2 % + USD 1.59 (Professional) | 4–5 business days | Self-service leader; weaker in LatAm. |
| **Dice** | US/UK/EU | 0 % (all-in pricing shown to fan) | ~10 % commission on face value | Post-event + 2–5 days | Fan-first brand; no resale, waitlist model. |
| **StubHub** | Global (resale) | ~10–15 % buyer fee | ~15 % seller fee | After event delivery confirmed | Secondary market; high margins, trust issues. |
| **Boletia** | Mexico | ~10 % service fee on buyer | ~3–5 % on organiser | ~7–10 business days | Best-known local player; limited feature set, slow innovation. |
| **Passline** | Mexico/LatAm | ~8–12 % service fee | Negotiated | Variable | Focused on nightlife & clubs. |

### 5.3 Proposed Pricing Model (Hypothesis)

| Component | Rate | Who Pays | Rationale |
|-----------|------|----------|-----------|
| **Service fee** | 5 % of face value + MXN 10 (~USD 0.55) per ticket | Buyer (shown all-in). Organiser can optionally absorb. | Undercuts Boletia (~10 %) and Ticketmaster (~20 %). Fixed component covers micro-ticket economics. |
| **Payment processing** | 3.9 % of transaction | Organiser (or absorbed into service fee — organiser's choice) | Market-rate pass-through with ~1 % margin for Boletify. |
| **Free organiser tier** | USD 0/mo | — | Basic event creation, standard analytics, Boletify-branded page, payouts in T+5 days. |
| **Pro organiser tier** | ~USD 29/mo (MXN 500) | Organiser | Custom branding, advanced analytics, CRM export, T+2 payouts, promo-code engine, priority support. |
| **Enterprise tier** | Custom pricing | Organiser | API access, white-label, SLA, dedicated account manager. |
| **Promoted listings** | CPC or flat per campaign | Organiser | Starting at MXN 200/campaign; pay-per-click on discovery pages. |

**Rationale:** Aggressively low buyer-facing fees to drive adoption and word-of-mouth ("finally, a platform without surprise fees"). Revenue is balanced across volume-based service fees and subscription upsells. The all-in pricing philosophy (à la Dice) becomes a brand differentiator in a market where hidden fees are the norm.

---

## 7. Competitive Landscape

| Competitor | Market | Model | Strengths | Weaknesses |
|-----------|--------|-------|-----------|------------|
| **Ticketmaster / CIE (Mexico)** | Mexico & Global | Primary ticketing, exclusive venue deals, B2B2C | Dominant market share; exclusive contracts with major venues (Auditorio Nacional, Foro Sol); Live Nation vertical integration (promotion + venue + ticketing). | Extremely high fees; terrible consumer UX; frequent site crashes during on-sales; monopolistic reputation; weak self-service for small organisers. |
| **Eventbrite** | Global (US-centric) | Self-service primary ticketing, freemium SaaS | Strong brand; easy onboarding; good API & integrations; global reach. | English-first; OXXO/SPEI not supported natively; limited discovery for buyers; LatAm is an afterthought; pricing has increased. |
| **Dice** | US, UK, EU (expanding) | Commission-based primary; no resale, waitlist-only returns | Best-in-class fan UX; all-in pricing; anti-scalp (non-transferable tickets); strong music-industry relationships. | Not in LatAm; no local payment methods; 10 % commission can be high for small organisers; limited event types (music-focused). |
| **StubHub** | Global | Secondary-market (resale) marketplace | Huge liquidity; buyer guarantee; global brand. | Not a primary-sale platform; high combined fees (25–30 %); reputational issues with scalpers; regulatory risk. |
| **Boletia** | Mexico | Primary ticketing, self-service | Local brand recognition; Spanish-first; OXXO payments. | Slow feature development; limited analytics; dated UI/UX; slow payouts; limited API; small engineering team. |
| **Passline** | Mexico / LatAm | Primary ticketing, nightlife focus | Strong in nightlife/club segment; local payment support. | Narrow vertical; limited self-service; brand not known outside nightlife. |
| **SuperBoletos** | Mexico (regional) | Primary ticketing | Strong in northern Mexico markets (Monterrey). | Regional only; limited tech investment; not competitive nationally. |
| **Tiquetes / TicketPlus / Livepass** | Various LatAm | Primary ticketing | Local market presence in Colombia, Central America, etc. | Small scale; limited tech; not present in Mexico. |

### 6.1 Differentiation Strategy

- **Where we compete:** Self-service primary ticketing for small-to-mid event organisers — the "Boletia/Eventbrite" tier. We win on transparent pricing, local payments, and organiser data ownership.
- **Where we intentionally don't compete (initially):** Exclusive major-venue contracts (Ticketmaster/CIE territory — requires capital and political relationships we don't have at launch); secondary/resale market (regulatory complexity, ethical concerns); pure nightclub table-booking (Passline niche).
- **Positioning wedge:** *"The honest ticketing platform."* All-in pricing, organiser-owned data, fastest payouts, Mexico-first product built on modern tech.

---

## 8. Key Assumptions & Validation Plan

> These are the beliefs the business model rests on. If any one of them is materially wrong, the strategy needs to change. None have been validated through primary research yet — this section tracks what to test and how.

| # | Assumption | Why It Matters | Validation Method | Status |
|---|-----------|---------------|-------------------|--------|
| A1 | Indie promoters will switch platforms for a total buyer cost of ≤ 10 % (vs. Boletia's ~10 % + slower payouts) | Core revenue and adoption hypothesis | Interview 10 promoters: "At what fee level would you try a new platform? What else would it need?" | ⏳ Not yet |
| A2 | All-in pricing (no drip fees) meaningfully improves buyer conversion | Differentiates us from every competitor; also a brand pillar | A/B test at launch: show all-in price vs. base-then-fee flow on a real event; measure drop-off | ⏳ Not yet |
| A3 | T+2 payouts are a strong enough differentiator to drive organiser choice | If promoters don't care about payout speed, we lose this as a wedge | Ask directly in organiser interviews: rank these five platform attributes by importance | ⏳ Not yet |
| A4 | OXXO + SPEI payment support drives a meaningful conversion lift (est. +15–25 %) | Justifies integration complexity and is a moat against foreign competitors | Compare checkout completion rates by payment method once live; pre-validate via promoter survey ("what % of your audience pays cash or SPEI?") | ⏳ Not yet |
| A5 | Average indie event in CDMX has 150–400 attendees at MXN 250–500 face value | Underpins all GMV and revenue-per-ticket projections | Pull public data from Boletia / Eventbrite Mexico listings; cross-check with 5 promoter interviews | ⏳ Not yet |
| A6 | Organiser quarterly retention of ≥ 60 % is achievable in year 1 | Determines LTV and whether the business is sustainable | Track in product post-launch; proxy pre-launch: ask promoters "how many platforms have you used in the last 12 months and why did you leave?" | ⏳ Not yet |
| A7 | Carlos's partner's network can deliver ≥ 5 committed organiser pilots pre-launch | De-risks cold start; these 5 events are the proof-of-concept | Explicit ask — map network contacts, identify who produces events commercially, have conversations before a line of code is written | ⏳ Not yet |
| A8 | Organiser CAC of ≤ MXN 2,000 is achievable primarily through word-of-mouth and direct outreach | If CAC is 3–5× higher, bootstrapped go-to-market doesn't pencil out | Track source of every organiser acquired in first 6 months; compute blended CAC by channel | ⏳ Not yet |
| A9 | The platform can handle a 500-concurrent-user on-sale event without degraded performance on a bootstrap infrastructure budget | A single public crash destroys trust and is nearly unrecoverable for a new brand | Load test before first high-demand event; instrument Vercel / DB latency; define SLA thresholds | ⏳ Not yet |

### 8.1 Validation Priorities

Run these in order — each informs the next:

1. **Promoter interviews (5–10 people, this month):** Use partner's network. Goal: validate A1, A3, A5, A7 in a single conversation guide.
2. **Buyer payment-method survey (50 responses):** Post in relevant CDMX event / music communities. Goal: validate A4.
3. **Competitive pricing audit:** Mystery-shop Boletia and Eventbrite Mexico with a real event to understand true all-in costs. Goal: sharpen A1.
4. **Load test (pre-launch):** Before any public event goes on sale. Goal: validate A9.
5. **A/B pricing test (at launch):** Goal: validate A2 with real conversion data.

---

## 9. Regulatory & Compliance Considerations

### 7.1 Ticket Resale — Mexico

Mexico's *Ley Federal de Protección al Consumidor (LFPC)* includes provisions against abusive pricing. PROFECO (consumer-protection agency) has intervened in ticket-resale controversies (e.g., Luis Miguel tours). There is no blanket federal ban on resale, but state-level regulations are emerging (CDMX has discussed capping resale markups).

> **Recommendation:** Launch as primary-only. If resale is added later, implement price caps (e.g., max 20 % above face value).

### 7.2 Consumer Protection

Under LFPC, buyers have the right to a full refund if an event is cancelled. Clear cancellation/refund policies must be displayed. Advertising must not be misleading — all-in pricing actually helps compliance here.

### 7.3 Data Privacy — Mexico

*Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)* requires:

- Privacy notice (*aviso de privacidad*) before collecting personal data
- Explicit consent for marketing communications
- Data-subject rights: access, rectification, cancellation, opposition ("ARCO rights")
- Registration with INAI if processing sensitive data

> **Action:** Legal review of privacy notice and consent flows before launch.

### 7.4 Data Privacy — International (Future)

If expanding to users in EU (GDPR) or California (CCPA/CPRA), additional compliance layers are needed. Not required for Mexico-only MVP.

### 7.5 PCI-DSS

Using Stripe/Conekta as a PCI Level 1 processor means Boletify can operate as a **SAQ-A merchant** (no card data touches our servers if using hosted payment fields / Stripe Elements).

> **Action:** Ensure architecture never stores raw card data; use tokenised payment flows exclusively.

### 7.6 Tax — Mexico

Service fees are subject to **IVA (16 %)**. Boletify must issue *facturas* (CFDIs) for service fees. If operating as an intermediary, specific SAT rules on *comisionistas* may apply.

> **Action:** Engage a Mexican tax advisor to structure the entity (likely a *Sociedad por Acciones Simplificada (S.A.S.)* or *S.A. de C.V.*) and ensure proper CFDI issuance.

### 7.7 Accessibility

Mexico doesn't have a direct equivalent of ADA/WCAG mandates for private websites, but building to **WCAG 2.1 AA** is best practice, supports future international expansion, and aligns with inclusive design principles.

### 7.8 Anti-Money Laundering (AML)

High-volume payment platforms may trigger *Ley Federal para la Prevención e Identificación de Operaciones con Recursos de Procedencia Ilícita* obligations if exceeding certain transaction thresholds.

> **Action:** Monitor thresholds and register with the *Portal de Prevención de Lavado de Dinero* as needed.

---

## 10. Go-to-Market Hypothesis

### 8.1 Launch Market

- **Geography:** Mexico — specifically **Mexico City (CDMX)**, with secondary beachheads in **Guadalajara** and **Monterrey**. CDMX alone has ~22 M metro population, the highest density of live events, and the most active indie-promoter community.
- **Vertical:** **Live music** (concerts, indie gigs, small festivals) as the primary vertical. Music has the highest ticket volume, the most emotionally engaged buyers, and the strongest word-of-mouth dynamics. Theatre & cultural events as a parallel soft-launch vertical (lower volume but high organiser loyalty and willingness to try new tools).

### 10.2 Early Adopter Profile

- **Organiser archetype:** Independent music promoters producing 2–10 events/month at venues with 100–2,000 capacity. Currently using Boletia, Eventbrite, or selling via Instagram DMs + bank transfers. Frustrated by fees, slow payouts, and lack of data.
- **Buyer archetype:** 20–35-year-old professionals and students in CDMX, digitally savvy, active on Instagram/TikTok, attend 1–4 live events per month. Has Mercado Pago, may not have a credit card.
- **First 100 organisers:** Direct outreach via the CDMX indie-music scene. Attend events, build relationships at industry meetups (e.g., FIMPRO, music-industry networking events). Offer **0 % service fee for the first 3 months** or first 500 tickets to drive adoption.

### 10.3 Cold Start Playbook

Two-sided marketplaces die without a deliberate sequencing strategy. Supply (organisers) must come before demand (buyers) — buyers only show up where events are.

**Phase 0 — Pre-launch supply lock-in (weeks 1–8):**
- Map every promoter and musician in the founder's direct network. Target: identify 10 candidates, commit 5 as pilot organisers before any public launch.
- Offer pilot organisers: 0 % service fee for their first 3 events, dedicated support from the founder personally, and a co-branded launch moment ("Boletify's first event").
- Goal: have ≥ 3 events scheduled and ticketed on the platform before any public announcement.

**Phase 1 — Controlled launch (weeks 9–16):**
- Announce via the pilot organisers' own channels — they already have audiences. Boletify's first buyers come in through organiser word-of-mouth, not Boletify's own marketing.
- Founder personally attends the first 5 events. Talk to buyers in the queue. This is product research disguised as community building.
- Target: 500 tickets sold across ≥ 3 events before scaling outreach.

**Phase 2 — Organic expansion (month 3+):**
- Every satisfied organiser is asked for a referral to one other promoter. Structured referral ask, not passive.
- Build the discovery layer (SEO, events feed) to start capturing buyer-side organic traffic.
- Expand to 2nd-degree network: friends-of-friends in the CDMX music scene.

**The single biggest cold start risk:** An organiser lists their first event, it underperforms (few tickets sold), and they blame the platform. Mitigation: for pilot events, the founder actively helps promote the event — shares on personal channels, coordinates with the organiser on their launch strategy. The platform's job at this stage is to make the organiser look good, not just process tickets.

### 10.4 Growth Levers

1. **Organiser word-of-mouth** — Satisfied organisers are the #1 growth channel. Every organiser brings their audience to the platform.
2. **Buyer-side SEO / discovery** — Rank for "[city] + events this weekend" queries. Build a discovery layer that drives organic traffic.
3. **Social sharing** — Make ticket purchases inherently shareable (Instagram Stories integration, "I'm going" widgets, referral discounts — "share with a friend, both get 10 % off").
4. **Promo partnerships** — Co-marketing with venues, bars, cultural publications (e.g., TimeOut México, Chilango, Indie Rocks!).
5. **Organiser referral programme** — Existing organisers who refer new organisers get fee credits.
6. **Content marketing** — Event-planning guides, "how to sell more tickets" blog, organiser success stories — positions Boletify as a thought leader and drives SEO.

---

## 11. Key Metrics & Success Criteria

| Metric | Target (6 months) | Target (12 months) | Notes |
|--------|-------------------|---------------------|-------|
| **Gross Merchandise Volume (GMV)** | MXN 5 M (~USD 275 K) | MXN 25 M (~USD 1.4 M) | Total face-value of tickets sold through platform. |
| **Events listed** | 150 | 800 | Cumulative events created on platform. |
| **Tickets sold** | 15,000 | 80,000 | Cumulative tickets transacted. |
| **Active organisers** | 30 | 120 | Organisers with ≥ 1 event in last 90 days. |
| **Organiser retention (quarterly)** | 60 % | 75 % | % of organisers who list again within 90 days. |
| **Buyer repeat-purchase rate** | 15 % | 25 % | % of buyers who purchase again within 90 days. |
| **Average revenue per ticket** | MXN 25 (~USD 1.40) | MXN 30 (~USD 1.65) | Blended across service fee + processing margin. |
| **Net revenue** | MXN 375 K (~USD 21 K) | MXN 2.4 M (~USD 132 K) | Service fees + subscriptions + other. |
| **NPS (buyer)** | ≥ 40 | ≥ 50 | Survey sample of ≥ 100 buyers. |
| **NPS (organiser)** | ≥ 50 | ≥ 60 | Survey sample of ≥ 20 organisers. |
| **Site uptime** | 99.5 % | 99.9 % | Critical for on-sale credibility. |
| **Customer Acquisition Cost (organiser)** | ≤ MXN 2,000 | ≤ MXN 1,500 | Blended across all channels. |

### 11.1 Unit Economics Model

> Assumptions: average ticket face value MXN 350, service fee 5 % + MXN 10, processing margin ~1 %, average organiser runs 3 events/month at 200 tickets each. All figures are estimates pending primary research (see §8).

**Per-ticket economics:**

| Line Item | Amount (MXN) | Notes |
|-----------|-------------|-------|
| Average face value | 350 | Mid-range indie concert; validate via §8 A5 |
| Service fee (5 % + MXN 10) | 27.50 | Shown all-in to buyer |
| Processing margin (~1 %) | 3.50 | After paying Stripe/Conekta ~2.9 % |
| **Gross revenue per ticket** | **~31** | Blended |
| Cost to serve (hosting, fraud, support) | ~5 | Scales with volume, not linearly |
| **Contribution margin per ticket** | **~26** | ~84 % CM |

**Organiser LTV (12-month cohort):**

| Parameter | Value | Notes |
|-----------|-------|-------|
| Events/month | 3 | Typical active indie promoter |
| Tickets/event | 200 | Validate via A5 |
| Monthly revenue per organiser | MXN 18,600 | 600 tickets × MXN 31 |
| Assumed 12-month retention | 70 % | Per metric target |
| **LTV (12 months)** | **~MXN 156,000** | ~USD 8,600 |
| Target organiser CAC | MXN 2,000 | |
| **LTV:CAC ratio** | **~78×** | Extremely healthy if retention holds |
| **CAC payback period** | **< 1 month** | |

**Key sensitivity:** LTV:CAC collapses if organiser retention drops below 30 % or average event size is below 80 tickets. Both are worth validating before investing in any paid acquisition.

---

## 12. Risk Register

> Ranked by impact × likelihood. Each risk has a named mitigation — not just an acknowledgement.

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| R1 | **Cold start failure** — Organisers join but events undersell; they churn before buyers build up. | High | Critical | Founder personally supports promotion of first 5 events. Don't launch publicly until ≥ 3 events have successfully sold ≥ 100 tickets each. |
| R2 | **Platform crash on high-demand on-sale** — A single visible failure (à la Ticketmaster) destroys trust permanently for a new brand. | Medium | Critical | Load test before every first-time organiser's debut. Use Vercel edge + DB connection pooling. Define a public-status page from day one. |
| R3 | **Competitor copies local payments** — Eventbrite or a funded competitor adds OXXO/SPEI integration within 6–12 months, eliminating that differentiator. | High | High | Accelerate. Differentiators that can be copied are not moats; compound the data-ownership and community advantages that are structurally harder to replicate. Lock in organiser relationships before a competitor can. |
| R4 | **Working capital squeeze from faster payouts** — T+2 payout promises create a cash-flow gap if GMV grows faster than the bank balance. | Medium | High | Launch with T+5 payouts. Move to T+2 only after securing a credit facility or reaching sustainable GMV. Do not promise T+2 in marketing until treasury can support it. |
| R5 | **Payment processor disruption** — Stripe or Conekta rate change, account suspension, or outage. | Low | High | Integrate a second processor (Mercado Pago as fallback) before reaching MXN 1 M GMV. Never depend on a single payment rail. |
| R6 | **Regulatory exposure on intermediary tax treatment** — SAT reclassifies Boletify as a *comisionista* subject to different IVA obligations. | Low | High | Engage a Mexican tax advisor before first ticket sale. Structure CFDI issuance correctly from day one — retroactive compliance is expensive. |
| R7 | **Key-person risk** — Solo founder illness, burnout, or departure stalls the company entirely. | Medium | High | Document architecture, vendor relationships, and operational runbooks continuously. Prioritise finding a co-founder or first technical hire once MVP is generating MXN 50 K+/month in GMV. |
| R8 | **Scope creep delays MVP** — Feature additions push launch date out; competitors move faster. | High | Medium | Hard-freeze MVP scope (defined in Phase 2). Anything not in MVP goes to a backlog with explicit prioritisation criteria. Ship a working product over a complete product. |

---

## 13. Open Questions

> Resolved items are checked. Open items need founder input, research, or legal opinion before this document is fully finalised.

**Resolved:**
- [x] **Geographic scope at launch:** CDMX only for MVP. Expansion to GDL, MTY planned post-traction.
- [x] **Primary-only vs. resale:** Strictly primary at launch and near-term.
- [x] **First vertical:** Music-only for MVP; theatre and conferences deferred.
- [x] **Founding network:** Founder's partner is active in CDMX indie music scene — direct access to pilot organiser candidates.
- [x] **Starting capital / runway:** Fully bootstrapped. No paid marketing at launch. MVP must be shippable by one engineer.
- [x] **Free-event support:** Yes — RSVP-only events supported to drive early organiser adoption.
- [x] **Branded vs. white-label:** Boletify-branded at launch; white-label deferred to Pro/Enterprise tier.

**Open:**
- [ ] **Assumption validation (§8):** All 9 assumptions are unvalidated. Begin organiser interviews before any further product investment.
- [ ] **Entity structure:** S.A.S. vs. S.A. de C.V. — engage corporate lawyer once co-founder situation is resolved.
- [ ] **Co-founder terms:** Two potential partners identified. Define roles, equity, and vesting before any product equity is granted. This is time-sensitive.
- [ ] **All-in pricing commitment:** Preferred approach, but validate with organisers before locking in (see A1, A2 in §8).
- [ ] **Payout speed (T+2 vs. T+5):** Validate cash-flow model before promising T+2. Launch with T+5; upgrade after GMV justifies it (see R4 in §12).
- [ ] **Fundraising trigger:** Define the GMV / organiser-count milestone at which to begin investor conversations. Current hypothesis: raise after 12 months of product data.

---

## 14. References

- Grand View Research — *"Event Tickets Market Size, Share & Trends Analysis Report,"* 2024
- Statista — *"Revenue of the ticketing market worldwide from 2019 to 2029,"* 2025
- PwC — *Global Entertainment & Media Outlook 2025*
- PROFECO (Mexican Federal Consumer Protection Agency) — consumer-rights guidelines
- INAI (Mexican National Institute for Transparency) — LFPDPPP guidelines
- SAT Mexico — regulations on intermediary (*comisionista*) tax treatment
- Stripe Mexico, Conekta, Mercado Pago — published fee schedules (2025)
- Eventbrite Investor Relations — pricing page & SEC filings
- Dice.fm — published organiser terms
- Ticketmaster Mexico / CIE — published fee disclosures
- Boletia.com — published pricing page

