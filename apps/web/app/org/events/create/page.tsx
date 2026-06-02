"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "../../../../lib/trpc";
import { cn } from "../../../../lib/utils";

interface TicketTierInput {
  name: string;
  price: string; // string for input, converted to cents on submit
  quantity: string;
  saleStartDate: string;
  saleEndDate: string;
}

const EMPTY_TIER: TicketTierInput = {
  name: "",
  price: "",
  quantity: "",
  saleStartDate: "",
  saleEndDate: "",
};

export default function CreateEventPage() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const createEvent = trpc.events.create.useMutation();
  const createTier = trpc.events.createTicketTier.useMutation();

  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Event fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [city, setCity] = useState("CDMX");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [genreTags, setGenreTags] = useState("");

  // Ticket tiers
  const [tiers, setTiers] = useState<TicketTierInput[]>([{ ...EMPTY_TIER }]);

  function addTier() {
    setTiers([...tiers, { ...EMPTY_TIER }]);
  }

  function removeTier(index: number) {
    setTiers(tiers.filter((_, i) => i !== index));
  }

  function updateTier(index: number, field: keyof TicketTierInput, value: string) {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: value };
    setTiers(updated);
  }

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);

    try {
      // Build start date
      const startDateTime = new Date(`${startDate}T${startTime || "00:00"}`);
      if (isNaN(startDateTime.getTime())) {
        throw new Error("Fecha de inicio inválida");
      }

      // Create event
      const event = await createEvent.mutateAsync({
        title,
        description: description || undefined,
        venueName,
        venueAddress: venueAddress || undefined,
        city,
        startDate: startDateTime,
        endDate: endDate ? new Date(endDate) : undefined,
        coverImageUrl: coverImageUrl || undefined,
        genreTags: genreTags
          ? genreTags.split(",").map((t) => t.trim().toLowerCase())
          : undefined,
      });

      // Create ticket tiers
      for (const tier of tiers) {
        if (!tier.name || !tier.price || !tier.quantity) continue;
        await createTier.mutateAsync({
          eventId: event.id,
          data: {
            name: tier.name,
            price: Math.round(parseFloat(tier.price) * 100), // MXN → centavos
            quantity: parseInt(tier.quantity, 10),
            saleStartDate: tier.saleStartDate
              ? new Date(tier.saleStartDate)
              : undefined,
            saleEndDate: tier.saleEndDate
              ? new Date(tier.saleEndDate)
              : undefined,
          },
        });
      }

      // Invalidate cache and navigate
      await utils.events.listByOrganiser.invalidate();
      router.push(`/org/events/${event.id}`);
    } catch (err: any) {
      setError(err.message || "Error al crear el evento");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/org/events"
          className="mb-3 inline-flex items-center gap-1.5 font-body text-[12px] uppercase tracking-[0.04em] text-fg-muted hover:text-fg"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 3L5 7l4 4" />
          </svg>
          Eventos
        </Link>
        <h1 className="font-display text-[36px] font-[850] leading-[0.95] tracking-[-0.03em] text-fg">
          Crear evento
        </h1>
      </div>

      {/* Steps indicator */}
      <div className="mb-8 flex gap-2">
        <button
          onClick={() => setStep(1)}
          className={cn(
            "rounded-full px-4 py-1.5 font-body text-[12px] font-semibold uppercase tracking-[0.04em] transition",
            step === 1
              ? "bg-primary text-primary-fg"
              : "border border-border text-fg-muted hover:text-fg"
          )}
        >
          1. Detalles
        </button>
        <button
          onClick={() => {
            if (title && venueName && startDate) setStep(2);
          }}
          className={cn(
            "rounded-full px-4 py-1.5 font-body text-[12px] font-semibold uppercase tracking-[0.04em] transition",
            step === 2
              ? "bg-primary text-primary-fg"
              : "border border-border text-fg-muted hover:text-fg"
          )}
        >
          2. Boletos
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-[13px] text-danger">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="max-w-[640px] space-y-6">
          <Field label="Nombre del evento" required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Noche de electrónica en Polanco"
              className="input-field"
            />
          </Field>

          <Field label="Descripción">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe tu evento..."
              className="input-field resize-none"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Venue" required>
              <input
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="Ej: Teatro Metropólitan"
                className="input-field"
              />
            </Field>
            <Field label="Ciudad">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="CDMX"
                className="input-field"
              />
            </Field>
          </div>

          <Field label="Dirección del venue">
            <input
              type="text"
              value={venueAddress}
              onChange={(e) => setVenueAddress(e.target.value)}
              placeholder="Ej: Independencia 90, Centro"
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
              placeholder="https://..."
              className="input-field"
            />
          </Field>

          <Field label="Tags de género (separados por coma)">
            <input
              type="text"
              value={genreTags}
              onChange={(e) => setGenreTags(e.target.value)}
              placeholder="Ej: electrónica, house, indie"
              className="input-field"
            />
          </Field>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => {
                if (!title || !venueName || !startDate) {
                  setError("Nombre, venue y fecha son requeridos");
                  return;
                }
                setError(null);
                setStep(2);
              }}
              className="inline-flex items-center gap-2 rounded-md border border-border-ink bg-primary px-6 py-3 font-body text-[13px] font-semibold uppercase tracking-[0.04em] text-primary-fg shadow-brick-md transition hover:bg-primary-hover"
            >
              Siguiente: Boletos
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 3l4 4-4 4" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-[720px]">
          <p className="mb-6 text-[14px] text-fg-muted">
            Agrega al menos un tipo de boleto. Los precios se manejan en MXN.
          </p>

          <div className="space-y-4">
            {tiers.map((tier, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-surface p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-body text-[13px] font-semibold uppercase tracking-[0.04em] text-fg">
                    Tier {i + 1}
                  </span>
                  {tiers.length > 1 && (
                    <button
                      onClick={() => removeTier(i)}
                      className="text-[12px] uppercase text-danger hover:underline"
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Field label="Nombre" required>
                    <input
                      type="text"
                      value={tier.name}
                      onChange={(e) => updateTier(i, "name", e.target.value)}
                      placeholder="Ej: General"
                      className="input-field"
                    />
                  </Field>
                  <Field label="Precio MXN" required>
                    <input
                      type="number"
                      value={tier.price}
                      onChange={(e) => updateTier(i, "price", e.target.value)}
                      placeholder="980"
                      step="0.01"
                      min="0"
                      className="input-field"
                    />
                  </Field>
                  <Field label="Cantidad" required>
                    <input
                      type="number"
                      value={tier.quantity}
                      onChange={(e) => updateTier(i, "quantity", e.target.value)}
                      placeholder="500"
                      min="1"
                      className="input-field"
                    />
                  </Field>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Field label="Inicio de venta">
                    <input
                      type="date"
                      value={tier.saleStartDate}
                      onChange={(e) =>
                        updateTier(i, "saleStartDate", e.target.value)
                      }
                      className="input-field"
                    />
                  </Field>
                  <Field label="Fin de venta">
                    <input
                      type="date"
                      value={tier.saleEndDate}
                      onChange={(e) =>
                        updateTier(i, "saleEndDate", e.target.value)
                      }
                      className="input-field"
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addTier}
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-dashed border-border px-4 py-2.5 font-body text-[12px] font-medium uppercase tracking-[0.04em] text-fg-muted transition hover:border-fg hover:text-fg"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 2v10M2 7h10" />
            </svg>
            Agregar tier
          </button>

          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <button
              onClick={() => setStep(1)}
              className="font-body text-[13px] uppercase tracking-[0.04em] text-fg-muted hover:text-fg"
            >
              Volver a detalles
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={cn(
                "inline-flex items-center gap-2 rounded-md border border-border-ink bg-primary px-6 py-3 font-body text-[13px] font-semibold uppercase tracking-[0.04em] text-primary-fg shadow-brick-md transition hover:bg-primary-hover",
                submitting && "opacity-50 pointer-events-none"
              )}
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-fg/30 border-t-primary-fg" />
                  Creando...
                </>
              ) : (
                "Crear evento"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Global input styles */}
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
