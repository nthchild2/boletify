// App — buyer-web orchestrator. Simple state router: home → detail → checkout → ticket.
function App() {
  const events = window.BOLETIFY_EVENTS;
  const [route, setRoute] = React.useState({ name: "home", id: events[0].id });
  const event = events.find((e) => e.id === route.id) || events[0];

  // Re-render Lucide icons after each route change.
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
    window.scrollTo({ top: 0 });
  }, [route]);

  const go = (name, id) => setRoute({ name, id: id || route.id });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-mesh)", color: "var(--color-fg)" }}>
      <window.SiteNav onHome={() => go("home")} />
      {route.name === "home" && <window.Home onOpen={(id) => go("detail", id)} />}
      {route.name === "detail" && <window.EventDetail event={event} onBack={() => go("home")} onBuy={() => go("checkout")} />}
      {route.name === "checkout" && <window.Checkout event={event} onBack={() => go("detail")} onPay={() => go("ticket")} />}
      {route.name === "ticket" && <window.TicketView event={event} onHome={() => go("home")} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
