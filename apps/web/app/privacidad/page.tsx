import { Container, PageShell, SiteNav, Footer } from "../../components/brutal-glass";

export const metadata = {
  title: "Aviso de Privacidad - Boletify",
  description: "Aviso de privacidad y protección de datos personales",
};

export default function PrivacidadPage() {
  return (
    <PageShell mesh="ambient">
      <SiteNav />
      <section className="border-t border-border py-20">
        <Container>
          <div className="font-body text-overline uppercase text-fg-muted">Legal</div>
          <h1 className="mt-3 font-display text-[40px] font-[850] leading-[0.95] tracking-[-0.03em] text-fg md:text-[56px]">
            Aviso de privacidad
          </h1>
          <p className="mt-4 font-mono text-mono-sm text-fg-muted">Última actualización: 1 de junio de 2026</p>

          <div className="mt-12 max-w-3xl space-y-8 text-body-md leading-7 text-fg-secondary">
            <div>
              <h2 className="font-body text-body-md font-semibold text-fg">1. Responsable del tratamiento</h2>
              <p className="mt-3">
                Boletify ("nosotros", "la plataforma") con domicilio en Ciudad de México, México,
                es responsable del tratamiento de tus datos personales conforme a la Ley Federal de
                Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).
              </p>
            </div>

            <div>
              <h2 className="font-body text-body-md font-semibold text-fg">2. Datos que recopilamos</h2>
              <p className="mt-3">
                Recopilamos los datos que nos proporcionas al crear una cuenta o comprar boletos:
                nombre, correo electrónico, y datos de pago (procesados por Stripe y Mercado Pago,
                no almacenados en nuestros servidores). Para organizadores, también recopilamos
                datos fiscales necesarios para el procesamiento de pagos.
              </p>
            </div>

            <div>
              <h2 className="font-body text-body-md font-semibold text-fg">3. Finalidades del tratamiento</h2>
              <p className="mt-3">
                Tus datos se utilizan para: procesar compras de boletos, enviarte confirmaciones
                y códigos QR, enviar recordatorios de eventos, permitir a los organizadores
                gestionar sus ventas, y contactarte en caso de cambios o cancelaciones de eventos.
              </p>
            </div>

            <div>
              <h2 className="font-body text-body-md font-semibold text-fg">4. Compartición de datos</h2>
              <p className="mt-3">
                Compartimos datos de compradores (nombre, email, tipo de boleto) con el organizador
                del evento correspondiente para fines de check-in y gestión del evento. No vendemos
                datos personales a terceros. Utilizamos procesadores de pago (Stripe, Mercado Pago)
                y servicios de correo (Resend) que actúan como encargados del tratamiento.
              </p>
            </div>

            <div>
              <h2 className="font-body text-body-md font-semibold text-fg">5. Derechos ARCO</h2>
              <p className="mt-3">
                Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus
                datos personales. Para ejercer estos derechos, envía un correo a{" "}
                <a href="mailto:privacidad@boletify.com" className="text-primary hover:underline">
                  privacidad@boletify.com
                </a>{" "}
                con tu nombre completo y la descripción de tu solicitud.
              </p>
            </div>

            <div>
              <h2 className="font-body text-body-md font-semibold text-fg">6. Cookies</h2>
              <p className="mt-3">
                Utilizamos cookies de sesión para mantener tu sesión activa y cookies funcionales
                para recordar tus preferencias (como el tema claro/oscuro). No utilizamos cookies
                de seguimiento publicitario.
              </p>
            </div>

            <div>
              <h2 className="font-body text-body-md font-semibold text-fg">7. Contacto</h2>
              <p className="mt-3">
                Para cualquier duda sobre este aviso de privacidad, contacta a{" "}
                <a href="mailto:privacidad@boletify.com" className="text-primary hover:underline">
                  privacidad@boletify.com
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
