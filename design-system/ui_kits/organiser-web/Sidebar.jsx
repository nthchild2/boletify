// Sidebar — organiser panel navigation (light chassis).
function Sidebar({ active, onNav }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
    { id: "events", label: "Eventos", icon: "ticket" },
    { id: "orders", label: "Órdenes", icon: "receipt" },
    { id: "settings", label: "Ajustes", icon: "settings" },
  ];
  return (
    <aside style={{
      position: "sticky", top: 0, height: "100vh", width: 240, flex: "none",
      display: "flex", flexDirection: "column",
      borderRight: "1px solid var(--color-border)", background: "var(--color-surface)",
    }}>
      <div style={{ height: 64, display: "flex", alignItems: "center", padding: "0 20px" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 850, letterSpacing: "-0.04em", color: "var(--color-fg)" }}>
          bolet<span style={{ color: "var(--color-accent)" }}>ify</span>
        </span>
      </div>
      <nav style={{ flex: 1, padding: "8px 12px" }}>
        {items.map((it) => {
          const on = active === it.id;
          return (
            <a key={it.id} href="#" onClick={(e) => { e.preventDefault(); onNav(it.id); }} style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 2,
              borderRadius: 14, padding: "10px 12px", fontSize: 13, fontWeight: 500,
              letterSpacing: "0.04em", textTransform: "uppercase",
              color: on ? "var(--color-primary-fg)" : "var(--color-fg-muted)",
              background: on ? "var(--color-primary)" : "transparent",
            }}>
              <i data-lucide={it.icon} style={{ width: 18, height: 18 }}></i>
              {it.label}
            </a>
          );
        })}
      </nav>
      <div style={{ borderTop: "1px solid var(--color-border)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9999, background: "var(--color-accent)", color: "var(--color-accent-fg)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>R</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-fg)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Raúl · Promotor</div>
          <div style={{ fontSize: 11, color: "var(--color-fg-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>raul@foroindie.mx</div>
        </div>
      </div>
    </aside>
  );
}
window.Sidebar = Sidebar;
