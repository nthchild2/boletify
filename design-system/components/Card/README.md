**Card** — the default brutal surface: bordered panel with a hard brick-shadow. Use for dashboard tiles, list rows, stat blocks, form sections.

```jsx
<Card>
  <div className="overline">Fecha</div>
  <div className="mono">Sáb 17 may</div>
</Card>

<Card shadow="brick-lg" href="/events/123">Pressable event row</Card>
<Card variant="ghost" shadow="none">Quiet container</Card>
```

`shadow` sets the brick weight (`none`/`brick-sm`/`brick-md`/`brick-lg`). Give it an `href` (or `interactive`) to make the whole card a link that lifts on hover and absorbs its brick on press. For translucent precious surfaces use **GlassCard** instead.
