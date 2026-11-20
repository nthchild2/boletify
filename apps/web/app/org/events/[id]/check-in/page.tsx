"use client";

import { use, useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { cn } from "../../../../../lib/utils";
import {
  REASON_TEXT,
  ManualSearch,
  checkInUrl,
  formatTime,
  postCheckIn,
  type CheckInResult,
  type CheckInStats,
} from "./shared";

/** Same code again within this window is ignored (the camera keeps seeing it). */
const REPEAT_COOLDOWN_MS = 4_000;
const VALID_DISMISS_MS = 1_500;
const SCAN_INTERVAL_MS = 120;

type BarcodeDetectorLike = { detect: (source: CanvasImageSource) => Promise<Array<{ rawValue: string }>> };

/** Native BarcodeDetector (Chrome/Android) if it can read QR codes, else null. */
async function nativeDetector(): Promise<BarcodeDetectorLike | null> {
  const Ctor = (window as unknown as { BarcodeDetector?: any }).BarcodeDetector;
  if (!Ctor) return null;
  try {
    const formats: string[] = (await Ctor.getSupportedFormats?.()) ?? ["qr_code"];
    return formats.includes("qr_code") ? new Ctor({ formats: ["qr_code"] }) : null;
  } catch {
    return null;
  }
}

/**
 * O-11 scanner: full-screen, dark, camera decodes continuously. Each result
 * shows full-screen (O-12 green auto-dismisses, O-13 red waits for a tap).
 */
export default function CheckInScannerPage({ params }: { params: Promise<{ id: string }> }) {
  const eventId = Number(use(params).id);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);
  const lastCodeRef = useRef<{ code: string; at: number } | null>(null);

  const [eventTitle, setEventTitle] = useState("");
  const [stats, setStats] = useState<CheckInStats | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [camera, setCamera] = useState<"starting" | "on" | "unavailable">("starting");
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [typedCode, setTypedCode] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Event title + counter, refreshed so other doors' check-ins show up.
  const loadStats = useCallback(async () => {
    try {
      const res = await fetch(checkInUrl(eventId), { credentials: "same-origin" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      setEventTitle(data.event.title);
      setStats(data.stats);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "No pudimos cargar el evento.");
    }
  }, [eventId]);

  useEffect(() => {
    loadStats();
    const timer = setInterval(loadStats, 10_000);
    return () => clearInterval(timer);
  }, [loadStats]);

  const showResult = useCallback((r: CheckInResult) => {
    setResult(r);
    setStats(r.stats);
    try {
      navigator.vibrate?.(r.reason === "valid" ? 120 : [220, 90, 220]);
    } catch {
      // vibration not available
    }
  }, []);

  const submitCode = useCallback(
    async (raw: string) => {
      const code = raw.trim();
      if (!code || busyRef.current) return;
      const last = lastCodeRef.current;
      if (last && last.code === code && Date.now() - last.at < REPEAT_COOLDOWN_MS) return;
      busyRef.current = true;
      lastCodeRef.current = { code, at: Date.now() };
      setRequestError(null);
      try {
        showResult(await postCheckIn(eventId, { code }));
      } catch (err) {
        setRequestError(err instanceof Error ? err.message : "Sin conexión. Intenta de nuevo.");
        busyRef.current = false;
      }
    },
    [eventId, showResult],
  );

  const dismiss = useCallback(() => {
    setResult(null);
    busyRef.current = false;
    // The camera may still see the same QR; restart the cooldown from now.
    if (lastCodeRef.current) lastCodeRef.current.at = Date.now();
  }, []);

  // Valid results go away on their own; invalid ones wait for staff.
  useEffect(() => {
    if (result?.reason !== "valid") return;
    const timer = setTimeout(dismiss, VALID_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [result, dismiss]);

  // Camera + continuous decoding.
  useEffect(() => {
    let stream: MediaStream | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    (async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCamera("unavailable");
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch {
        if (!cancelled) setCamera("unavailable");
        return;
      }
      const video = videoRef.current;
      if (cancelled || !video) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      video.srcObject = stream;
      await video.play().catch(() => undefined);
      setCamera("on");

      const detector = await nativeDetector();
      const jsQR = detector ? null : (await import("jsqr")).default;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d", { willReadFrequently: true });
      let decoding = false;

      timer = setInterval(async () => {
        if (decoding || busyRef.current || video.readyState < 2) return;
        decoding = true;
        try {
          let value: string | undefined;
          if (detector) {
            value = (await detector.detect(video))[0]?.rawValue;
          } else if (jsQR && canvas && ctx && video.videoWidth) {
            const scale = Math.min(1, 640 / video.videoWidth);
            canvas.width = Math.round(video.videoWidth * scale);
            canvas.height = Math.round(video.videoHeight * scale);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
            value = jsQR(image.data, image.width, image.height, { inversionAttempts: "dontInvert" })?.data;
          }
          if (value) await submitCode(value);
        } catch {
          // a bad frame; try the next one
        } finally {
          decoding = false;
        }
      }, SCAN_INTERVAL_MS);
    })();

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [submitCode]);

  // Keep the screen on while scanning.
  useEffect(() => {
    let lock: { release: () => Promise<void> } | null = null;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: "screen") => Promise<{ release: () => Promise<void> }> };
    };
    const acquire = async () => {
      try {
        if (document.visibilityState === "visible" && nav.wakeLock) lock = await nav.wakeLock.request("screen");
      } catch {
        // not supported or denied
      }
    };
    acquire();
    document.addEventListener("visibilitychange", acquire);
    return () => {
      document.removeEventListener("visibilitychange", acquire);
      lock?.release().catch(() => undefined);
    };
  }, []);

  // On desktops (USB/Bluetooth "keyboard" scanners) keep the code field focused.
  useEffect(() => {
    if (window.matchMedia?.("(pointer: fine)").matches && !result && !showSearch) codeInputRef.current?.focus();
  }, [result, showSearch]);

  function onTypedSubmit(e: FormEvent) {
    e.preventDefault();
    const code = typedCode;
    setTypedCode("");
    lastCodeRef.current = null; // a deliberate entry is never treated as a repeat
    submitCode(code);
  }

  const ticket = result?.ticket;

  return (
    <div className="dark fixed inset-0 z-50 flex flex-col bg-bg text-fg">
      {/* Header (O-11): back, title, live counter */}
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <Link
          href={`/org/events/${eventId}#check-in`}
          className="font-mono text-[13px] text-fg-secondary hover:text-primary"
        >
          ← Salir
        </Link>
        <div className="min-w-0 flex-1 truncate text-center font-display text-[16px] font-bold">
          {eventTitle || "Check-in"}
        </div>
        <div className="font-mono text-[15px] text-primary" aria-live="polite" aria-label="Entradas registradas">
          {stats ? `${stats.checkedIn}/${stats.total}` : "—"} ✅
        </div>
      </header>

      {loadError ? (
        <div className="m-4 rounded-md border border-danger p-4 text-[14px]">{loadError}</div>
      ) : null}

      {/* Camera */}
      <div className="relative flex-1 overflow-hidden bg-black">
        <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="aspect-square w-[min(68vw,320px)] rounded-[24px] border-[3px] border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
        </div>
        <p className="absolute inset-x-0 bottom-4 px-6 text-center font-body text-[15px] text-white">
          {camera === "starting"
            ? "Encendiendo la cámara…"
            : camera === "on"
              ? "📷 Apunta la cámara al código QR"
              : "No hay acceso a la cámara. Escribe o escanea el código abajo, o busca por nombre."}
        </p>
      </div>

      {/* Typed / pasted / keyboard-wedge entry and manual search */}
      <div className="space-y-3 border-t border-border bg-surface px-4 py-4">
        {requestError ? (
          <p role="alert" className="text-[13px] text-danger">
            {requestError}
          </p>
        ) : null}
        <form onSubmit={onTypedSubmit} className="flex gap-2">
          <label className="sr-only" htmlFor="checkin-code">
            Código del boleto
          </label>
          <input
            id="checkin-code"
            ref={codeInputRef}
            value={typedCode}
            onChange={(e) => setTypedCode(e.target.value)}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="Pega o escanea el código"
            className="h-12 min-w-0 flex-1 rounded-md border border-border-strong bg-surface-raised px-4 font-mono text-[16px] text-fg placeholder:text-fg-subtle focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-md border border-border-ink bg-primary px-4 font-body text-[13px] font-semibold uppercase tracking-[0.04em] text-primary-fg"
          >
            Validar
          </button>
        </form>
        <button
          type="button"
          onClick={() => setShowSearch(true)}
          className="w-full rounded-md border border-border-strong py-3 font-body text-[14px] text-fg-secondary hover:border-primary hover:text-primary"
        >
          🔍 Buscar por nombre o número de pedido
        </button>
      </div>

      {/* Manual search sheet */}
      {showSearch ? (
        <div className="absolute inset-0 z-10 flex flex-col bg-bg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="font-display text-[18px] font-bold">Check-in manual</span>
            <button
              type="button"
              onClick={() => setShowSearch(false)}
              className="font-mono text-[13px] text-fg-secondary hover:text-primary"
            >
              Volver al escáner
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <ManualSearch
              eventId={eventId}
              autoFocus
              dark
              onResult={(r) => {
                busyRef.current = true;
                showResult(r);
              }}
            />
          </div>
        </div>
      ) : null}

      {/* O-12 / O-13 result */}
      {result ? (
        <button
          type="button"
          onClick={dismiss}
          aria-live="assertive"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-8 text-center"
          style={{
            backgroundColor: result.reason === "valid" ? "rgba(0, 200, 150, 0.98)" : "rgba(255, 68, 68, 0.98)",
            color: result.reason === "valid" ? "#08080C" : "#FFFFFF",
          }}
        >
          <span className="text-[72px] leading-none" aria-hidden>
            {result.reason === "valid" ? "✅" : "❌"}
          </span>
          <span className="mt-4 font-display text-[44px] font-black uppercase leading-none tracking-[-0.02em]">
            {result.reason === "valid" ? "Válido" : "No válido"}
          </span>
          {result.reason !== "valid" ? (
            <span className="mt-4 font-display text-[28px] font-bold">{REASON_TEXT[result.reason]}</span>
          ) : null}
          {ticket ? (
            <span className="mt-4 block text-[22px] font-semibold">
              {ticket.attendeeName || "Sin nombre"}
              <span className="mt-1 block text-[18px] font-normal">
                {ticket.tierName} · Boleto {ticket.position} de {ticket.ofTickets}
              </span>
              {result.reason === "already_used" && ticket.checkedInAt ? (
                <span className="mt-2 block font-mono text-[18px] font-normal">
                  Check-in: {formatTime(ticket.checkedInAt)}
                  {ticket.checkedInBy ? ` · ${ticket.checkedInBy}` : ""}
                </span>
              ) : null}
            </span>
          ) : null}
          <span className="mt-6 font-mono text-[16px]">
            {result.stats.checkedIn}/{result.stats.total} ✅
          </span>
          {result.reason !== "valid" ? (
            <span className="mt-8 rounded-md border-2 border-current px-6 py-3 font-body text-[16px] font-semibold uppercase tracking-[0.04em]">
              Escanear otro →
            </span>
          ) : null}
        </button>
      ) : null}
    </div>
  );
}
