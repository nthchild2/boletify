// SiteNav — sticky translucent buyer nav with the bolet·ify wordmark.
function SiteNav({ onHome }) {
  const { Button } = window.BoletifyDesignSystem_c6a0b5;
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 40, display: "flex", alignItems: "center",
      justifyContent: "space-between", borderBottom: "1px solid var(--color-border)",
      background: "var(--color-nav-tint)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      padding: "16px 48px",
    }}>
      <a href="#" onClick={(e) => { e.preventDefault(); onHome && onHome(); }}
        style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, letterSpacing: "-0.03em", color: "var(--color-fg)" }}>
        bolet<span style={{ color: "var(--color-primary)" }}>ify</span>
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-fg-muted)" }}>v0.0.2 beta</span>
        <Button variant="ghost" size="sm">Iniciar sesión</Button>
        <Button variant="primary" size="sm">Registrarse</Button>
      </div>
    </nav>
  );
}
window.SiteNav = SiteNav;
