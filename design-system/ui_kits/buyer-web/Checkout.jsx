// Checkout — ticket selection + radical fee transparency + payment method.
function Checkout({ event, onBack, onPay }) {
  const { Button, GlassCard, Badge } = window.BoletifyDesignSystem_c6a0b5;
  const e = event;
  const [qty, setQty] = React.useState(1);
  const [method, setMethod] = React.useState("card");
  const free = e.priceValue === 0;

  const base = e.priceValue * qty;
  const fee = free ? 0 : Math.round(base * 0.05 + 10 * qty);
  const total = base + fee;
  const fmt = (n) => n === 0 ? "$0.00" : "$" + n.toLocaleString("es-MX", { minimumFractionDigits: 2 }) + "";

  const methods = [
    { id: "card", label: "Tarjeta", sub: "Crédito / débito", icon: "credit-card" },
    { id: "mp", label: "Mercado Pago", sub: "Saldo o tarjeta", icon: "wallet" },
    { id: "oxxo", label: "OXXO", sub: "Efectivo · 72 h", icon: "banknote" },
  ];

  const line = (label, value, opts = {}) => (
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: opts.big ? 16 : 14, color: opts.muted ? "var(--color-fg-muted)" : "var(--color-fg)", marginTop: opts.gap ? 12 : 8 }}>
      <span style={{ fontFamily: "var(--font-body)", letterSpacing: opts.muted ? 0 : 0 }}>{label}</span>
      <span className="tnum" style={{ color: opts.accent ? "var(--color-primary)" : undefined }}>{value} <span style={{ color: "var(--color-fg-subtle)" }}>MXN</span></span>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px" }}>
      <section style={{ borderTop: "1px solid var(--color-border)", padding: "48px 0" }}>
        <button onClick={onBack} style={{ background: "none", border: 0, cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-fg-muted)", marginBottom: 16 }}>← {e.title}</button>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 40, alignItems: "start" }}>
          {/* Left: selection */}
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-fg-muted)" }}>Checkout · {e.venue}</div>
            <h1 style={{ margin: "12px 0 0", fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.025em", color: "var(--color-fg)" }}>Tus boletos</h1>

            {/* Tier row */}
            <div style={{ marginTop: 32, borderRadius: 14, border: "1px solid var(--color-border)", background: "var(--color-surface)", padding: 20, boxShadow: "var(--shadow-brick-md)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "var(--color-fg)" }}>General</span>
                  <Badge variant={e.statusVariant}>{e.status}</Badge>
                </div>
                <div style={{ marginTop: 6, fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--color-primary)" }}>{free ? "GRATIS" : e.price + " c/u"}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, border: "1px solid var(--color-border-strong)", borderRadius: 8, padding: 4 }}>
                <Stepper sign="−" onClick={() => setQty((q) => Math.max(1, q - 1))} />
                <span className="tnum" style={{ width: 36, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 18, color: "var(--color-fg)" }}>{qty}</span>
                <Stepper sign="+" onClick={() => setQty((q) => Math.min(10, q + 1))} />
              </div>
            </div>

            {/* Payment methods */}
            <div style={{ marginTop: 32 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-fg-muted)", marginBottom: 14 }}>Método de pago</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {methods.map((m) => {
                  const on = method === m.id;
                  return (
                    <button key={m.id} onClick={() => setMethod(m.id)} style={{
                      textAlign: "left", cursor: "pointer", borderRadius: 14, padding: "16px 16px",
                      border: `1.5px solid ${on ? "var(--color-primary)" : "var(--color-border)"}`,
                      background: on ? "rgba(198,255,46,0.06)" : "var(--color-surface)",
                      boxShadow: on ? "var(--shadow-glow-focus)" : "none",
                    }}>
                      <i data-lucide={m.icon} style={{ width: 20, height: 20, color: on ? "var(--color-primary)" : "var(--color-fg-muted)" }}></i>
                      <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600, color: "var(--color-fg)" }}>{m.label}</div>
                      <div style={{ fontSize: 12, color: "var(--color-fg-muted)" }}>{m.sub}</div>
                    </button>
                  );
                })}
              </div>
              {method === "oxxo" && (
                <p style={{ marginTop: 14, fontSize: 13, lineHeight: "20px", color: "var(--color-warning)" }}>
                  Generaremos una referencia OXXO. Tienes 72 horas para pagar en cualquier tienda; tu boleto se emite al confirmarse el pago.
                </p>
              )}
            </div>
          </div>

          {/* Right: fee transparency panel */}
          <GlassCard intensity="lg">
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-fg-muted)" }}>Resumen — precio final</div>
            <div style={{ marginTop: 16 }}>
              {line(`${qty} × General`, fmt(base))}
              {!free && line("Cargo de servicio", fmt(fee), { muted: true })}
              <div style={{ borderTop: "1px solid var(--color-glass-edge)", marginTop: 16, paddingTop: 16 }}>
                {line("Total a pagar", fmt(total), { big: true, accent: true, gap: false })}
              </div>
            </div>
            <p style={{ marginTop: 16, fontSize: 12, lineHeight: "18px", color: "var(--color-fg-muted)" }}>
              Sin cargos ocultos. El precio que ves es el precio que pagas — incluido todo.
            </p>
            <div style={{ marginTop: 20 }}>
              <Button size="xl" className="bds-full" onClick={onPay} style={{ width: "100%" }}>
                {free ? "Registrarme gratis" : "Pagar " + fmt(total)}
              </Button>
            </div>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, justifyContent: "center", fontSize: 11, color: "var(--color-fg-subtle)" }}>
              <i data-lucide="lock" style={{ width: 13, height: 13 }}></i> Pago cifrado · datos tokenizados
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}

function Stepper({ sign, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 36, height: 36, borderRadius: 6, border: "1px solid var(--color-border)",
      background: "var(--color-surface-raised)", color: "var(--color-fg)", cursor: "pointer",
      fontFamily: "var(--font-mono)", fontSize: 18, lineHeight: 1,
    }}>{sign}</button>
  );
}
window.Checkout = Checkout;
