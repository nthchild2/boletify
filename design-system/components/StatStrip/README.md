**StatStrip** — the organiser-dashboard metric row. Big tabular-mono numbers + overline labels, divided by hairlines. Use at the top of dashboards and event detail views.

```jsx
<StatStrip stats={[
  { label: "Venta bruta · 2026", value: "$1,247,830", delta: "+12.4%" },
  { label: "Boletos vendidos", value: "8,421", delta: "+284" },
  { label: "Eventos activos", value: "24" },
  { label: "Pago próximo", value: "T+3" },
]} />
```

Keep every value pre-formatted and numeric — the tabular mono is the point. `delta` is optional and renders small in the primary hue.
