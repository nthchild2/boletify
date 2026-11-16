import Link from "next/link";
import { Routes } from "@boletify/routes";
import { formatEventDate, isPastEvent, listOrdersForEmail, type OrderView } from "@boletify/api/tickets";
import { BrutalButton, Container, PageShell, SiteNav } from "../../components/brutal-glass";
import { getTicketViewer } from "../../lib/ticket-session";
import { cn } from "../../lib/utils";
import { AccessRequestForm } from "./access-request-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mis boletos - Boletify" };

const panel = "rounded-lg border border-border bg-surface/80 p-5 shadow-brick-sm md:p-6";
const overline = "font-body text-overline uppercase text-fg-muted";

function ticketSummary(order: OrderView): string {
  const byTier = new Map<string, number>();
  for (const t of order.tickets) byTier.set(t.tierName, (byTier.get(t.tierName) ?? 0) + 1);
  const count = order.tickets.length;
  const tiers = Array.from(byTier.entries())
    .map(([name, n]) => (byTier.size > 1 ? `${n}× ${name}` : name))
    .join(" · ");
  return `${count} ${count === 1 ? "boleto" : "boletos"} · ${tiers}`;
}

function OrderCard({ order, past }: { order: OrderView; past: boolean }) {
  return (
    <li className={cn(panel, "flex flex-col gap-5 sm:flex-row sm:items-center", past && "opacity-60")}>
      {order.event.coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={order.event.coverImageUrl}
          alt=""
          className="h-28 w-full rounded-md border border-border object-cover sm:h-24 sm:w-24"
        />
      ) : (
        <div className="hidden h-24 w-24 shrink-0 rounded-md border border-border bg-[radial-gradient(circle_at_50%_50%,rgba(198,255,46,0.18),transparent_60%)] sm:block" />
      )}
      <div className="min-w-0 flex-1">
        <div className={overline}>Pedido {order.orderNumber}</div>
        <h2 className="mt-1 font-display text-[24px] font-bold leading-tight text-fg">{order.event.title}</h2>
        <div className="mt-1 font-mono text-mono-md text-fg-secondary">
          {formatEventDate(order.event.startDate)}
        </div>
        <div className="text-body-sm text-fg-muted">
          {order.event.venueName} · {order.event.city}
        </div>
        <div className="mt-2 font-mono text-mono-md text-primary">{ticketSummary(order)}</div>
      </div>
      {past ? null : (
        <BrutalButton href={Routes.TICKET_DETAIL(order.orderNumber)} className="shrink-0">
          Ver boletos →
        </BrutalButton>
      )}
    </li>
  );
}

export default async function MyTicketsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const viewer = await getTicketViewer();
  const tab = query.tab === "pasados" ? "pasados" : "proximos";

  let body: React.ReactNode;
  if (!viewer) {
    body = (
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className={panel}>
          <div className={overline}>Compraste sin cuenta</div>
          <p className="mt-2 text-body-md text-fg-secondary">
            Escribe el correo que usaste al comprar y te mandamos un enlace para ver tus boletos.
          </p>
          {query.error === "enlace" ? (
            <p role="alert" className="mt-4 rounded-md border border-danger p-3 text-body-sm text-fg">
              Ese enlace ya se usó o caducó. Pide uno nuevo.
            </p>
          ) : null}
          <AccessRequestForm />
        </div>
        <div className={panel}>
          <div className={overline}>¿Tienes cuenta?</div>
          <p className="mt-2 text-body-md text-fg-secondary">
            Inicia sesión y verás los boletos comprados con el correo de tu cuenta.
          </p>
          <BrutalButton href={Routes.AUTH_SIGNIN} variant="secondary" className="mt-5">
            Iniciar sesión
          </BrutalButton>
        </div>
      </div>
    );
  } else {
    const orders = await listOrdersForEmail(viewer.email);
    const upcoming = orders.filter((o) => !isPastEvent(o.event.startDate));
    const past = orders.filter((o) => isPastEvent(o.event.startDate)).reverse();
    const shown = tab === "pasados" ? past : upcoming;

    body = (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2" role="tablist">
            {(
              [
                ["proximos", `Próximos (${upcoming.length})`],
                ["pasados", `Pasados (${past.length})`],
              ] as const
            ).map(([key, label]) => (
              <Link
                key={key}
                href={key === "pasados" ? "/tickets?tab=pasados" : "/tickets"}
                role="tab"
                aria-selected={tab === key}
                className={cn(
                  "rounded-md border px-4 py-2 font-body text-label uppercase tracking-[0.04em]",
                  tab === key
                    ? "border-border-ink bg-primary text-primary-fg"
                    : "border-border-strong text-fg-secondary hover:border-primary hover:text-primary",
                )}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 font-mono text-mono-md text-fg-muted">
            <span>{viewer.email}</span>
            {viewer.source === "guest" ? (
              <form action="/api/tickets/access/logout" method="post">
                <button type="submit" className="text-fg-secondary underline hover:text-primary">
                  Salir
                </button>
              </form>
            ) : null}
          </div>
        </div>

        {shown.length === 0 ? (
          <div className={cn(panel, "mt-8 max-w-[640px]")}>
            <p className="text-body-lg text-fg">
              {tab === "pasados" ? "Todavía no tienes eventos pasados." : "Aún no tienes boletos."}
            </p>
            <BrutalButton href={Routes.EVENTS} className="mt-5">
              Explorar eventos →
            </BrutalButton>
          </div>
        ) : (
          <ul className="mt-8 grid gap-5">
            {shown.map((order) => (
              <OrderCard key={order.orderNumber} order={order} past={tab === "pasados"} />
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <PageShell mesh="ambient">
      <SiteNav />
      <section className="border-t border-border py-12 md:py-20">
        <Container className="max-w-[1120px]">
          <div className={overline}>Tus accesos</div>
          <h1 className="mb-10 mt-3 font-display text-[44px] font-black leading-[0.95] tracking-[-0.03em] text-fg md:text-[72px]">
            Mis boletos
          </h1>
          {body}
        </Container>
      </section>
    </PageShell>
  );
}
