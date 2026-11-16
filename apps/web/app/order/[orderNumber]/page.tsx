import QRCode from "qrcode";
import { Routes, formatMxnPrice } from "@boletify/routes";
import { getOrderForBuyer, type BuyerOrder } from "@boletify/api/checkout";
import { BrutalButton, Container, PageShell, SiteNav } from "../../../components/brutal-glass";

export const dynamic = "force-dynamic";

const panel = "rounded-lg border border-border bg-surface/80 p-5 shadow-brick-sm md:p-6";
const overline = "font-body text-overline uppercase text-fg-muted";

function formatEventDate(date: Date): string {
  return date
    .toLocaleString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Mexico_City",
    })
    .toUpperCase();
}

async function loadOrder(orderNumber: string, clientSecret: string | undefined): Promise<BuyerOrder | null> {
  if (!clientSecret) return null;
  try {
    return await getOrderForBuyer(orderNumber, clientSecret);
  } catch (err) {
    console.error("[order] could not load order", err);
    return null;
  }
}

function Message({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className={`${panel} max-w-[640px]`}>
      <h1 className="font-display text-[36px] font-black leading-none tracking-[-0.03em] text-fg">{title}</h1>
      <p className="mt-4 text-body-lg text-fg-secondary">{body}</p>
      {children ? <div className="mt-6 flex flex-wrap gap-4">{children}</div> : null}
    </div>
  );
}

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { orderNumber } = await params;
  const query = await searchParams;
  const clientSecret =
    typeof query.payment_intent_client_secret === "string" ? query.payment_intent_client_secret : undefined;
  const redirectStatus = typeof query.redirect_status === "string" ? query.redirect_status : undefined;

  const order = await loadOrder(decodeURIComponent(orderNumber), clientSecret);

  let content: React.ReactNode;
  if (!order) {
    content = (
      <Message
        title="No encontramos este pedido"
        body="Este enlace no es válido o está incompleto. Si acabas de comprar, escríbenos con tu número de pedido."
      >
        <BrutalButton href={Routes.EVENTS} variant="secondary">
          Ver eventos
        </BrutalButton>
      </Message>
    );
  } else if (order.status === "paid") {
    const ticketQrs = await Promise.all(
      order.tickets.map(async (ticket) => ({
        ...ticket,
        svg: await QRCode.toString(ticket.qrCode, {
          type: "svg",
          margin: 1,
          errorCorrectionLevel: "M",
          color: { dark: "#08080C", light: "#FFFFFF" },
        }),
      })),
    );

    content = (
      <div>
        <div className={overline}>Pedido {order.orderNumber} · pagado</div>
        <h1 className="mt-3 font-display text-[44px] font-black leading-[0.95] tracking-[-0.03em] text-fg md:text-[72px]">
          Listo. Nos vemos en {order.event.venueName}.
        </h1>
        <p className="mt-4 max-w-[720px] text-body-lg text-fg-secondary">
          {order.event.title} · {formatEventDate(order.event.startDate)}. Compra a nombre de{" "}
          <span className="text-fg">{order.buyerEmail}</span>. Guarda esta página y muestra el código QR en
          la entrada; cada boleto tiene el suyo.
        </p>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <ul className="grid gap-6 sm:grid-cols-2">
            {ticketQrs.map((ticket) => (
              <li key={ticket.ticketNumber} className={panel}>
                <div className={overline}>{ticket.tierName}</div>
                <div
                  className="mt-4 overflow-hidden rounded-md border border-border-ink bg-white p-2 [&>svg]:h-auto [&>svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: ticket.svg }}
                  role="img"
                  aria-label={`Código QR del boleto ${ticket.ticketNumber}`}
                />
                <div className="mt-4 font-mono text-mono-md text-fg">{ticket.ticketNumber}</div>
              </li>
            ))}
          </ul>

          <div className={panel}>
            <div className={overline}>Resumen</div>
            <dl className="mt-4 space-y-3 font-mono text-mono-md">
              <div className="flex justify-between gap-4 text-fg-secondary">
                <dt>Boletos</dt>
                <dd>{order.tickets.length}</dd>
              </div>
              <div className="flex justify-between gap-4 text-fg-secondary">
                <dt>Subtotal</dt>
                <dd>{formatMxnPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4 text-fg-secondary">
                <dt>Cargo por servicio</dt>
                <dd>{formatMxnPrice(order.serviceFee)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-border pt-3 text-[20px] text-fg">
                <dt>Total pagado</dt>
                <dd className="text-primary">{formatMxnPrice(order.total)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    );
  } else if (order.status === "pending" && redirectStatus !== "failed") {
    content = (
      <Message
        title="Estamos confirmando tu pago"
        body={`Pedido ${order.orderNumber}. Esto suele tardar unos segundos; recarga la página para ver tus boletos.`}
      />
    );
  } else if (order.status === "pending") {
    content = (
      <Message
        title="El pago no se completó"
        body="Tu banco rechazó o canceló el cargo. No se hizo ningún cobro. Puedes intentarlo de nuevo con otra tarjeta."
      >
        <BrutalButton href={Routes.CHECKOUT(String(order.event.id))}>Intentar de nuevo</BrutalButton>
      </Message>
    );
  } else {
    content = (
      <Message
        title="Este pedido expiró"
        body={`Pedido ${order.orderNumber}. No se completó el pago a tiempo y los boletos volvieron a la venta. No se hizo ningún cobro.`}
      >
        <BrutalButton href={Routes.CHECKOUT(String(order.event.id))}>Comprar de nuevo</BrutalButton>
      </Message>
    );
  }

  return (
    <PageShell mesh="ambient">
      <SiteNav />
      <section className="border-t border-border py-12 md:py-20">
        <Container className="max-w-[1120px]">{content}</Container>
      </section>
    </PageShell>
  );
}
