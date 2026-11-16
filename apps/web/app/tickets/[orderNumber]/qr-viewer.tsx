"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "../../../lib/utils";

type ViewerTicket = { ticketNumber: string; tierName: string; status: string; svg: string };

const STATUS_LABEL: Record<string, string> = {
  used: "YA SE USÓ",
  refunded: "REEMBOLSADO",
  cancelled: "CANCELADO",
};

/**
 * Full-screen QR display (B-09): one ticket per slide, swipe or tap the dots
 * to move between tickets, and the screen is kept awake while it's open.
 */
export function QrViewer({
  backHref,
  event,
  orderNumber,
  tickets,
}: {
  backHref: string;
  event: { title: string; dateLabel: string; place: string };
  orderNumber: string;
  tickets: ViewerTicket[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Keep the screen on while the QR is showing (re-acquired when the tab is visible again).
  useEffect(() => {
    let lock: { release: () => Promise<void> } | null = null;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: "screen") => Promise<{ release: () => Promise<void> }> };
    };
    const acquire = async () => {
      try {
        if (document.visibilityState === "visible" && nav.wakeLock) lock = await nav.wakeLock.request("screen");
      } catch {
        // not supported or denied; nothing to do
      }
    };
    acquire();
    document.addEventListener("visibilitychange", acquire);
    return () => {
      document.removeEventListener("visibilitychange", acquire);
      lock?.release().catch(() => undefined);
    };
  }, []);

  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    setIndex(Math.round(track.scrollLeft / track.clientWidth));
  }

  function goTo(i: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  }

  return (
    <main className="flex min-h-screen flex-col bg-bg text-fg">
      <div className="flex items-center justify-between px-5 py-4">
        <Link href={backHref} className="font-mono text-mono-md text-fg-secondary hover:text-primary">
          ← Volver
        </Link>
        <span className="font-mono text-[12px] uppercase tracking-widest text-fg-muted">{orderNumber}</span>
      </div>

      <div className="px-5 text-center">
        <h1 className="font-display text-[28px] font-black leading-tight tracking-[-0.02em] md:text-[36px]">
          {event.title}
        </h1>
        <div className="mt-1 font-mono text-mono-md text-fg-secondary">{event.dateLabel}</div>
        <div className="text-body-sm text-fg-muted">{event.place}</div>
      </div>

      <div
        ref={trackRef}
        onScroll={onScroll}
        className="mt-6 flex flex-1 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tickets.map((ticket, i) => {
          const inactive = STATUS_LABEL[ticket.status];
          return (
            <section
              key={ticket.ticketNumber}
              aria-label={`Boleto ${i + 1} de ${tickets.length}`}
              className="flex w-full shrink-0 snap-center flex-col items-center px-5"
            >
              <div className="relative w-full max-w-[min(88vw,420px)]">
                <div
                  className={cn(
                    "rounded-lg border border-border-ink bg-white p-3 shadow-brick-md [&>svg]:block [&>svg]:h-auto [&>svg]:w-full",
                    inactive && "opacity-25",
                  )}
                  dangerouslySetInnerHTML={{ __html: ticket.svg }}
                  role="img"
                  aria-label={`Código QR del boleto ${ticket.ticketNumber}`}
                />
                {inactive ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="rounded-md border border-border-ink bg-danger px-4 py-2 font-mono text-mono-md text-danger-fg">
                      {inactive}
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="mt-5 font-mono text-mono-md text-fg">
                Boleto {i + 1} de {tickets.length}
              </div>
              <div className="font-display text-[20px] font-bold">{ticket.tierName}</div>
              <div className="mt-1 font-mono text-[13px] text-fg-muted">{ticket.ticketNumber}</div>
            </section>
          );
        })}
      </div>

      {tickets.length > 1 ? (
        <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Boletos">
          {tickets.map((ticket, i) => (
            <button
              key={ticket.ticketNumber}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Ver boleto ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                "h-2.5 rounded-full transition-all",
                i === index ? "w-6 bg-primary" : "w-2.5 bg-border-strong hover:bg-fg-muted",
              )}
            />
          ))}
        </div>
      ) : null}

      <p className="px-5 pb-8 pt-5 text-center text-caption text-fg-muted">
        🔆 Sube el brillo de tu pantalla para que escaneen tu QR más rápido.
      </p>
    </main>
  );
}
