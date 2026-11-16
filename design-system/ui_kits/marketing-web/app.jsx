// App — marketing-web orchestrator. Light-mode public site: nav, Precios, footer.
function MarketingApp() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-mesh-ambient)", color: "var(--color-fg)" }}>
      <window.MarketingNav />
      <window.Precios />
      <div style={{ marginTop: 96 }} />
      <window.MarketingFooter />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<MarketingApp />);
