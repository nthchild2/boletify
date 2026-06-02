"use client";

import Link from "next/link";
import { trpc } from "../../../lib/trpc";

export default function OrgDashboardPage() {
  const { data: events, isLoading } = trpc.events.listByOrganiser.useQuery();

  const draftCount = events?.filter((e) => e.status === "draft").length ?? 0;
  const publishedCount =
    events?.filter((e) => e.status === "published").length ?? 0;
  const totalEvents = events?.length ?? 0;

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="font-body text-[11px] uppercase tracking-[0.06em] text-fg-muted">
          Panel de organizador
        </div>
        <h1 className="mt-2 font-display text-[36px] font-[850] leading-[0.95] tracking-[-0.03em] text-fg">
          Dashboard
        </h1>
      </div>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total eventos" value={isLoading ? "..." : String(totalEvents)} />
        <StatCard label="Publicados" value={isLoading ? "..." : String(publishedCount)} accent />
        <StatCard label="Borradores" value={isLoading ? "..." : String(draftCount)} />
      </div>

      {/* Quick actions */}
      <div className="mb-10">
        <h2 className="mb-4 font-body text-[13px] font-semibold uppercase tracking-[0.04em] text-fg-muted">
          Acciones rápidas
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/org/events/create"
            className="inline-flex items-center gap-2 rounded-md border border-border-ink bg-primary px-5 py-3 font-body text-[13px] font-semibold uppercase tracking-[0.04em] text-primary-fg shadow-brick-md transition hover:bg-primary-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 2v12M2 8h12" />
            </svg>
            Crear evento
          </Link>
          <Link
            href="/org/events"
            className="inline-flex items-center gap-2 rounded-md border border-border-strong px-5 py-3 font-body text-[13px] font-semibold uppercase tracking-[0.04em] text-fg transition hover:border-primary hover:text-primary"
          >
            Ver todos los eventos
          </Link>
        </div>
      </div>

      {/* Recent events */}
      {events && events.length > 0 && (
        <div>
          <h2 className="mb-4 font-body text-[13px] font-semibold uppercase tracking-[0.04em] text-fg-muted">
            Eventos recientes
          </h2>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-4 py-3 text-left font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-muted">
                    Evento
                  </th>
                  <th className="px-4 py-3 text-left font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-muted">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-muted">
                    Status
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 5).map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-border last:border-0 transition hover:bg-surface-raised"
                  >
                    <td className="px-4 py-3">
                      <div className="font-body text-[14px] font-medium text-fg">
                        {event.title}
                      </div>
                      <div className="text-[12px] text-fg-muted">
                        {event.venueName} · {event.city}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[13px] text-fg-secondary">
                      {event.startDate
                        ? new Date(event.startDate).toLocaleDateString("es-MX", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={event.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/org/events/${event.id}`}
                        className="text-[12px] font-medium uppercase tracking-[0.04em] text-primary hover:underline"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="font-body text-[11px] uppercase tracking-[0.06em] text-fg-muted">
        {label}
      </div>
      <div
        className={`mt-2 font-mono text-[32px] font-bold ${accent ? "text-primary" : "text-fg"}`}
      >
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    draft: {
      label: "Borrador",
      className: "bg-surface-raised text-fg-muted border-border",
    },
    published: {
      label: "Publicado",
      className: "bg-primary/10 text-primary border-primary/20",
    },
    cancelled: {
      label: "Cancelado",
      className: "bg-danger/10 text-danger border-danger/20",
    },
    ended: {
      label: "Terminado",
      className: "bg-surface-raised text-fg-muted border-border",
    },
    deleted: {
      label: "Eliminado",
      className: "bg-danger/10 text-danger border-danger/20",
    },
  };

  const { label, className } = config[status] ?? config.draft;

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.04em] ${className}`}
    >
      {label}
    </span>
  );
}
