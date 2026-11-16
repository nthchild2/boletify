// TicketView — order confirmation: success message + the live ticket.
function TicketView({ event, onHome }) {
  const { Button, TicketArtifact, Badge } = window.BoletifyDesignSystem_c6a0b5;
  const e = event;
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px" }}>
      <section style={{ borderTop: "1px solid var(--color-border)", padding: "48px 0 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 480px", gap: 48, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex" }}><Badge variant="leaf">Pago confirmado</Badge></div>
            <h1 style={{ margin: "20px 0 0", fontFamily: "var(--font-display)", fontSize: 72, fontWeight: 850, lineHeight: 0.95, letterSpacing: "-0.03em", color: "var(--color-fg)" }}>¡Nos vemos<br/>en la pista!</h1>
            <p style={{ margin: "20px 0 0", maxWidth: 460, fontSize: 18, lineHeight: "30px", color: "var(--color-fg-secondary)" }}>
              Tu boleto para <strong style={{ color: "var(--color-fg)" }}>{e.title}</strong> ya está listo. Te enviamos una copia con tu código QR a tu correo — preséntalo en la puerta.
            </p>
            <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(2, max-content)", gap: "16px 40px" }}>
              <Meta label="Evento" value={e.dateLong + " · " + e.accessLong} />
              <Meta label="Lugar" value={e.venue + " · " + e.location} />
              <Meta label="Sección" value="General A" />
              <Meta label="Orden" value="BLT-2026-0412" mono />
            </div>
            <div style={{ marginTop: 36, display: "flex", gap: 16 }}>
              <Button size="lg" onClick={onHome}>Descubrir más eventos</Button>
              <Button variant="glass" size="lg">Añadir a Wallet</Button>
            </div>
          </div>
          <TicketArtifact event={e} />
        </div>
      </section>
    </div>
  );
}

function Meta({ label, value, mono }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-fg-muted)" }}>{label}</div>
      <div style={{ marginTop: 6, fontFamily: mono ? "var(--font-mono)" : "var(--font-body)", fontSize: 16, color: "var(--color-fg)" }}>{value}</div>
    </div>
  );
}
window.TicketView = TicketView;
