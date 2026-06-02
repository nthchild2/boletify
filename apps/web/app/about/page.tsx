import { Container, PageShell, SiteNav, Footer } from "../../components/brutal-glass";

export const metadata = {
  title: "Nosotros - Boletify",
  description: "La plataforma de ticketing transparente para CDMX",
};

export default function AboutPage() {
  return (
    <PageShell mesh="ambient">
      <SiteNav />
      <section className="border-t border-border py-20">
        <Container>
          <div className="font-body text-overline uppercase text-fg-muted">Quiénes somos</div>
          <h1 className="mt-3 font-display text-[40px] font-[850] leading-[0.95] tracking-[-0.03em] text-fg md:text-[72px]">
            La noche<br />merece mejor.
          </h1>

          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <div className="space-y-6 text-body-lg leading-8 text-fg-secondary">
              <p>
                Boletify nació de una frustración simple: comprar boletos para un show en CDMX
                no debería sentirse como una estafa. Cargos ocultos, fees sorpresa al final del
                checkout, y plataformas que tratan al organizador independiente como ciudadano
                de segunda.
              </p>
              <p>
                Construimos Boletify para la escena independiente de música en vivo en la Ciudad
                de México. Para el organizador que arma shows en foros, bares y espacios
                alternativos. Para el fan que quiere saber exactamente cuánto va a pagar antes
                de dar clic.
              </p>
              <p>
                Transparencia total en fees. Soporte para pagos en OXXO (porque no todos tienen
                tarjeta). Check-in por QR sin apps extras. Y una comisión que tiene sentido.
              </p>
            </div>

            <div className="space-y-8">
              <div className="rounded-lg border border-border bg-surface/80 p-6 shadow-brick-sm">
                <div className="font-mono text-mono-sm uppercase text-primary">Misión</div>
                <p className="mt-3 text-body-md text-fg">
                  Democratizar el acceso a eventos de música en vivo con tecnología transparente
                  y accesible para organizadores independientes y sus fans.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-surface/80 p-6 shadow-brick-sm">
                <div className="font-mono text-mono-sm uppercase text-primary">Hecho en</div>
                <p className="mt-3 text-body-md text-fg">
                  Ciudad de México 🇲🇽
                </p>
              </div>
              <div className="rounded-lg border border-border bg-surface/80 p-6 shadow-brick-sm">
                <div className="font-mono text-mono-sm uppercase text-primary">Contacto</div>
                <p className="mt-3 text-body-md text-fg">
                  <a href="mailto:hola@boletify.com" className="text-primary hover:underline">
                    hola@boletify.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <Footer />
    </PageShell>
  );
}
