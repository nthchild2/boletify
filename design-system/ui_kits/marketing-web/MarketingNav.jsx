// MarketingNav — light marketing site nav: wordmark + section links + auth CTAs.
function MarketingNav() {
  const { Button } = window.BoletifyDesignSystem_c6a0b5;
  const link = {
    fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
    letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-fg-muted)",
    textDecoration: "none", cursor: "pointer",
  };
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 40, display: "flex", alignItems: "center",
      justifyContent: "space-between", borderBottom: "1px solid var(--color-border)",
      background: "var(--color-nav-tint)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      padding: "16px 48px",
    }}>
      <a href="#" onClick={(e) => e.preventDefault()}
        style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, letterSpacing: "-0.03em", color: "var(--color-fg)" }}>
        bolet<span style={{ color: "var(--color-accent)" }}>ify</span>
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <a href="#" onClick={(e) => e.preventDefault()} style={link}>Eventos</a>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ ...link, color: "var(--color-fg)" }}>Precios</a>
        <a href="#" onClick={(e) => e.preventDefault()} style={link}>Ayuda</a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button variant="ghost" size="sm">Iniciar sesión</Button>
          <Button variant="primary" size="sm">Crear evento</Button>
        </div>
      </div>
    </nav>
  );
}
window.MarketingNav = MarketingNav;
