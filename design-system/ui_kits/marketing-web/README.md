# Marketing Web — Boletify public site (light)

The **default-theme (light, slate)** public marketing surface. Where the buyer
flow (`buyer-web`) is dark and the Panel (`organiser-web`) is the working light
dashboard, this kit is the **front door**: the page a prospective organiser or
fan lands on.

## Screen

- **`Precios`** — the brand's thesis made literal: *radical fee transparency*.
  After PROFECO fined Ticketmaster MX for hidden fees (Feb 2026), "you see the
  real all-in price up front" stopped being a nicety and became the reason to
  exist. The centrepiece is a **live all-in price calculator** (the buyer sees
  exactly what they pay) using the real fee model from
  `apps/web/app/precios/page.tsx`: **5% + $10 MXN per ticket**, with the fixed
  $10 waived for tickets ≤ $100 MXN. Below it: the three pricing tiers and a
  worked example.

## Composition

- `Nav.jsx` — `MarketingNav`, the light marketing nav (wordmark + section links
  + auth/CTA buttons). Accent-pink `ify` in the wordmark on light pages.
- `Precios.jsx` — `Precios`, hero + glass calculator + tiers + example. Uses
  `HeroKicker`, `GlassCard`, `Input`, `Card`, `Button` from the bundle.
- `Footer.jsx` — `MarketingFooter`, the standard footer with the **real brand
  social glyphs** (Instagram, X, TikTok — filled SVGs, the one place fill is
  used; also saved standalone in `assets/icons/`).
- `app.jsx` — orchestrator over the `--bg-mesh-ambient` light mesh.

## Notes

- Renders in **light mode** (no `.dark` class) — this is the organiser/marketing
  register. The calculator and example reuse the exact copy and numbers from the
  production `precios` page.
- This screen is registered as a **starting point** (`Marketing Web`).
