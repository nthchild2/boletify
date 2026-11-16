# Boletify Design System — "Brutal-Glass · Ánima Nocturna"

> The brand and component system for **Boletify**, a Mexican event-ticketing
> platform for independent music. This project lets design agents build
> on-brand interfaces, slides, and assets for Boletify — for production code or
> throwaway prototypes.

---

## 1. What is Boletify?

Boletify (*boleto* "ticket" + *-ify*) is a **Spanish-first ticketing platform
built for Mexico City's live-music scene** — concerts, club nights, cumbia,
electrónica, indie, jazz. It exists to give independent organisers a fair,
transparent alternative to Ticketmaster MX, Boletia, and Eventbrite.

Two audiences, two surfaces:

- **Buyers / fans** (e.g. *Diego*, 24, CDMX) — discover events, see the **real
  all-in price up front**, pay with **card, Mercado Pago, or OXXO cash**, and
  get a QR ticket on their phone. Their experience defaults to **dark mode**.
- **Organisers** (e.g. *Raúl*, indie promoter) — create events in minutes, own
  their buyer data, get paid in **T+3** days, scan QRs at the door. Their
  **Panel** is **light mode** (cream/slate + ink).

The product's central argument is **radical fee transparency**: every event
page and checkout shows the exact final price before you commit. After PROFECO
fined Ticketmaster MX MXN 5M (Feb 2026) for hidden fees, this stopped being a
nicety and became the brand's reason to exist. Every pricing UI decision is a
competitive act.

### Sources

This system was reverse-engineered from the Boletify monorepo (Turborepo;
Next.js web app + Expo native app + shared `packages/ui`). If you have access,
explore it to build more faithfully:

- **GitHub:** `https://github.com/nthchild2/boletify` — browse `apps/web`
  (the Next.js buyer + organiser site), `packages/ui` (the shared component
  library), and especially the design docs below.
- **Design canon (in-repo):**
  - `docs/06-design-principles-2026.md` — the "Brutal-Glass" manifesto. **This
    document is law**; the tokens here implement it.
  - `docs/02-product-design.md` — personas, flows, MVP scope, brand identity.
  - `apps/web/styles/global.css` + `tailwind.config.js` — the canonical token
    values (mirrored into `tokens.json` here).
  - `packages/ui/src/theme.ts` — the single source of truth for the palette.

> Don't assume the reader has repo access — everything needed to design is
> captured in this folder. The links are for going deeper.

---

## 2. Content Fundamentals — how Boletify writes

**Language:** Mexican Spanish, always. Display type must support accented caps
(Á É Í Ó Ú Ñ) and the inverted `¿` `¡`. English is deferred until international
expansion.

**Person & tone:** Informal **"tú"**, never "usted". The voice is a friend who
knows the scene — **transparente, cercano, moderno, confiable, con actitud**.
The rebellious-underdog-that's-also-reliable. Not corporate, not a government
website.

**Casing:** Sentence case for body and headlines. **UPPERCASE** is reserved for
the overline signature (categories, metadata, labels, CTAs) and poster titles.

**Voice by context:**
- **Product UI** — clear, concise, action-first verbs. *"Selecciona tus
  boletos"*, not *"Proceda a la selección de entradas."* CTAs are imperatives:
  *"Comprar boletos", "Guardar evento", "Crear evento", "Publicar"*.
- **Marketing / social** — fun, direct, culturally aware, a little irreverent.
  *"¿Otra vez Ticketmaster te clavó fees escondidos? Nosotros no hacemos eso."*
- **Errors** — empathetic, honest, solution-oriented. *"Algo salió mal con tu
  pago. Intenta de nuevo o prueba otro método."*
- **Organiser comms** — a warm partner, not a vendor. *"Tu evento ya está en
  línea. Comparte el link y empieza a vender."*

**Vocabulary (use these exact terms):** Boleto (ticket — the core brand word,
never "entrada"), Organizador (organiser), Asistente / Fan (buyer), Evento,
Panel (dashboard), Check-in. Money is always **MXN**.

**Profanity:** modern and easygoing, but not vulgar. Strong language only when
it lands as clever or pointed — never crude by default.

**Emoji:** **not** used in UI chrome. "Emoji is content, not decoration."

