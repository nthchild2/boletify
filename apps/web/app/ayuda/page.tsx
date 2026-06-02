import { Container, PageShell, SiteNav, Footer } from "../../components/brutal-glass";

export const metadata = {
  title: "Ayuda - Boletify",
  description: "Preguntas frecuentes y soporte",
};

const FAQ = [
  {
    q: "¿Cómo compro boletos?",
    a: "Busca tu evento en la página principal, selecciona la cantidad de boletos y completa el pago con tarjeta, OXXO o Mercado Pago. Recibirás un correo de confirmación con tu código QR.",
  },
  {
    q: "¿Puedo pagar en OXXO?",
    a: "Sí. Al momento del checkout, selecciona OXXO como método de pago. Recibirás una referencia por correo que puedes presentar en cualquier tienda OXXO. Tienes 72 horas para completar el pago antes de que expire.",
  },
  {
    q: "¿Cómo funciona el check-in con QR?",
    a: "Al comprar tu boleto recibes un código QR único por correo y en la sección 'Mis Boletos'. El organizador escanea tu QR en la puerta del evento con la app de Boletify. Cada código es de un solo uso.",
  },
  {
    q: "¿Puedo cancelar mi compra?",
    a: "Las políticas de cancelación y reembolso las define cada organizador. Consulta los detalles del evento o contacta directamente al organizador.",
  },
  {
    q: "Soy organizador, ¿cómo publico un evento?",
    a: "Crea una cuenta, ve al Panel de Control y selecciona 'Crear evento'. Configura los detalles, agrega tus tipos de boleto con precios, y publica cuando estés listo. Los pagos se depositan en tu cuenta vía Stripe Connect.",
  },
  {
    q: "¿Cuánto cobra Boletify?",
    a: "5% + $10 MXN por boleto vendido. Para boletos de $100 MXN o menos, se elimina el cargo fijo. Los eventos gratuitos no tienen costo. Consulta nuestra página de Precios para más detalles.",
  },
  {
    q: "¿Cuándo recibo mi pago como organizador?",
    a: "Los pagos se procesan vía Stripe Connect y se depositan en tu cuenta bancaria en un plazo de 7 días hábiles después del evento.",
  },
];

export default function AyudaPage() {
  return (
    <PageShell mesh="ambient">
      <SiteNav />
      <section className="border-t border-border py-20">
        <Container>
          <div className="font-body text-overline uppercase text-fg-muted">Centro de ayuda</div>
          <h1 className="mt-3 font-display text-[40px] font-[850] leading-[0.95] tracking-[-0.03em] text-fg md:text-[72px]">
            ¿Dudas?<br />Va.
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg leading-8 text-fg-secondary">
            Si no encuentras tu respuesta aquí, escríbenos a{" "}
            <a href="mailto:hola@boletify.com" className="text-primary hover:underline">
              hola@boletify.com
            </a>
          </p>

          <div className="mt-16 space-y-6">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-surface/80 p-6 shadow-brick-sm"
              >
                <div className="font-body text-body-md font-semibold text-fg">{item.q}</div>
                <p className="mt-3 text-body-sm leading-7 text-fg-secondary">{item.a}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <Footer />
    </PageShell>
  );
}
