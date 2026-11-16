"use client";

import { useState, type FormEvent } from "react";
import { BrutalButton } from "../../components/brutal-glass";

const inputClass =
  "h-12 w-full rounded-md border border-border-strong bg-surface-sunken px-4 font-body text-[16px] text-fg placeholder:text-fg-subtle focus:border-primary focus:outline-none focus:shadow-glow-focus";

export function AccessRequestForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const [devAccessUrl, setDevAccessUrl] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/tickets/access/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No pudimos enviar el enlace.");
      setDevAccessUrl(data.devAccessUrl ?? null);
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos enviar el enlace.");
      setState("idle");
    }
  }

  if (state === "sent") {
    return (
      <div className="mt-5" role="status">
        <p className="text-body-md text-fg">
          Si hay boletos comprados con <span className="font-mono">{email}</span>, te llegará un enlace en unos
          minutos. Revisa también tu carpeta de spam.
        </p>
        {devAccessUrl ? (
          <p className="mt-4 rounded-md border border-warning p-3 text-body-sm text-fg">
            Modo desarrollo (sin servicio de correo):{" "}
            <a href={devAccessUrl} className="break-all font-mono text-primary underline">
              abrir el enlace
            </a>
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-4 font-mono text-mono-md text-fg-muted hover:text-primary"
        >
          Usar otro correo
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="ticket-access-email">
        Correo
      </label>
      <input
        id="ticket-access-email"
        type="email"
        required
        autoComplete="email"
        placeholder="tu@correo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClass}
      />
      <BrutalButton type="submit" disabled={state === "sending"} className="shrink-0">
        {state === "sending" ? "Enviando…" : "Enviarme el enlace"}
      </BrutalButton>
      {error ? (
        <p role="alert" className="text-body-sm text-danger sm:basis-full">
          {error}
        </p>
      ) : null}
    </form>
  );
}