**Numbers in copy:** prices, dates, IDs, counts render in monospace, tabular
(`$450.00 MXN`, `Sáb 17 · 21:00`, `TCK-0412-0091`). Numbers inside prose
("35 mil asistentes") stay in body type.

---

## 3. Visual Foundations

The thesis is one tension: **structural honesty meets material wonder.** The
chassis is **brutalist** — raw, load-bearing, unapologetic. The artifacts
(tickets, QR stamps, sheets) are **liquid** — translucent, glowing, tactile.
That is **Brutal-Glass**.

**Color — "Ánima Nocturna" (`tokens.json`).** Color is *structural, not
decorative*. **Ink** is the page; **Bone** is the light; **Signal** (electric
lime `#C6FF2E`) is where you *act* — one per screen, the primary CTA only;
**Rosa Mexicano** (hot pink `#FF2E88`) is where you *feel* — price, save,
urgency; **Oxblood** (`#7A1020`) is where you're *stopped* — sold-out, danger.
Utility: **leaf** (success), **sun** (OXXO/warning), **cenote** (info). Semantic
tokens flip with theme — `primary` is lime-on-ink in **dark**, ink-on-cream in
**light**.

**Type (`tokens.json`).** Three families: **Bricolage Grotesque**
(display — *type as a graphic asset*, 40px+ only, weight + tracking as
illustration), **Inter** (body/UI), **JetBrains Mono** (every price, date, ID —
tabular always). The **overline** is a signature: 11px, +16% tracking,
UPPERCASE, middle-dot (·) separators.

**Spacing & radii (`tokens.json`).** 4px base grid. **Radii encode
register:** sharp (0/2/4) = brutal (marquees, tags, tables); mid (8/14) =
utility (inputs, buttons, cards); soft (22/28/40) = glass (tickets, panels,
sheets). Never mix registers in one element — except the signature ticket.

**Shadows (`tokens.json`) — two families, never blended.**
- **Brick:** hard, zero-blur, always **black**, offset. Structural *presence*.
  On press the element translates by the offset and the brick is *absorbed*.
- **Glass:** layered outer drop + inner top-edge catch-light + `backdrop-blur`.
  Material *wonder*, for precious artifacts and overlays. Theme-aware.
- **Glow:** reactive light (`glow-signal`, `glow-rosa`, `glow-focus`). Sparse —
  focus, loading, celebration.

**Backgrounds.** The hero is a **three-blob radial mesh gradient** over the page
color (`--bg-mesh`), blurred to a glow — never the dead 135° two-stop gradient.
Cards on it are either opaque (`surface`) or glass — never transparent-but-not-
glass. Event **posters use organiser imagery only** (no stock photography),
washed behind a dark legibility gradient.

**Motion — instant or expressive, never "smooth".** 80ms linear for state
changes (brutal honesty); 420ms `cubic-bezier(0.34,1.3,0.64,1)` for object
moments (ticket reveal, modal). The signature hover ramps the **variable-font
weight** (600→800), not color. Reduced-motion collapses everything to 0ms and
stops the marquee. Reject any default 200ms ease-in-out.

**Hover / press states.** Hover: weight ramp + (cards) a 2px lift to a larger
brick. Press: brick *absorbed* — translate +6px/+6px, shadow → none, 80ms.
Quiet variants shift to the primary hue on hover.

**Borders.** A 1.5px `ink-1000` border is **load-bearing** — it does structural
work, not decoration. Hairline `border` (1px) divides data rows and panels.

**Corners / cards.** Standard cards: 14px radius, 1px border, brick-shadow.
Glass cards: 28px radius, glass-edge border, glass-shadow, blur. Tickets: 22px,
the one allowed skeuomorphism (paper grain, perforation, die-cut).

**Imagery vibe.** Real concert photography — diverse crowds, Mexican venues,
nightlife, UGC feel. Warm and saturated, never cold corporate stock. Gradient
poster fallbacks use the brand hues over near-black.

**Light vs dark.** Dark = buyer (ink chassis, lime CTA once per screen, glass
artifacts floating). Light = organiser Panel (cream/slate, black brick-shadows,
ink-fill + lime-text CTA — the signature "brand moment"). Never use signal-lime
as a background fill on cream (contrast fails).

**Explicitly NOT doing:** purple→coral gradients · generic iOS blur cards ·
Helvetica/SF/Manrope · rounded buttons >14px (unless glass) · blended
shadow+glow · 200ms ease-in-out · emoji in chrome · stock photos on cards.

