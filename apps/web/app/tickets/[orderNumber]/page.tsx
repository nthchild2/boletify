import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { Routes } from "@boletify/routes";
import { verifyOrderAccessKey } from "@boletify/api/codes";
import { formatEventDate, getPaidOrder } from "@boletify/api/tickets";
import { BrutalButton, Container, PageShell } from "../../../components/brutal-glass";
import { getTicketViewer } from "../../../lib/ticket-session";
import { QrViewer } from "./qr-viewer";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tus boletos - Boletify" };

export default async function TicketDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { orderNumber: rawOrderNumber } = await params;
  const { k } = await searchParams;
  const orderNumber = decodeURIComponent(rawOrderNumber).toUpperCase();

  const [order, viewer] = await Promise.all([getPaidOrder(orderNumber), getTicketViewer()]);

  // Allowed: the buyer (signed in or via magic link), or the signed link from the confirmation email.
  const viaEmailLink = typeof k === "string" && order !== null && verifyOrderAccessKey(order.orderNumber, k);
  const isBuyer = order !== null && viewer?.email === order.buyerEmail;

  if (!order || !(isBuyer || viaEmailLink)) {
    if (!viewer) redirect(Routes.MY_TICKETS);
    return (
      <PageShell mesh="ambient">
        <section className="py-16">
          <Container className="max-w-[640px]">
            <div className="rounded-lg border border-border bg-surface/80 p-6 shadow-brick-sm">
              <h1 className="font-display text-[32px] font-black leading-none tracking-[-0.03em] text-fg">
                No encontramos estos boletos
              </h1>
              <p className="mt-4 text-body-lg text-fg-secondary">
                Este pedido no está asociado a {viewer.email}.
              </p>
              <BrutalButton href={Routes.MY_TICKETS} variant="secondary" className="mt-6">
                Volver a mis boletos
              </BrutalButton>
            </div>
          </Container>
        </section>
      </PageShell>
    );
  }

  const tickets = await Promise.all(
    order.tickets.map(async (ticket) => ({
      ticketNumber: ticket.ticketNumber,
      tierName: ticket.tierName,
      status: ticket.status,
      svg: await QRCode.toString(ticket.qrCode, {
        type: "svg",
        margin: 1,
        errorCorrectionLevel: "M",
        color: { dark: "#08080C", light: "#FFFFFF" },
      }),
    })),
  );

  return (
    <QrViewer
      backHref={viewer ? Routes.MY_TICKETS : Routes.EVENTS}
      event={{
        title: order.event.title,
        dateLabel: formatEventDate(order.event.startDate),
        place: `${order.event.venueName} · ${order.event.city}`,
      }}
      orderNumber={order.orderNumber}
      tickets={tickets}
    />
  );
}
