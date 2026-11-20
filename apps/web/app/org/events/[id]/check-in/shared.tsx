"use client";

import { useEffect, useState } from "react";
import { cn } from "../../../../../lib/utils";

export type CheckInReason =
  | "valid"
  | "already_used"
  | "wrong_event"
  | "not_paid"
  | "refunded"
  | "cancelled"
  | "invalid";

export type CheckInStats = { checkedIn: number; total: number };

export type CheckInResult = {
  reason: CheckInReason;
  ticket?: {
    ticketNumber: string;
    attendeeName: string | null;
    tierName: string;
    orderNumber: string;
    position: number;
    ofTickets: number;
    checkedInAt: string | null;
    checkedInBy: string | null;
  };
  stats: CheckInStats;
};

export type SearchHit = {
  ticketNumber: string;
  attendeeName: string | null;
  attendeeEmail: string | null;
  tierName: string;
  orderNumber: string;
  status: "valid" | "used" | "refunded" | "not_paid";
  checkedInAt: string | null;
};

export const REASON_TEXT: Record<CheckInReason, string> = {
  valid: "Válido",
  already_used: "Ya escaneado",
  wrong_event: "Boleto de otro evento",
  not_paid: "Pago pendiente",
  refunded: "Boleto reembolsado",
  cancelled: "Boleto cancelado",
  invalid: "Código no válido",
};

export function formatTime(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Mexico_City",
  });
}

export function checkInUrl(eventId: number, path = ""): string {
  return `/api/org/events/${eventId}/check-in${path}`;
}

export async function postCheckIn(
  eventId: number,
  body: { code: string } | { ticketNumber: string },
): Promise<CheckInResult> {
  const res = await fetch(checkInUrl(eventId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data as CheckInResult;
}

/** Manual check-in: search the event's tickets and admit one. */
export function ManualSearch({
  eventId,
  onResult,
  autoFocus = false,
  dark = false,
}: {
  eventId: number;
  onResult: (result: CheckInResult) => void;
  autoFocus?: boolean;
  dark?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (query.trim().length < 2) {
      setHits(null);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${checkInUrl(eventId, "/search")}?q=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal,
          credentials: "same-origin",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "No pudimos buscar.");
        setHits(data.results);
        setError(null);
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "No pudimos buscar.");
      }
    }, 250);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [eventId, query, refresh]);

  async function admit(ticketNumber: string) {
    setBusy(ticketNumber);
    try {
      onResult(await postCheckIn(eventId, { ticketNumber }));
      setRefresh((n) => n + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos registrar la entrada.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <label className="sr-only" htmlFor={`manual-search-${eventId}`}>
        Buscar boleto
      </label>
      <input
        id={`manual-search-${eventId}`}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus={autoFocus}
        autoComplete="off"
        placeholder="Nombre, correo, pedido o boleto"
        className={cn(
          "h-12 w-full rounded-md border px-4 font-body text-[16px] text-fg placeholder:text-fg-subtle focus:border-primary focus:outline-none",
          dark ? "border-border-strong bg-surface-raised" : "border-border-strong bg-surface-sunken",
        )}
      />
      {error ? <p className="mt-2 text-[13px] text-danger">{error}</p> : null}
      {hits && hits.length === 0 ? (
        <p className="mt-4 text-[14px] text-fg-muted">Sin resultados para “{query.trim()}”.</p>
      ) : null}
      {hits && hits.length > 0 ? (
        <ul className="mt-3 divide-y divide-border rounded-md border border-border">
          {hits.map((hit) => (
            <li key={hit.ticketNumber} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <div className="truncate font-body text-[15px] font-semibold text-fg">
                  {hit.attendeeName || hit.attendeeEmail || "Sin nombre"}
                </div>
                <div className="truncate font-mono text-[12px] text-fg-muted">
                  {hit.tierName} · {hit.orderNumber} · {hit.ticketNumber}
                </div>
              </div>
              {hit.status === "valid" ? (
                <button
                  type="button"
                  onClick={() => admit(hit.ticketNumber)}
                  disabled={busy !== null}
                  className="shrink-0 rounded-md border border-border-ink bg-primary px-3 py-2 font-body text-[12px] font-semibold uppercase tracking-[0.04em] text-primary-fg shadow-brick-sm disabled:opacity-50"
                >
                  {busy === hit.ticketNumber ? "…" : "Dar entrada"}
                </button>
              ) : (
                <span className="shrink-0 font-mono text-[12px] uppercase text-fg-muted">
                  {hit.status === "used"
                    ? `Entró ${formatTime(hit.checkedInAt)}`
                    : hit.status === "refunded"
                      ? "Reembolsado"
                      : "Sin pagar"}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
