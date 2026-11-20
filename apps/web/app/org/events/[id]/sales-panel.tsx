"use client";

import { useMemo, useState } from "react";
import { trpc } from "../../../../lib/trpc";
import { cn } from "../../../../lib/utils";
import { PAYMENT_METHOD_LABEL, StatCard, formatMoney } from "../../org-ui";

const MAX_DAYS = 60;

/** Days from the first sale to today (or the last sale), filling days without sales with 0. */
function fillDays(daily: Array<{ day: string; tickets: number; net: number }>) {
  if (daily.length === 0) return [];
  const byDay = new Map(daily.map((d) => [d.day, d]));
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Mexico_City",
  });
  const last =
    daily[daily.length - 1].day > today ? daily[daily.length - 1].day : today;
  const end = new Date(`${last}T12:00:00Z`);
  let start = new Date(`${daily[0].day}T12:00:00Z`);
  const earliest = new Date(end.getTime() - (MAX_DAYS - 1) * 86_400_000);
  if (start < earliest) start = earliest;
  const out: Array<{ day: string; tickets: number; net: number }> = [];
  for (let t = start.getTime(); t <= end.getTime(); t += 86_400_000) {
    const day = new Date(t).toISOString().slice(0, 10);
    out.push(byDay.get(day) ?? { day, tickets: 0, net: 0 });
  }
  return out;
}