---

## 4. Iconography

Boletify uses **line icons** — thin stroke (1.5–2px), rounded caps/joins, no
fill. In the codebase these are hand-inlined SVGs in exactly the
[**Lucide**](https://lucide.dev) / Feather idiom (e.g. the organiser sidebar's
dashboard grid, calendar, receipt, gear).

- **Recommendation for new work:** use **Lucide** (CDN). The UI kits here load
  `https://unpkg.com/lucide@0.460.0` and render `<i data-lucide="…">` icons —
  same stroke weight and feel as the real app. *(Substitution flagged: the repo
  inlines its own SVGs rather than depending on Lucide; Lucide is the closest
  faithful match and what we standardize on here.)*
- **Social glyphs** (Instagram, X/Twitter, TikTok) are **filled** brand SVGs —
  the one place fill is used. Pulled from the real footer in `brutal-glass.tsx`
  and **copied in** as standalone files: `assets/icons/instagram.svg`,
  `assets/icons/x.svg`, `assets/icons/tiktok.svg` (all `fill="currentColor"`, so
  they take the host text color and the brand accent on hover — see the
  `marketing-web` footer).
- **No emoji, no unicode-as-icon** in UI chrome. The middle-dot `·` separator is
  a typographic device, not an icon.
- **No icon font** ships with the system.

**Logo / brand mark.** Boletify's identity is the **`bolet·ify` wordmark** set
in Bricolage Grotesque black — the `ify` carries the primary color (lime on ink,
rosa-600 on cream). See `components/Wordmark/preview.html`. The product's
"app-icon-first" mark (rounded square, single glyph) is **not yet designed** —
the repo's `icon.png` is still the default Expo placeholder. *No real logo
asset exists to copy in.*

---

## 5. Index / Manifest

**Root**
- `styles.css` — the single entry point (import this). `@import`s everything below.
- `README.md` — this guide.

**Tokens** (all reached from `styles.css`)
- `tokens.json` (every color, shadow, spacing, radius, blur, weight and type style) · `tokens.css` (generated from it) · `components/bundle.css` (fonts, the `--text-*` type-scale variables, motion, mesh backgrounds, base)

**Components** (`components/`, `window.BoletifyDesignSystem_c6a0b5.*`)
- Core — **Button**, **Badge**, **Avatar**, **Input**, **Card**, **GlassCard**
- Events — **EventCard**, **TicketArtifact** *(the signature pieces)*
- Brand — **HeroKicker**, **Marquee**
- Data — **StatStrip**

Each lives in `components/<Name>/`: `<Name>.d.ts` (props), `README.md` (usage) and `preview.html` (demo). Sources are in `components/src/`; the bundle is `components/bundle.js`; all types in `components/index.d.ts`.

**UI Kits** (`ui_kits/`)
- `buyer-web/` — dark buyer flow: Home → Event detail → Checkout → Ticket.
- `organiser-web/` — light Panel: Dashboard → Crear evento.
- `marketing-web/` — light public site: **Precios** (fee-transparency thesis
  with a live all-in price calculator) + the standard footer.

**Assets** (`assets/`)
- `icons/` — real brand social glyphs (`instagram.svg`, `x.svg`, `tiktok.svg`).

**Foundations** (`guidelines/`) — specimen cards for the Design System tab
(glass shadows, mesh & glow, mono numerals). Colors, type, spacing, radii and shadows show from `tokens.json`; the wordmark is `components/Wordmark/preview.html`.

---

## 6. Using this system

- **Consuming in HTML/CSS:** link `styles.css`, add `data-theme="dark"` (with `class="dark"`) to `<html>`
  for buyer surfaces (omit for organiser/light). Use semantic tokens
  (`var(--color-bg)`, `var(--color-fg)`, `var(--color-primary)`) so themes flip
  for free; use literal tokens (`var(--signal-500)`) when a hue must stay fixed.
- **Components in a card/prototype:** load `components/bundle.js` (after React 18), then
  `const { Button, EventCard } = window.BoletifyDesignSystem_c6a0b5;`. Do **not**
  `<script src>` a component `.jsx` directly.
- **Fonts** load from Google Fonts (Bricolage Grotesque, Inter, JetBrains Mono).
  Swap to self-hosted `@font-face` if you need offline rendering — names match.
