**EventCard** — the buyer-facing poster tile for event grids and discovery feeds. The poster image + big headline IS the card; don't repeat the title in the meta strip.

```jsx
<EventCard event={{
  id: "noche-indie-rock",
  posterTitle: "Nubes\nOscuras",
  posterImage: "/posters/nubes.jpg",   // organiser image, not stock
  category: "INDIE",
  status: "En venta", statusVariant: "signal",
  date: "SÁB 17 MAY", access: "21:00",
  venue: "Foro Puebla", location: "Roma Nte",
  price: "$450 MXN",
}} />
```

Lay them out in a responsive grid (`sm:2 / lg:3 / xl:4` columns, `gap: 24px`). Use a `posterBackground` gradient string only when there's no organiser image. Price shows the primary token (lime on dark). Hover lifts the brick; press absorbs it.
