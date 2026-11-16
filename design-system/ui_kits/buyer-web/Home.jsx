// Home — buyer discovery feed: featured hero + category filters + event grid.
function Home({ onOpen }) {
  const { HeroKicker, Button, EventCard, Marquee } = window.BoletifyDesignSystem_c6a0b5;
  const events = window.BOLETIFY_EVENTS;
  const filters = window.BOLETIFY_FILTERS;
  const [active, setActive] = React.useState(null);
  const featured = events[0];

  const shown = active ? events.filter((e) => e.category === active) : events;

  const chip = (label, isOn, onClick) => (
    <button key={label} onClick={onClick} style={{
      borderRadius: 9999, border: `1px solid ${isOn ? "var(--color-border-ink)" : "var(--color-border-strong)"}`,
      background: isOn ? "var(--color-primary)" : "transparent",
      color: isOn ? "var(--color-primary-fg)" : "var(--color-fg)",
      padding: "8px 16px", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
      letterSpacing: "0.04em", textTransform: "uppercase", cursor: "pointer",
    }}>{label}</button>
  );

  return (
    <div>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 48px" }}>
        <section style={{ paddingTop: 64 }}>
          <HeroKicker>Esta semana · CDMX</HeroKicker>
        </section>

        {/* Featured hero */}
        <section style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--color-primary)" }}>Evento destacado</div>
            <h1 style={{ margin: "16px 0 0", fontFamily: "var(--font-display)", fontSize: 88, fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.035em", color: "var(--color-fg)" }}>{featured.title}</h1>
            <p style={{ margin: "16px 0 0", maxWidth: 440, fontSize: 18, lineHeight: "28px", color: "var(--color-fg-secondary)" }}>{featured.description}</p>
            <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 16px", fontFamily: "var(--font-mono)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-fg-muted)" }}>
              <span style={{ fontSize: 14, color: "var(--color-primary)" }}>{featured.price}</span>
              <span>·</span><span>{featured.date} · {featured.access}</span>
              <span>·</span><span>{featured.venue}</span>
            </div>
            <div style={{ marginTop: 32 }}>
              <Button size="lg" onClick={() => onOpen(featured.id)}>Ver detalles</Button>
            </div>
          </div>
          <div onClick={() => onOpen(featured.id)} style={{ position: "relative", aspectRatio: "4 / 5", overflow: "hidden", borderRadius: 22, cursor: "pointer", background: featured.posterBackground }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(8,8,12,0.9), transparent 60%)" }} />
            <div style={{ position: "absolute", inset: 16, display: "flex", alignItems: "flex-end" }}>
              <span style={{ whiteSpace: "pre-line", fontFamily: "var(--font-display)", fontSize: 72, fontWeight: 900, textTransform: "uppercase", lineHeight: 0.9, letterSpacing: "-0.035em", color: "rgba(246,242,234,0.95)" }}>{featured.posterTitle}</span>
            </div>
            <span style={{ position: "absolute", bottom: 16, left: 16, fontFamily: "var(--font-mono)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(246,242,234,0.8)" }}>{featured.lineup}</span>
          </div>
        </section>

        {/* Filters */}
        <section style={{ marginTop: 64, borderTop: "1px solid var(--color-border)", paddingTop: 32 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {chip(`Todos (${events.length})`, active === null, () => setActive(null))}
            {filters.map((f) => {
              const count = events.filter((e) => e.category === f).length;
              if (!count) return null;
              return chip(`${f} (${count})`, active === f, () => setActive(f));
            })}
          </div>
        </section>

        {/* Grid */}
        <section style={{ marginTop: 32, paddingBottom: 64, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {shown.map((e) => (
            <EventCard key={e.id} event={e} href="#" onClick={(ev) => { ev.preventDefault(); onOpen(e.id); }} />
          ))}
        </section>
      </div>

      <Marquee items={["Descubre", "Noches", "Sonidos", "CDMX", "2026"]} />
    </div>
  );
}
window.Home = Home;
