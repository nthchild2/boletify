/** Small building blocks shared by the organiser pages. */

import { cn } from "../../lib/utils";

export function formatMoney(cents: number): string {
  const pesos = cents / 100;
  return `$${pesos.toLocaleString("es-MX", {
    minimumFractionDigits: pesos % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatShortDate(value: Date | string): string {
  return new Date(value).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "America/Mexico_City",
  });
}

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  card: "Tarjeta",
  oxxo: "OXXO",
  mercadopago: "Mercado Pago",
};

export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="font-body text-[11px] uppercase tracking-[0.06em] text-fg-muted">
        {label}
      </div>
      <div
        className={cn(
          "mt-2 font-mono text-[30px] font-bold leading-none",
          accent ? "text-primary" : "text-fg",
        )}
      >
        {value}
      </div>
      {hint ? (
        <div className="mt-2 text-[12px] text-fg-muted">{hint}</div>
      ) : null}
    </div>
  );
}

/** Organiser-facing state of an event: draft, on sale, ended or cancelled. */
export function EventStateBadge({
  status,
  startDate,
}: {
  status: string;
  startDate: Date | string;
}) {
  const ended =
    status === "ended" ||
    (status === "published" && new Date(startDate).getTime() < Date.now());
  const { label, className } =
    status === "draft"
      ? {
          label: "Borrador",
          className: "bg-surface-raised text-fg-muted border-border",
        }
      : status === "cancelled"
        ? {
            label: "Cancelado",
            className: "bg-danger/10 text-danger border-danger/20",
          }
        : ended
          ? {
              label: "Finalizado",
              className: "bg-surface-raised text-fg-muted border-border",
            }
          : {
              label: "En venta",
              className: "bg-primary/10 text-primary border-primary/20",
            };
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.04em]",
        className,
      )}
    >
      {label}
    </span>
  );
}

/** Thin progress bar with its numbers next to it (never colour alone). */
export function SoldBar({
  sold,
  capacity,
}: {
  sold: number;
  capacity: number;
}) {
  const pct =
    capacity > 0 ? Math.min(100, Math.round((sold / capacity) * 100)) : 0;
  return (
    <div className="min-w-[120px]">
      <div className="font-mono text-[13px] text-fg">
        {sold}
        <span className="text-fg-muted"> / {capacity}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-sunken">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
