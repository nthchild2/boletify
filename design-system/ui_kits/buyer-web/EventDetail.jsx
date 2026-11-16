// EventDetail — buyer event page: hero info + the glass ticket artifact.
function EventDetail({ event, onBack, onBuy }) {
  const { Button, TicketArtifact, GlassCard } = window.BoletifyDesignSystem_c6a0b5;
  const e = event;

  const infoCard = (label, value, accent) => (
    <div style={{ borderRadius: 14, border: "1px solid var(--color-border)", background: "rgba(15,15,21,0.8)", padding: 20, boxShadow: "var(--shadow-brick-sm)" }}>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-fg-muted)" }}>{label}</div>
      <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 20, color: accent ? "var(--color-primary)" : "var(--color-fg)" }}>{value}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 48px" }}>
      <section style={{ borderTop: "1px solid var(--color-border)", padding: "48px 0" }}>
        <button onClick={onBack} style={{ background: "none", border: 0, cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-fg-muted)", marginBottom: 16 }}>← Volver a eventos</button>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 420px", gap: 48, alignItems: "start" }}>
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-fg-muted)" }}>{e.category} · {e.venue}</div>
            <h1 style={{ margin: "16px 0 0", fontFamily: "var(--font-display)", fontSize: 96, fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.03em", color: "var(--color-fg)" }}>{e.title}</h1>
            <p style={{ margin: "20px 0 0", maxWidth: 720, fontSize: 18, lineHeight: "32px", color: "var(--color-fg-secondary)" }}>{e.description}</p>

            <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {infoCard("Fecha", e.date)}
              {infoCard("Acceso", e.accessLong)}
              {infoCard("Precio", e.price, true)}
            </div>

            <div style={{ marginTop: 40, display: "flex", flexWrap: "wrap", gap: 16 }}>
              <Button size="xl" onClick={onBuy}>Comprar boletos</Button>
              <Button variant="accent" size="xl">Guardar evento</Button>
              <Button variant="glass" size="xl">Compartir</Button>
            </div>

            <div style={{ marginTop: 40 }}>
              <GlassCard intensity="md">
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-fg-muted)" }}>Line-up</div>
                <p style={{ margin: "12px 0 0", fontSize: 16, lineHeight: "26px", color: "var(--color-fg)" }}>{e.lineup}</p>
                <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--color-glass-edge)", paddingTop: 16 }}>
                  <span style={{ fontSize: 14, color: "var(--color-fg-muted)" }}>{e.venue} · {e.location}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--color-primary)" }}>Ver más fechas</span>
                </div>
              </GlassCard>
            </div>
          </div>

          <TicketArtifact event={e} />
        </div>
      </section>
    </div>
  );
}
window.EventDetail = EventDetail;
