"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { trpc } from "../../../../lib/trpc";
import { cn } from "../../../../lib/utils";
import { formatMxnPrice } from "@boletify/routes";

export default function OrgEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const eventId = parseInt(id, 10);
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: events } = trpc.events.listByOrganiser.useQuery();
  const event = events?.find((e) => e.id === eventId);

  const publishMutation = trpc.events.publish.useMutation({
    onSuccess: () => utils.events.listByOrganiser.invalidate(),
  });
  const deleteMutation = trpc.events.delete.useMutation({
    onSuccess: () => {
      utils.events.listByOrganiser.invalidate();
      router.push("/org/events");
    },
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!events) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-8">
        <div className="text-fg-muted">Evento no encontrado.</div>
        <Link href="/org/events" className="mt-2 text-primary hover:underline">
          Volver a eventos
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <Link
        href="/org/events"
        className="mb-3 inline-flex items-center gap-1.5 font-body text-[12px] uppercase tracking-[0.04em] text-fg-muted hover:text-fg"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 3L5 7l4 4" />
        </svg>
        Eventos
      </Link>

      {/* Draft banner */}
      {event.status === "draft" && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-sun-400/30 bg-sun-400/10 px-5 py-4">
          <div>
            <div className="font-body text-[14px] font-semibold text-sun-500">
              Este evento es un borrador
            </div>
            <div className="mt-0.5 text-[13px] text-fg-muted">
              No es visible para los compradores. Publícalo cuando esté listo.
            </div>
          </div>
          <button
            onClick={() => publishMutation.mutate({ id: event.id })}
            disabled={publishMutation.isPending}
            className="inline-flex items-center gap-2 rounded-md border border-border-ink bg-primary px-5 py-2.5 font-body text-[13px] font-semibold uppercase tracking-[0.04em] text-primary-fg shadow-brick-md transition hover:bg-primary-hover"
          >
            {publishMutation.isPending ? "Publicando..." : "Publicar ahora"}
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-[36px] font-[850] leading-[0.95] tracking-[-0.03em] text-fg">
              {event.title}
            </h1>
            <StatusBadge status={event.status} />
          </div>
          <p className="mt-2 text-[14px] text-fg-muted">
            {event.venueName} · {event.city}
          </p>
        </div>
        <div className="flex gap-2">
          {event.status === "draft" && (
            <button
              onClick={() => publishMutation.mutate({ id: event.id })}
              disabled={publishMutation.isPending}
              className="inline-flex items-center gap-2 rounded-md border border-border-ink bg-primary px-4 py-2.5 font-body text-[12px] font-semibold uppercase tracking-[0.04em] text-primary-fg shadow-brick-md transition hover:bg-primary-hover"
            >
              {publishMutation.isPending ? "Publicando..." : "Publicar"}
            </button>
          )}
          <Link
            href={`/org/events/${event.id}/edit`}
            className="inline-flex items-center gap-2 rounded-md border border-border-strong px-4 py-2.5 font-body text-[12px] font-semibold uppercase tracking-[0.04em] text-fg transition hover:border-fg"
          >
            Editar
          </Link>
        </div>
      </div>

      {/* Event info grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <InfoCard
          label="Fecha"
          value={
            event.startDate
              ? new Date(event.startDate).toLocaleDateString("es-MX", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "—"
          }
        />
        <InfoCard
          label="Hora"
          value={
            event.startDate
              ? new Date(event.startDate).toLocaleTimeString("es-MX", {
                  hour: "2-digit",
                  minute: "2-digit",
                }) + " hrs"
              : "—"
          }
        />
        <InfoCard label="Venue" value={event.venueName} />
        <InfoCard label="Ciudad" value={event.city} />
      </div>

      {/* Cover image */}
      {event.coverImageUrl && (
        <div className="mb-8 overflow-hidden rounded-xl">
          <img
            src={event.coverImageUrl}
            alt={event.title}
            className="h-[300px] w-full object-cover"
          />
        </div>
      )}

      {/* Description */}
      {event.description && (
        <div className="mb-8">
          <h2 className="mb-2 font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-muted">
            Descripción
          </h2>
          <p className="max-w-[640px] text-[14px] leading-relaxed text-fg-secondary">
            {event.description}
          </p>
        </div>
      )}

      {/* Tags */}
      {event.genreTags && event.genreTags.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-2 font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-muted">
            Género
          </h2>
          <div className="flex gap-2">
            {event.genreTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-surface-raised px-3 py-1 text-[12px] text-fg-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Danger zone */}
      <div className="mt-12 border-t border-border pt-6">
        <h2 className="mb-2 font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-danger">
          Zona peligrosa
        </h2>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-md border border-danger/30 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-danger transition hover:bg-danger/10"
          >
            Eliminar evento
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-danger">
              Esto es permanente.
            </span>
            <button
              onClick={() => deleteMutation.mutate({ id: event.id })}
              disabled={deleteMutation.isPending}
              className="rounded-md border border-danger bg-danger px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-danger-fg"
            >
              {deleteMutation.isPending ? "Eliminando..." : "Confirmar"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-[12px] text-fg-muted hover:text-fg"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="font-body text-[11px] uppercase tracking-[0.06em] text-fg-muted">
        {label}
      </div>
      <div className="mt-1.5 font-mono text-[14px] text-fg">{value}</div>
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
  };
  const { label, className } = config[status] ?? {
    label: status,
    className: "bg-surface-raised text-fg-muted border-border",
  };
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.04em] ${className}`}>
      {label}
    </span>
  );
}
