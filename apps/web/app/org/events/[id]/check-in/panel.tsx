"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "../../../../../lib/utils";
import {
  REASON_TEXT,
  ManualSearch,
  checkInUrl,
  formatTime,
  type CheckInResult,
  type CheckInStats,
} from "./shared";

/** "Check-in" tab on the organiser event page: counter, scanner link, manual check-in. */
export function CheckInPanel({ eventId }: { eventId: number }) {
  const [stats, setStats] = useState<CheckInStats | null>(null);
  const [last, setLast] = useState<CheckInResult | null>(null);

  const loadStats = useCallback(async () => {
    const res = await fetch(checkInUrl(eventId), { credentials: "same-origin" });
    if (res.ok) setStats((await res.json()).stats);
  }, [eventId]);

  useEffect(() => {
    loadStats();
    const timer = setInterval(loadStats, 15_000);
    return () => clearInterval(timer);
  }, [loadStats]);

  const percent = stats && stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="font-body text-[11px] uppercase tracking-[0.06em] text-fg-muted">Entradas</div>
        <div className="mt-2 font-mono text-[44px] leading-none text-fg">
          {stats ? stats.checkedIn : "—"}
          <span className="text-[24px] text-fg-muted"> / {stats ? stats.total : "—"}</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-sunken">
          <div className="h-full bg-primary transition-all" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-2 text-[13px] text-fg-muted">{percent}% de los boletos pagados ya entró.</p>
        <Link
          href={`/org/events/${eventId}/check-in`}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border-ink bg-primary px-5 py-4 font-display text-[18px] font-bold text-primary-fg shadow-brick-md transition hover:bg-primary-hover"
        >
          Abrir escáner →
        </Link>
        <p className="mt-3 text-[12px] text-fg-muted">
          Funciona en el navegador del celular, sin instalar nada. También acepta lectores USB o Bluetooth.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="font-body text-[11px] uppercase tracking-[0.06em] text-fg-muted">Check-in manual</div>
        <p className="mb-4 mt-1 text-[13px] text-fg-muted">
          Si el QR no se lee (pantalla rota, poco brillo), busca al asistente y dale entrada.
        </p>
        {last ? (
          <div
            role="status"
            className={cn(
              "mb-4 rounded-md border px-4 py-3 text-[14px]",
              last.reason === "valid" ? "border-success/40 bg-success/10 text-fg" : "border-danger/40 bg-danger/10 text-fg",
            )}
          >
            <strong>{last.reason === "valid" ? "✅ Entrada registrada" : `❌ ${REASON_TEXT[last.reason]}`}</strong>
            {last.ticket ? (
              <span className="text-fg-muted">
                {" "}
                · {last.ticket.attendeeName || last.ticket.ticketNumber} · {last.ticket.tierName}
                {last.reason === "already_used" ? ` · ${formatTime(last.ticket.checkedInAt)}` : ""}
              </span>
            ) : null}
          </div>
        ) : null}
        <ManualSearch
          eventId={eventId}
          onResult={(result) => {
            setLast(result);
            setStats(result.stats);
          }}
        />
      </div>
    </div>
  );
}
