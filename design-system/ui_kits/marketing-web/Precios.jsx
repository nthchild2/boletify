// Precios — the brand's thesis surface: radical fee transparency. A live
// all-in price calculator (the buyer sees exactly what they pay) + the real
// pricing tiers + a worked example.
function Precios() {
  const { HeroKicker, Card, GlassCard, Input, Button } = window.BoletifyDesignSystem_c6a0b5;
  const [raw, setRaw] = React.useState("350");

  const price = Math.max(0, Number(raw) || 0);
  // Real Boletify fee model (apps/web/app/precios): 5% + $10 MXN per ticket;
  // the fixed $10 is waived for tickets of $100 MXN or less.
  const fixed = price > 100 ? 10 : 0;
  const service = price * 0.05 + fixed;
  const buyerPays = price + service;

  const mxn = (n) =>
    "$" + n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " MXN";

  const mono = { fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" };
  const overline = { fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-fg-muted)" };

  const tiers = [
    { label: "Cargo por servicio", big: "5%", sub: "+ $10 MXN por boleto", body: "Sobre el precio de venta. Para boletos de $100 MXN o menos, se elimina el cargo fijo." },
    { label: "Eventos gratuitos", big: "$0", sub: "Sin costo", body: "Publica eventos gratuitos con RSVP y check-in por QR sin pagar nada." },
    { label: "Pago OXXO", big: "~$13", sub: "Cargo adicional al comprador", body: "Para pagos en efectivo en OXXO. El organizador no absorbe este costo." },
  ];

  const row = (label, value, opts = {}) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, padding: "12px 0", borderTop: opts.divider ? "1px solid var(--color-border)" : "none" }}>
      <span style={{ fontSize: 14, color: opts.strong ? "var(--color-fg)" : "var(--color-fg-muted)", fontWeight: opts.strong ? 600 : 400 }}>{label}</span>
      <span style={{ ...mono, fontSize: opts.lg ? 15 : 14, color: opts.accent ? "var(--color-accent)" : "var(--color-fg)" }}>{value}</span>
    </div>
  );

  return (
    <div>
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "64px 48px 0" }}>
        <HeroKicker>Transparencia total</HeroKicker>
        <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 64, alignItems: "start" }}>
          {/* Left — headline + claim */}
          <div>
            <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 88, fontWeight: 850, lineHeight: 0.9, letterSpacing: "-0.035em", color: "var(--color-fg)" }}>
              Precios<br />sin letra<br />chica.
            </h1>
            <p style={{ marginTop: 28, maxWidth: 460, fontSize: 18, lineHeight: "30px", color: "var(--color-fg-secondary)" }}>
              Sin sorpresas, sin cargos ocultos. El comprador ve exactamente lo que paga
              desde el primer clic — y tú recibes el precio completo del boleto.
            </p>
            <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
              <Button variant="primary" size="lg">Crear evento</Button>
              <Button variant="secondary" size="lg">Hablar con ventas</Button>
            </div>
          </div>

          {/* Right — live calculator (glass artifact) */}
          <GlassCard intensity="md" style={{ padding: 28 }}>
            <div style={overline}>Calculadora de precio final</div>
            <div style={{ marginTop: 18 }}>
              <Input
                label="Precio del boleto (MXN)"
                type="number"
                min="0"
                inputMode="numeric"
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
              />
            </div>
            <div style={{ marginTop: 16 }}>
              {row("Precio del boleto", mxn(price))}
              {row(`Cargo por servicio (5%${fixed ? " + $10" : ""})`, mxn(service))}
              {row("El comprador paga", mxn(buyerPays), { divider: true, strong: true, lg: true })}
              {row("Tú recibes", mxn(price), { accent: true, strong: true })}
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 12, lineHeight: "18px", color: "var(--color-fg-subtle)" }}>
              El cargo por servicio lo paga el comprador, no tú. Mostrado completo antes de confirmar.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Pricing tiers */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "80px 48px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {tiers.map((t) => (
            <Card key={t.label} shadow="brick-sm">
              <div style={{ ...mono, fontSize: 12, textTransform: "uppercase", color: "var(--color-fg-muted)" }}>{t.label}</div>
              <div style={{ marginTop: 12, fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 900, letterSpacing: "-0.02em", color: "var(--color-accent)" }}>{t.big}</div>
              <div style={{ marginTop: 4, ...mono, fontSize: 12, color: "var(--color-fg-muted)" }}>{t.sub}</div>
              <p style={{ marginTop: 16, fontSize: 14, lineHeight: "22px", color: "var(--color-fg-secondary)" }}>{t.body}</p>
            </Card>
          ))}
        </div>

        {/* Worked example */}
        <div style={{ marginTop: 24 }}>
          <GlassCard intensity="md" style={{ padding: 28 }}>
            <div style={{ ...mono, fontSize: 12, textTransform: "uppercase", color: "var(--color-fg-muted)" }}>Ejemplo</div>
            <p style={{ margin: "16px 0 0", fontSize: 16, lineHeight: "28px", color: "var(--color-fg)" }}>
              Un boleto de <strong style={{ color: "var(--color-accent)" }}>$350 MXN</strong> tiene un cargo por servicio
              de $27.50 (5% + $10). El comprador paga $377.50. El organizador recibe $350 menos la
              comisión de procesamiento de Stripe. Sin sorpresas.
            </p>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
window.Precios = Precios;
