import { notFound } from "next/navigation";
import { getCheckoutEvent } from "@boletify/api/checkout";
import { Container, PageShell, SiteNav } from "../../../components/brutal-glass";
import { CheckoutForm, type CheckoutEventView } from "./checkout-form";

export const dynamic = "force-dynamic";

function formatEventDate(date: Date): string {
  return date
    .toLocaleString("es-MX", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Mexico_City",
    })
    .toUpperCase();
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  if (!/^\d+$/.test(eventId)) notFound();

  const event = await getCheckoutEvent(Number(eventId));
  if (!event) notFound();

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
  const paymentsReady = Boolean(process.env.STRIPE_SECRET_KEY && publishableKey);

  const view: CheckoutEventView = {
    id: event.id,
    title: event.title,
    venueName: event.venueName,
    city: event.city,
    dateLabel: formatEventDate(event.startDate),
    onSale: event.onSale,
    tiers: event.tiers,
  };

  return (
    <PageShell mesh="ambient">
      <SiteNav />
      <section className="border-t border-border py-12 md:py-20">
        <Container className="max-w-[1120px]">
          <CheckoutForm event={view} publishableKey={publishableKey} paymentsReady={paymentsReady} />
        </Container>
      </section>
    </PageShell>
  );
}
