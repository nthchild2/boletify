"use client";

import Link from "next/link";
import { useState } from "react";
import { trpc } from "../../../lib/trpc";
import { cn } from "../../../lib/utils";

const STATUS_FILTERS = [
  { value: undefined, label: "Todos" },
  { value: "published" as const, label: "Publicados" },
  { value: "draft" as const, label: "Borradores" },
  { value: "cancelled" as const, label: "Cancelados" },
];

export default function OrgEventsPage() {
  const [statusFilter, setStatusFilter] = useState<
    "draft" | "published" | "cancelled" | "ended" | "deleted" | undefined
  >(undefined);

  const { data: events, isLoading } = trpc.events.listByOrganiser.useQuery(
    statusFilter ? { status: statusFilter } : undefined
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="font-body text-[11px] uppercase tracking-[0.06em] text-fg-muted">
            Gestión
          </div>
          <h1 className="mt-2 font-display text-[36px] font-[850] leading-[0.95] tracking-[-0.03em] text-fg">
            Eventos
          </h1>
        </div>
        <Link
          href="/org/events/create"
          className="inline-flex items-center gap-2 rounded-md border border-border-ink bg-primary px-5 py-3 font-body text-[13px] font-semibold uppercase tracking-[0.04em] text-primary-fg shadow-brick-md transition hover:bg-primary-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 2v12M2 8h12" />
          </svg>
          Nuevo evento
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.label}
            onClick={() => setStatusFilter(filter.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 font-body text-[12px] font-semibold uppercase tracking-[0.04em] transition",
              statusFilter === filter.value
                ? "border-primary bg-primary text-primary-fg"
                : "border-border text-fg-muted hover:border-fg hover:text-fg"
            )}
          >
            {filter.label}
            {events && filter.value === undefined && ` (${events.length})`}
          </button>
        ))}
      </div>

      {/* Events table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      ) : events && events.length > 0 ? (
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
                  Venue
                </th>
                <th className="px-4 py-3 text-left font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-muted">
                  Status
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-border last:border-0 transition hover:bg-surface-raised"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {event.coverImageUrl ? (
                        <img
                          src={event.coverImageUrl}
                          alt=""
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-surface-raised" />
                      )}
                      <div>
                        <div className="font-body text-[14px] font-medium text-fg">
                          {event.title}
                        </div>
                        {event.genreTags && event.genreTags.length > 0 && (
                          <div className="mt-0.5 text-[11px] text-fg-muted">
                            {event.genreTags.join(" · ")}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono text-[13px] text-fg-secondary">
                    {event.startDate
                      ? new Date(event.startDate).toLocaleDateString("es-MX", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-4 text-[13px] text-fg-secondary">
                    {event.venueName}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={event.status} />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/org/events/${event.id}/edit`}
                        className="text-[12px] font-medium uppercase tracking-[0.04em] text-fg-muted hover:text-fg"
                      >
                        Editar
                      </Link>
                      <Link
                        href={`/org/events/${event.id}`}
                        className="text-[12px] font-medium uppercase tracking-[0.04em] text-primary hover:underline"
                      >
                        Ver
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border border-dashed py-20">
          <div className="text-[14px] text-fg-muted">
            {statusFilter
              ? "No hay eventos con ese status."
              : "Aún no tienes eventos."}
          </div>
          {!statusFilter && (
            <Link
              href="/org/events/create"
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-border-ink bg-primary px-4 py-2 font-body text-[12px] font-semibold uppercase tracking-[0.04em] text-primary-fg shadow-brick-md"
            >
              Crear tu primer evento
            </Link>
          )}
        </div>
      )}
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
  };

  const { label, className } = config[status] ?? {
    label: status,
    className: "bg-surface-raised text-fg-muted border-border",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.04em] ${className}`}
    >
      {label}
    </span>
  );
}
