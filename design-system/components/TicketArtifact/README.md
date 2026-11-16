**TicketArtifact** — the hero glass ticket. Use on event detail pages, order confirmation, and the "My Tickets" view. It's the one component allowed skeuomorphism (paper grain, perforation, die-cut feel).

```jsx
<TicketArtifact event={{
  title: "Noche de Indie Rock",
  venue: "Foro Puebla", location: "Roma Nte",
  date: "Sáb 17 may", access: "21:00 hrs",
  section: "GRAL A", price: "$450 MXN",
  lineup: "Triplete · Las Nubes · Fuente de Juventud",
  ticketId: "TCK · 0412 · 0091",
}} />

{/* production: pass a real QR */}
<TicketArtifact event={evt} qr="/qr/abc123.png" />
```

It carries its own glow + stage padding — drop it into a column and let it float. Omitting `qr` renders a decorative QR stand-in. Don't restyle it light; it's intentionally dark-glass on both themes.
