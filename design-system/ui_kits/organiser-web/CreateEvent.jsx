// CreateEvent — two-step event creation form (Detalles → Boletos + fee preview).
function CreateEvent({ onBack }) {
  const { Button, Input, Badge } = window.BoletifyDesignSystem_c6a0b5;
  const [step, setStep] = React.useState(1);
  const [price, setPrice] = React.useState("450");

  const priceNum = parseFloat(price) || 0;
  const fee = priceNum ? (priceNum * 0.05 + 10) : 0;
  const total = priceNum + fee;
  const fmt = (n) => "$" + n.toLocaleString("es-MX", { minimumFractionDigits: 2 });

  const stepTab = (n, label) => {
    const on = step === n;
    return (
      <button onClick={() => setStep(n)} style={{
        borderRadius: 9999, padding: "6px 16px", fontFamily: "var(--font-body)", fontSize: 12,
        fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", cursor: "pointer",
        border: on ? "1px solid transparent" : "1px solid var(--color-border)",
        background: on ? "var(--color-primary)" : "transparent",
        color: on ? "var(--color-primary-fg)" : "var(--color-fg-muted)",
      }}>{n}. {label}</button>
    );
  };

  return (
    <div style={{ padding: 40, maxWidth: 760 }}>
      <button onClick={onBack} style={{ background: "none", border: 0, cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-fg-muted)", marginBottom: 12 }}>← Eventos</button>
      <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 850, letterSpacing: "-0.03em", color: "var(--color-fg)" }}>Crear evento</h1>

      <div style={{ margin: "24px 0 28px", display: "flex", gap: 8 }}>
        {stepTab(1, "Detalles")}
        {stepTab(2, "Boletos")}
      </div>

      {step === 1 ? (
        <div style={{ display: "grid", gap: 20 }}>
          <Input label="Nombre del evento" defaultValue="Noche de Indie Rock" placeholder="Ej: Noche de electrónica en Polanco" />
          <Input label="Descripción" multiline rows={3} defaultValue="Una fecha para perder la voz entre guitarras crudas y synths melancólicos." />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Venue" defaultValue="Foro Puebla" />
            <Input label="Ciudad" defaultValue="CDMX" />
          </div>
          <Input label="Dirección del venue" defaultValue="Puebla 186, Roma Nte" placeholder="Calle y número" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Fecha de inicio" type="date" defaultValue="2026-05-17" />
            <Input label="Hora de inicio" type="time" defaultValue="21:00" />
          </div>
          <Input label="Tags de género (separados por coma)" defaultValue="indie, rock" />
          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8 }}>
            <Button onClick={() => setStep(2)}>Siguiente: Boletos →</Button>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ marginTop: 0, fontSize: 14, color: "var(--color-fg-muted)" }}>Agrega al menos un tipo de boleto. Los precios se manejan en MXN.</p>
          <div style={{ borderRadius: 14, border: "1px solid var(--color-border)", background: "var(--color-surface)", padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-fg)" }}>Tier 1</span>
              <Badge variant="signal">General</Badge>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
              <Input label="Nombre" defaultValue="General" />
              <Input label="Precio MXN" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
              <Input label="Cantidad" type="number" defaultValue="400" />
            </div>
          </div>

          {/* Fee transparency preview — what the buyer will see */}
          <div style={{ marginTop: 20, borderRadius: 14, border: "1.5px solid var(--color-border-ink)", background: "var(--color-surface)", padding: 20, boxShadow: "var(--shadow-brick-md)" }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-fg-muted)" }}>Lo que verá el comprador</div>
            <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
              <Row label="Precio base" value={fmt(priceNum)} />
              <Row label="Cargo de servicio (5% + $10)" value={fmt(fee)} muted />
              <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: 10, marginTop: 4 }}>
                <Row label="Precio final · todo incluido" value={fmt(total)} bold />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--color-border)", paddingTop: 20 }}>
            <button onClick={() => setStep(1)} style={{ background: "none", border: 0, cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-fg-muted)" }}>Volver a detalles</button>
            <Button>Publicar evento</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, muted, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: bold ? 16 : 14 }}>
      <span style={{ color: muted ? "var(--color-fg-muted)" : "var(--color-fg)" }}>{label}</span>
      <span className="tnum" style={{ fontFamily: "var(--font-mono)", color: bold ? "var(--color-accent)" : "var(--color-fg)" }}>{value} <span style={{ color: "var(--color-fg-subtle)" }}>MXN</span></span>
    </div>
  );
}
window.CreateEvent = CreateEvent;