function dayLabel(day: string): string {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

const sectionTitle =
  "font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-muted";

export function SalesPanel({ eventId }: { eventId: number }) {
  const { data, isLoading, error } = trpc.sales.event.useQuery(
    { eventId },
    { refetchInterval: 30_000 },
  );
  const days = useMemo(() => fillDays(data?.daily ?? []), [data?.daily]);

  if (error)
    return (
      <div className="rounded-lg border border-danger/40 p-4 text-[14px] text-fg">
        {error.message}
      </div>
    );
  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  const { summary, tiers, paymentMethods, orders } = data;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Vendidos"
          value={`${summary.sold}/${summary.capacity}`}
        />
        <StatCard
          label="Bruto"
          value={formatMoney(summary.gross)}
          hint="Pagado por compradores, con cargo por servicio"
        />
        <StatCard
          label="Tu neto"
          value={formatMoney(summary.net)}
          hint="Boletos menos descuentos"
          accent
        />
        <StatCard
          label="Entradas"
          value={`${summary.checkedIn}/${summary.sold}`}
          hint="Check-in en puerta"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className={sectionTitle}>Boletos vendidos por día</h2>
          {days.length === 0 ? (
            <p className="mt-6 text-[14px] text-fg-muted">
              Todavía no hay ventas.
            </p>
          ) : (
            <DailyBars days={days} />
          )}
        </section>

        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className={sectionTitle}>Por tipo de boleto</h2>
          <ul className="mt-4 space-y-4">
            {tiers.map((tier) => {
              const pct =
                tier.quantity > 0
                  ? Math.min(100, (tier.sold / tier.quantity) * 100)
                  : 0;
              return (
                <li key={tier.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-body text-[14px] font-medium text-fg">
                      {tier.name}
                    </span>
                    <span className="font-mono text-[13px] text-fg-secondary">
                      {tier.sold}/{tier.quantity} ·{" "}
                      {formatMoney(tier.sold * tier.price)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-sunken">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-[12px] text-fg-muted">
            Ingresos por tipo a precio de lista, antes de descuentos.
          </p>

          <h2 className={cn(sectionTitle, "mt-8")}>Métodos de pago</h2>
          {orders === 0 ? (
            <p className="mt-3 text-[14px] text-fg-muted">—</p>
          ) : (
            <ul className="mt-3 space-y-1 font-mono text-[13px] text-fg-secondary">
              {paymentMethods.map((m) => (
                <li key={m.method}>
                  {PAYMENT_METHOD_LABEL[m.method] ?? m.method}:{" "}
                  {Math.round((m.orders / orders) * 100)}% ({m.orders}{" "}
                  {m.orders === 1 ? "pedido" : "pedidos"})
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <BuyersTable eventId={eventId} />
    </div>
  );
}

/** Single-series daily bar chart: one hue, hover value per bar, table fallback for screen readers. */
function DailyBars({
  days,
}: {
  days: Array<{ day: string; tickets: number; net: number }>;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...days.map((d) => d.tickets));
  const active = hover !== null ? days[hover] : null;

  return (
    <div className="mt-4">
      <div className="h-6 font-mono text-[12px] text-fg-secondary" aria-hidden>
        {active
          ? `${dayLabel(active.day)} · ${active.tickets} boletos · ${formatMoney(active.net)}`
          : `Máximo ${max} por día`}
      </div>
      <div
        className="relative mt-2 h-40 border-b border-border"
        aria-hidden
        onMouseLeave={() => setHover(null)}
      >
        <div className="absolute inset-x-0 top-0 border-t border-dashed border-border" />
        <div className="flex h-full items-end gap-[2px]">
          {days.map((d, i) => (
            <div
              key={d.day}
              className="flex h-full min-w-0 flex-1 items-end"
              onMouseEnter={() => setHover(i)}
              title={`${dayLabel(d.day)}: ${d.tickets} boletos`}
            >
              <div
                className={cn(
                  "mx-auto w-full max-w-[28px] rounded-t-[4px] bg-primary transition-opacity",
                  hover !== null && hover !== i && "opacity-40",
                )}
                style={{
                  height:
                    d.tickets > 0
                      ? `${Math.max(3, (d.tickets / max) * 100)}%`
                      : 0,
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        className="mt-1.5 flex justify-between font-mono text-[11px] text-fg-muted"
        aria-hidden
      >
        <span>{dayLabel(days[0].day)}</span>
        <span>{dayLabel(days[days.length - 1].day)}</span>
      </div>
      <table className="sr-only">
        <caption>Boletos vendidos por día</caption>
        <thead>
          <tr>
            <th>Día</th>
            <th>Boletos</th>
            <th>Neto</th>
          </tr>
        </thead>
        <tbody>
          {days
            .filter((d) => d.tickets > 0)
            .map((d) => (
              <tr key={d.day}>
                <td>{dayLabel(d.day)}</td>
                <td>{d.tickets}</td>
                <td>{formatMoney(d.net)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

const PAGE_SIZE = 25;

function BuyersTable({ eventId }: { eventId: number }) {
  const [page, setPage] = useState(1);
  const { data, isFetching } = trpc.sales.buyers.useQuery(
    { eventId, page, pageSize: PAGE_SIZE },
    { placeholderData: (prev) => prev },
  );
  const pages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className={sectionTitle}>
          Compradores {data ? `(${data.total} boletos)` : ""}
        </h2>
        <a
          href={`/api/org/export/buyers?eventId=${eventId}`}
          className="font-body text-[12px] font-semibold uppercase tracking-[0.04em] text-primary hover:underline"
        >
          📥 Exportar CSV
        </a>
      </div>
      <div
        className={cn(
          "overflow-x-auto rounded-lg border border-border",
          isFetching && "opacity-70",
        )}
      >
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-border bg-surface text-left font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-muted">
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Boleto</th>
              <th className="px-4 py-3">Pago</th>
              <th className="px-4 py-3">Check-in</th>
            </tr>
          </thead>
          <tbody>
            {data?.rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-[14px] text-fg-muted"
                >
                  Aún no hay compradores.
                </td>
              </tr>
            ) : null}
            {data?.rows.map((row) => (
              <tr
                key={row.ticketNumber}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3 text-[14px] text-fg">
                  {row.attendeeName || "—"}
                </td>
                <td className="px-4 py-3 text-[13px] text-fg-secondary">
                  {row.buyerEmail}
                </td>
                <td className="px-4 py-3">
                  <div className="text-[13px] text-fg">{row.tierName}</div>
                  <div className="font-mono text-[11px] text-fg-muted">
                    {row.ticketNumber}
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] text-fg-secondary">
                  {PAYMENT_METHOD_LABEL[row.paymentMethod ?? "card"] ??
                    row.paymentMethod}
                </td>
                <td className="px-4 py-3 font-mono text-[12px]">
                  {row.checkedIn ? (
                    <span className="text-fg">
                      ✅{" "}
                      {row.checkedInAt
                        ? new Date(row.checkedInAt).toLocaleTimeString(
                            "es-MX",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                              timeZone: "America/Mexico_City",
                            },
                          )
                        : "Entró"}
                    </span>
                  ) : (
                    <span className="text-fg-muted">Pendiente</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 ? (
        <div className="mt-3 flex items-center justify-end gap-3 font-mono text-[12px] text-fg-secondary">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border border-border-strong px-3 py-1.5 disabled:opacity-40"
          >
            ← Anterior
          </button>
          <span>
            {page} / {pages}
          </span>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-border-strong px-3 py-1.5 disabled:opacity-40"
          >
            Siguiente →
          </button>
        </div>
      ) : null}
    </section>
  );
}
