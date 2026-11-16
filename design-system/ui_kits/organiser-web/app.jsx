// App — organiser-web orchestrator (light dashboard with sidebar).
function OrgApp() {
  const [view, setView] = React.useState("dashboard");

  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [view]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-fg)" }}>
      <window.Sidebar active={view === "create" ? "events" : view} onNav={setView} />
      <main style={{ flex: 1, overflowX: "hidden" }}>
        {(view === "dashboard") && <window.Dashboard onCreate={() => setView("create")} />}
        {(view === "events") && <window.Dashboard onCreate={() => setView("create")} />}
        {(view === "create") && <window.CreateEvent onBack={() => setView("dashboard")} />}
        {(view === "orders" || view === "settings") && (
          <div style={{ padding: 40 }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 850, letterSpacing: "-0.03em", color: "var(--color-fg)" }}>{view === "orders" ? "Órdenes" : "Ajustes"}</h1>
            <p style={{ color: "var(--color-fg-muted)" }}>Sección de muestra — el kit se enfoca en Dashboard y Crear evento.</p>
          </div>
        )}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<OrgApp />);
