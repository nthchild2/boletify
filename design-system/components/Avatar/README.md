**Avatar** — a round identity chip for organisers, attendees, and account menus; shows a photo or falls back to initials.

```jsx
<Avatar src="/u/raul.jpg" alt="Raúl" size="md" />
<Avatar initials="RM" size="md" />
<Avatar initials="DV" size="xs" />
```

- **Sizes:** `xs` 24 · `sm` 32 · `md` 40 (default) · `lg` 56 · `xl` 80.
- Always circular with a glass-edge hairline + `shadow-glass-sm` — it reads as a small precious object, matching the glass register. Don't add a brick-shadow.
- Initials are auto-sliced to 2 chars and uppercased; empty falls back to `?`.
- For a stacked group, overlap with negative margin and a 2px `--color-surface` ring (add via `className`).
