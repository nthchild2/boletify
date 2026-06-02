"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "../../../../../lib/trpc";
import { cn } from "../../../../../lib/utils";

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const eventId = parseInt(id, 10);
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: events, isLoading } = trpc.events.listByOrganiser.useQuery();
  const event = events?.find((e) => e.id === eventId);

  const updateMutation = trpc.events.update.useMutation({
    onSuccess: () => {
      utils.events.listByOrganiser.invalidate();
      router.push(`/org/events/${eventId}`);
    },
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [city, setCity] = useState("CDMX");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [genreTags, setGenreTags] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Populate fields when event loads
  useEffect(() => {
    if (!event) return;
    setTitle(event.title);
    setDescription(event.description || "");
    setVenueName(event.venueName);
    setVenueAddress(event.venueAddress || "");
    setCity(event.city);
    setCoverImageUrl(event.coverImageUrl || "");
    setGenreTags(event.genreTags?.join(", ") || "");
    if (event.startDate) {
      const d = new Date(event.startDate);
      setStartDate(d.toISOString().split("T")[0]);
      const hours = d.getHours().toString().padStart(2, "0");
      const mins = d.getMinutes().toString().padStart(2, "0");
      if (hours !== "00" || mins !== "00") {
        setStartTime(`${hours}:${mins}`);
      }
    }
  }, [event]);

  if (isLoading) {
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
          Volver
        </Link>
      </div>
    );
  }

  async function handleSave() {
    setError(null);
    try {
      const startDateTime = new Date(`${startDate}T${startTime || "00:00"}`);
      if (isNaN(startDateTime.getTime())) {
        throw new Error("Fecha inválida");
      }
      await updateMutation.mutateAsync({
        id: eventId,
        data: {
          title,
          description: description || undefined,
          venueName,
          venueAddress: venueAddress || undefined,
          city,
          startDate: startDateTime,
          coverImageUrl: coverImageUrl || undefined,
          genreTags: genreTags
            ? genreTags.split(",").map((t) => t.trim().toLowerCase())
            : undefined,
        },
      });
    } catch (err: any) {
      setError(err.message || "Error al guardar");
    }
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <Link
        href={`/org/events/${eventId}`}
        className="mb-3 inline-flex items-center gap-1.5 font-body text-[12px] uppercase tracking-[0.04em] text-fg-muted hover:text-fg"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 3L5 7l4 4" />
        </svg>
        {event.title}
      </Link>

      <h1 className="mb-8 font-display text-[36px] font-[850] leading-[0.95] tracking-[-0.03em] text-fg">
        Editar evento
      </h1>

      {error && (
        <div className="mb-6 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-[13px] text-danger">
          {error}
        </div>
      )}

      <div className="max-w-[640px] space-y-6">
        <Field label="Nombre del evento" required>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
          />
        </Field>

        <Field label="Descripción">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="input-field resize-none"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Venue" required>
            <input
              type="text"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              className="input-field"
            />
          </Field>
          <Field label="Ciudad">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="input-field"
            />
          </Field>
        </div>

        <Field label="Dirección del venue">
          <input
            type="text"
            value={venueAddress}
            onChange={(e) => setVenueAddress(e.target.value)}
            className="input-field"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Fecha de inicio" required>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </Field>
          <Field label="Hora de inicio">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="input-field"
            />
          </Field>
        </div>

        <Field label="URL de imagen de portada">
          <input
            type="url"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            className="input-field"
          />
          {coverImageUrl && (
            <img
              src={coverImageUrl}
              alt="Preview"
              className="mt-2 h-32 w-full rounded-lg object-cover"
            />
          )}
        </Field>

        <Field label="Tags de género (separados por coma)">
          <input
            type="text"
            value={genreTags}
            onChange={(e) => setGenreTags(e.target.value)}
            className="input-field"
          />
        </Field>

        <div className="flex items-center justify-between border-t border-border pt-6">
          <Link
            href={`/org/events/${eventId}`}
            className="font-body text-[13px] uppercase tracking-[0.04em] text-fg-muted hover:text-fg"
          >
            Cancelar
          </Link>
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border border-border-ink bg-primary px-6 py-3 font-body text-[13px] font-semibold uppercase tracking-[0.04em] text-primary-fg shadow-brick-md transition hover:bg-primary-hover",
              updateMutation.isPending && "opacity-50 pointer-events-none"
            )}
          >
            {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .input-field {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          padding: 0.625rem 0.875rem;
          font-family: var(--font-body, sans-serif);
          font-size: 14px;
          color: var(--color-fg);
          outline: none;
          transition: border-color 0.15s;
        }
        .input-field::placeholder {
          color: var(--color-fg-muted);
        }
        .input-field:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 20%, transparent);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-muted">
        {label}
        {required && <span className="ml-0.5 text-primary">*</span>}
      </span>
      {children}
    </label>
  );
}
