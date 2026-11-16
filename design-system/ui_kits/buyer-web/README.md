# Buyer Web — UI Kit

The dark, buyer-facing Boletify experience. A click-through recreation of the
full purchase journey, composed entirely from the design-system components.

**Flow:** Home (discovery) → Event detail → Checkout → Ticket confirmation.

Open `index.html`. Click any event card or **Ver detalles** to open an event,
**Comprar boletos** to check out, pick a payment method, **Pagar**, and land on
the live glass ticket. The `bolet·ify` wordmark (top-left) returns home.

## Screens
| File | Surface |
|---|---|
| `Nav.jsx` | Sticky translucent site nav + wordmark |
| `Home.jsx` | Featured hero, category filters, event grid, brand marquee |
| `EventDetail.jsx` | Hero info, fee-transparent info cards, the `TicketArtifact` |
| `Checkout.jsx` | Quantity stepper, **radical fee transparency** panel, payment methods (Tarjeta / Mercado Pago / OXXO) |
| `TicketView.jsx` | Order confirmation + live ticket |
| `app.jsx` | State router wiring the four screens together |
| `data.js` | Mock CDMX events (poster gradients mirror the real `lib/mock-data.ts`) |

## Components used
`EventCard`, `TicketArtifact`, `Button`, `Badge`, `GlassCard`, `HeroKicker`,
`Marquee` from `window.BoletifyDesignSystem_c6a0b5`. Icons via Lucide (CDN).

The page sits on `.dark` (the buyer default) over the mesh-gradient hero.
Every price shows the all-in total — no hidden fees — which is the product's
core competitive argument, not just a UI detail.
