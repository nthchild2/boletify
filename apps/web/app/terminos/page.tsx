import { Container, PageShell, SiteNav, Footer } from "../../components/brutal-glass";

export const metadata = {
  title: "Términos de Servicio - Boletify",
  description: "Términos y condiciones de uso de la plataforma",
};

export default function TerminosPage() {
  return (
    <PageShell mesh="ambient">
      <SiteNav />
      <section className="border-t border-border py-20">
        <Container>
          <div className="font-body text-overline uppercase text-fg-muted">Legal</div>
          <h1 className="mt-3 font-display text-[40px] font-[850] leading-[0.95] tracking-[-0.03em] text-fg md:text-[56px]">
            Términos de servicio
          </h1>
          <p className="mt-4 font-mono text-mono-sm text-fg-muted">Última actualización: 1 de junio de 2026</p>

          <div className="mt-12 max-w-3xl space-y-8 text-body-md leading-7 text-fg-secondary">
            <div>
              <h2 className="font-body text-body-md font-semibold text-fg">1. Aceptación de los términos</h2>
              <p className="mt-3">
                Al utilizar Boletify ("la plataforma"), aceptas estos términos de servicio en su
                totalidad. Si no estás de acuerdo con alguno de estos términos, no utilices la
                plataforma.
              </p>
            </div>

            <div>
              <h2 className="font-body text-body-md font-semibold text-fg">2. Descripción del servicio</h2>
              <p className="mt-3">
                Boletify es una plataforma de venta de boletos que conecta a organizadores de
                eventos con compradores. Boletify actúa como intermediario tecnológico y no es
                el organizador ni promotor de los eventos publicados.
              </p>
            </div>

            <div>
              <h2 className="font-body text-body-md font-semibold text-fg">3. Compradores</h2>
              <p className="mt-3">
                Al comprar un boleto, estás celebrando una transacción con el organizador del
                evento. Boletify procesa el pago y genera tu boleto digital con código QR. Las
                políticas de cancelación, reembolso y cambios son responsabilidad del organizador
                de cada evento.
              </p>
            </div>

            <div>
              <h2 className="font-body text-body-md font-semibold text-fg">4. Organizadores</h2>
              <p className="mt-3">
                Los organizadores son responsables de la veracidad de la información de sus
                eventos, del cumplimiento de los mismos, y de las políticas de reembolso que
                establezcan. Boletify cobra una comisión del 5% + $10 MXN por boleto vendido.
                Los pagos se depositan vía Stripe Connect en un plazo de 7 días hábiles.
              </p>
            </div>

            <div>
              <h2 className="font-body text-body-md font-semibold text-fg">5. Pagos en OXXO</h2>
              <p className="mt-3">
                Los pagos en OXXO generan una referencia con vigencia de 72 horas. Si el pago
                no se completa en ese plazo, la referencia expira y los boletos se liberan para
                venta. El cargo de conveniencia de OXXO (~$13 MXN) es cubierto por el comprador.
              </p>
            </div>

            <div>
              <h2 className="font-body text-body-md font-semibold text-fg">6. Propiedad intelectual</h2>
              <p className="mt-3">
                El nombre "Boletify", su logotipo, diseño y código fuente son propiedad de
                Boletify. El contenido de los eventos (imágenes, descripciones, etc.) es
                responsabilidad de cada organizador.
              </p>
            </div>

            <div>
              <h2 className="font-body text-body-md font-semibold text-fg">7. Limitación de responsabilidad</h2>
              <p className="mt-3">
                Boletify no se hace responsable por la cancelación, modificación o calidad de
                los eventos publicados por terceros. En caso de disputa entre comprador y
                organizador, Boletify facilitará la comunicación pero la resolución es
                responsabilidad de las partes.
              </p>
            </div>

            <div>
              <h2 className="font-body text-body-md font-semibold text-fg">8. Legislación aplicable</h2>
              <p className="mt-3">
                Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier
                controversia será resuelta ante los tribunales competentes de la Ciudad de México.
                Para disputas relacionadas con la Ley Federal de Protección al Consumidor, puedes
                contactar a la PROFECO.
              </p>
            </div>

            <div>
              <h2 className="font-body text-body-md font-semibold text-fg">9. Contacto</h2>
              <p className="mt-3">
                Para cualquier duda sobre estos términos:{" "}
                <a href="mailto:legal@boletify.com" className="text-primary hover:underline">
                  legal@boletify.com
                </a>
              </p>
            </div>
          </div>
        </Container>
      </section>
      <Footer />
    </PageShell>
  );
}
