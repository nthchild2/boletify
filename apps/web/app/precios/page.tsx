import { Container, PageShell, SiteNav, Footer } from "../../components/brutal-glass";

export const metadata = {
  title: "Precios - Boletify",
  description: "Comisiones transparentes para organizadores",
};

export default function PreciosPage() {
  return (
    <PageShell mesh="ambient">
      <SiteNav />
      <section className="border-t border-border py-20">
        <Container>
          <div className="font-body text-overline uppercase text-fg-muted">Transparencia total</div>
          <h1 className="mt-3 font-display text-[40px] font-[850] leading-[0.95] tracking-[-0.03em] text-fg md:text-[72px]">
            Precios<br />sin letra chica.
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg leading-8 text-fg-secondary">
            Sin sorpresas, sin cargos ocultos. El comprador ve exactamente lo que paga
            desde el primer clic.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-surface/80 p-8 shadow-brick-sm">
              <div className="font-mono text-mono-sm uppercase text-fg-muted">Cargo por servicio</div>
              <div className="mt-3 font-display text-[48px] font-black text-primary">5%</div>
              <div className="mt-1 font-mono text-mono-sm text-fg-muted">+ $10 MXN por boleto</div>
              <p className="mt-4 text-body-sm text-fg-secondary">
                Sobre el precio de venta. Para boletos de $100 MXN o menos, se elimina el cargo fijo.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-surface/80 p-8 shadow-brick-sm">
              <div className="font-mono text-mono-sm uppercase text-fg-muted">Eventos gratuitos</div>
              <div className="mt-3 font-display text-[48px] font-black text-primary">$0</div>
              <div className="mt-1 font-mono text-mono-sm text-fg-muted">Sin costo</div>
              <p className="mt-4 text-body-sm text-fg-secondary">
                Publica eventos gratuitos con RSVP y check-in por QR sin pagar nada.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-surface/80 p-8 shadow-brick-sm">
              <div className="font-mono text-mono-sm uppercase text-fg-muted">Pago OXXO</div>
              <div className="mt-3 font-display text-[48px] font-black text-primary">~$13</div>
              <div className="mt-1 font-mono text-mono-sm text-fg-muted">Cargo adicional al comprador</div>
              <p className="mt-4 text-body-sm text-fg-secondary">
                Para pagos en efectivo en OXXO. El organizador no absorbe este costo.
              </p>
            </div>
          </div>

          <div className="mt-16 rounded-[22px] border border-glass-edge bg-glass-tint p-8 shadow-glass-md backdrop-blur-glass-sm">
            <div className="font-mono text-mono-sm uppercase text-fg-muted">Ejemplo</div>
            <p className="mt-4 text-body-md leading-7 text-fg">
              Un boleto de <strong className="text-primary">$350 MXN</strong> tiene un cargo por servicio
              de $27.50 (5% + $10). El comprador paga $377.50. El organizador recibe $350 menos la
              comisión de procesamiento de Stripe. Sin sorpresas.
            </p>
          </div>
        </Container>
      </section>
      <Footer />
    </PageShell>
  );
}
