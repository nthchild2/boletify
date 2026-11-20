"use client";

import Link from "next/link";
import { trpc } from "../../../lib/trpc";
import {
  EventStateBadge,
  SoldBar,
  StatCard,
  formatMoney,
  formatShortDate,
} from "../org-ui";

export default function OrgDashboardPage() {
  const { data, isLoading, error } = trpc.sales.overview.useQuery(undefined, {
    refetchInterval: 30_000,
  });
  const totals = data?.totals;
  const events = data?.events ?? [];

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-body text-[11px] uppercase tracking-[0.06em] text-fg-muted">
            Panel de organizador
          </div>
          <h1 className="mt-2 font-display text-[36px] font-[850] leading-[0.95] tracking-[-0.03em] text-fg">
            Dashboard
          </h1>
        </div>
        <Link
          href="/org/events/create"
          className="inline-flex items-center gap-2 rounded-md border border-border-ink bg-primary px-5 py-3 font-body text-[13px] font-semibold uppercase tracking-[0.04em] text-primary-fg shadow-brick-md transition hover:bg-primary-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 2v12M2 8h12" />
          </svg>
          Crear evento
        </Link>
      </div>

      {error ? (
        <div className="mb-8 rounded-lg border border-danger/40 p-4 text-[14px] text-fg">
          {error.message}
        </div>
      ) : null}

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Eventos en venta"
          value={isLoading ? "…" : String(totals?.activeEvents ?? 0)}
        />
        <StatCard
          label="Boletos vendidos"
          value={isLoading ? "…" : String(totals?.sold ?? 0)}
        />
        <StatCard
          label="Ventas brutas"
          value={isLoading ? "…" : formatMoney(totals?.gross ?? 0)}
          hint="Lo que pagaron los compradores"
        />
        <StatCard
          label="Tu neto"
          value={isLoading ? "…" : formatMoney(totals?.net ?? 0)}
          hint="Boletos menos descuentos"
          accent
        />
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-body text-[13px] font-semibold uppercase tracking-[0.04em] text-fg-muted">
          Eventos
        </h2>
      </div>

      {!isLoading && events.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-strong p-10 text-center">
          <div className="font-display text-[24px] font-bold text-fg">
            Crea tu primer evento
          </div>
          <p className="mt-2 text-[14px] text-fg-muted">y empieza a vender.</p>
          <Link
            href="/org/events/create"
            className="mt-5 inline-flex rounded-md border border-border-ink bg-primary px-5 py-3 font-body text-[13px] font-semibold uppercase tracking-[0.04em] text-primary-fg shadow-brick-md"
          >
            Crear evento
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-border bg-surface text-left font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-muted">
                <th className="px-4 py-3">Evento</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Vendidos</th>
                <th className="px-4 py-3 text-right">Bruto</th>
                <th className="px-4 py-3 text-right">Neto</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-border transition last:border-0 hover:bg-surface-raised"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/org/events/${event.id}`}
                      className="font-body text-[14px] font-medium text-fg hover:text-primary"
                    >
                      {event.title}
                    </Link>
                    <div className="text-[12px] text-fg-muted">
                      {event.venueName}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[13px] text-fg-secondary">
                    {formatShortDate(event.startDate)}
                  </td>
                  <td className="px-4 py-3">
                    <SoldBar sold={event.sold} capacity={event.capacity} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[13px] text-fg-secondary">
                    {formatMoney(event.gross)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[13px] text-fg">
                    {formatMoney(event.net)}
                  </td>
                  <td className="px-4 py-3">
                    <EventStateBadge
                      status={event.status}
                      startDate={event.startDate}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
