# Organiser Web — UI Kit

The light, organiser-facing **Panel**. A click-through recreation of the
dashboard and event-creation flow — the inverted "cream chassis" side of the
system (black brick-shadows on slate, ink-fill CTAs with lime text).

**Flow:** Dashboard (stats + events table) → Crear evento (2-step form).

Open `index.html`. Use the sidebar to move between sections; **+ Crear evento**
opens the creation form (Detalles → Boletos) with a live **fee-transparency
preview** showing exactly what the buyer will pay.

## Screens
| File | Surface |
|---|---|
| `Sidebar.jsx` | Sticky panel nav, wordmark, account footer |
| `Dashboard.jsx` | `StatStrip` metrics, quick actions, recent-events table with status pills |
| `CreateEvent.jsx` | Two-step form (event details, ticket tiers + buyer fee preview) |
| `app.jsx` | Sidebar + view switcher |
| `data.js` | Mock organiser events (published / draft) and dashboard stats |

## Components used
`StatStrip`, `Button`, `Input`, `Badge` from `window.BoletifyDesignSystem_c6a0b5`.
Icons via Lucide (CDN, line style — matches the real app's inline SVGs).

This kit stays in **light mode** (no `.dark` class) — the organiser surface is
slate + ink with tabular-mono numbers throughout, which is what makes the data
feel serious (design-principles §8.6 / §9).
