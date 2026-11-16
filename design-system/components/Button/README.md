**Button** — the Brutal-Glass action element; use for any primary/secondary action. Brutal variants press-absorb their brick-shadow; `glass` is the soft variant for use over imagery.

```jsx
<Button variant="primary" size="xl" href="/checkout">Comprar boletos</Button>
<Button variant="accent">Guardar evento</Button>
<Button variant="secondary" size="sm">Ver detalles</Button>
<Button variant="glass">Compartir</Button>
```

- **variant**: `primary` (lime-on-ink / ink-on-cream, the one-per-screen CTA), `accent` (Rosa Mexicano), `danger` (oxblood, destructive), `secondary` (outline), `ghost` (text-only), `glass` (translucent, over photos).
- **size**: `sm` · `md` · `lg` · `xl` (xl uses display type, normal-case — for hero CTAs).
- Press collapses the brick-shadow and shifts the button +6px/+6px; hover ramps the label weight. Copy is Mexican Spanish, action-first ("Comprar boletos", not "Proceder al pago").
