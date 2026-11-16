**Marquee** — full-bleed looping display band as a section divider or hero footer. Use once per page — it's loud. Items render middle-dot separated; reduced-motion pauses it.

```jsx
<Marquee items={["Descubre", "Noches", "Sonidos", "CDMX", "2026"]} />
```

Pass `items` as an array (preferred) or a "·"-separated string. Edge-to-edge, sharp-cornered (radius-0), 1.5px borders top and bottom, display type looping at 28s linear.
