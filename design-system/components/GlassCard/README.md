**GlassCard** — the liquid surface: translucent, blurred, soft-radius panel for floating/precious UI (checkout panel, filter bar, ticket detail overlay, scanner chrome). Must sit over a mesh background or image.

```jsx
<div style={{ background: "var(--bg-mesh)", padding: 40 }}>
  <GlassCard intensity="lg">
    <h2 className="heading">Iniciar sesión</h2>
    <Input label="Email" glass type="email" />
    <Button size="xl" className="full">Entrar</Button>
  </GlassCard>
</div>
```

`intensity` controls blur + shadow depth (`sm`/`md`/`lg`). Never use it as a plain opaque card — that's **Card**. One shadow family per element: glass cards never also wear a brick-shadow.
