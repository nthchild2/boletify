// Dashboard — organiser home: stats, quick actions, recent events table.
function Dashboard({ onCreate }) {
  const { StatStrip, Button } = window.BoletifyDesignSystem_c6a0b5;
  const events = window.ORG_EVENTS;

  const statusPill = (status) => {
    const map = {
      published: { label: "Publicado", bg: "rgba(8,8,12,0.06)", color: "var(--color-fg)", bd: "var(--color-border-strong)" },
      draft: { label: "Borrador", bg: "transparent", color: "var(--color-fg-muted)", bd: "var(--color-border)" },
      cancelled: { label: "Cancelado", bg: "rgba(122,16,32,0.08)", color: "var(--color-danger)", bd: "var(--color-danger)" },
    };
    const c = map[status] || map.draft;
    return <span style={{ display: "inline-flex", borderRadius: 9999, border: `1px solid ${c.bd}`, background: c.bg, color: c.color, padding: "3px 10px", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{c.label}</span>;
  };

  return (
    <div style={{ padding: 40, maxWidth: 1160 }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-fg-muted)" }}>Panel de organizador</div>
        <h1 style={{ margin: "8px 0 0", fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 850, letterSpacing: "-0.03em", color: "var(--color-fg)" }}>Dashboard</h1>
      </div>

      <StatStrip stats={window.ORG_STATS} />

      <div style={{ margin: "32px 0", display: "flex", gap: 12 }}>
        <Button onClick={onCreate}>+ Crear evento</Button>
        <Button variant="secondary">Exportar compradores (CSV)</Button>
      </div>

      <div>
        <h2 style={{ margin: "0 0 16px", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-fg-muted)" }}>Eventos recientes</h2>
        <div style={{ overflow: "hidden", borderRadius: 14, border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                {["Evento", "Fecha", "Vendidos", "Venta", "Status", ""].map((h, i) => (
                  <th key={i} style={{ textAlign: i >= 2 && i <= 3 ? "right" : "left", padding: "12px 16px", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-fg-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-fg)" }}>{e.title}</div>
                    <div style={{ fontSize: 12, color: "var(--color-fg-muted)" }}>{e.venue} · {e.city}</div>
                  </td>
                  <td style={{ padding: "14px 16px", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--color-fg-secondary)" }}>{e.date}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--color-fg)" }} className="tnum">{e.total ? `${e.sold}/${e.total}` : "—"}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--color-fg)" }} className="tnum">{e.revenue}</td>
                  <td style={{ padding: "14px 16px" }}>{statusPill(e.status)}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right" }}><a href="#" onClick={(ev) => ev.preventDefault()} style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-accent)" }}>Ver</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
window.Dashboard = Dashboard;
