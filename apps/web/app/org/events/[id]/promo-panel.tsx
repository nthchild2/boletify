"use client";

import { useState, type FormEvent } from "react";
import { trpc } from "../../../../lib/trpc";
import { cn } from "../../../../lib/utils";
import { formatMoney } from "../../org-ui";

const label =
  "mb-1.5 block font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-muted";
const input =
  "h-11 w-full rounded-md border border-border-strong bg-surface-sunken px-3 font-body text-[15px] text-fg placeholder:text-fg-subtle focus:border-primary focus:outline-none";

const STATUS: Record<string, { label: string; className: string }> = {
  active: {
    label: "Activo",
    className: "border-primary/20 bg-primary/10 text-primary",
  },
  inactive: {
    label: "Desactivado",
    className: "border-border bg-surface-raised text-fg-muted",
  },
  expired: {
    label: "Expirado",
    className: "border-border bg-surface-raised text-fg-muted",
  },
  exhausted: {
    label: "Agotado",
    className: "border-danger/20 bg-danger/10 text-danger",
  },
};

function discountLabel(p: {
  discountType: string;
  discountValue: number;
}): string {
  return p.discountType === "percentage"
    ? `${p.discountValue}%`
    : formatMoney(p.discountValue);
}

/** "Códigos" tab: create and manage the event's promo codes (PRO-002). */
export function PromoPanel({ eventId }: { eventId: number }) {
  const utils = trpc.useUtils();
  const { data: promos, isLoading } = trpc.promoCodes.list.useQuery({
    eventId,
  });
  const refresh = () => utils.promoCodes.list.invalidate({ eventId });
  const create = trpc.promoCodes.create.useMutation({
    onSuccess: () => {
      refresh();
      setForm(emptyForm);
    },
  });
  const update = trpc.promoCodes.update.useMutation({ onSuccess: refresh });
  const remove = trpc.promoCodes.delete.useMutation({ onSuccess: refresh });

  const emptyForm = {
    code: "",
    discountType: "percentage" as "percentage" | "flat",
    amount: "",
    maxUses: "",
    expiresAt: "",
  };
  const [form, setForm] = useState(emptyForm);

  function submit(e: FormEvent) {
    e.preventDefault();
    const amount = Number(form.amount);
    create.mutate({
      eventId,
      code: form.code,
      discountType: form.discountType,
      // % as-is; flat amounts are typed in pesos and stored in cents
      discountValue:
        form.discountType === "flat" ? Math.round(amount * 100) : amount,
      maxUses: form.maxUses ? Number(form.maxUses) : null,
      // datetime-local is the organiser's local time; send it as an absolute instant
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
    });
  }

  const rowError = update.error?.message ?? remove.error?.message ?? null;

  return (
    <div className="space-y-8">
      <form
        onSubmit={submit}
        className="rounded-lg border border-border bg-surface p-6"
      >
        <h2 className="font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-muted">
          Nuevo código de descuento
        </h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div>
            <label className={label} htmlFor="promo-code">
              Código *
            </label>
            <input
              id="promo-code"
              className={cn(input, "font-mono uppercase")}
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
              placeholder="AMIGOS50"
              maxLength={30}
              required
            />
          </div>
          <fieldset>
            <legend className={label}>Tipo de descuento</legend>
            <div className="flex h-11 items-center gap-5 text-[14px] text-fg">
              {(
                [
                  ["percentage", "Porcentaje (%)"],
                  ["flat", "Monto fijo ($MXN)"],
                ] as const
              ).map(([value, text]) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="discountType"
                    checked={form.discountType === value}
                    onChange={() => setForm({ ...form, discountType: value })}
                  />
                  {text}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label className={label} htmlFor="promo-amount">
              {form.discountType === "percentage"
                ? "Descuento (%) *"
                : "Descuento por compra ($MXN) *"}
            </label>
            <input
              id="promo-amount"
              className={input}
              type="number"
              inputMode="decimal"
              min={form.discountType === "percentage" ? 1 : 1}
              max={form.discountType === "percentage" ? 100 : 10000}
              step={form.discountType === "percentage" ? 1 : 0.01}
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={label} htmlFor="promo-max">
              Usos máximos
            </label>
            <input
              id="promo-max"
              className={input}
              type="number"
              min={1}
              step={1}
              value={form.maxUses}
              onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
              placeholder="Sin límite"
            />
          </div>
          <div>
            <label className={label} htmlFor="promo-expires">
              Expira
            </label>
            <input
              id="promo-expires"
              className={input}
              type="datetime-local"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            />
          </div>
        </div>
        <p className="mt-4 text-[12px] text-fg-muted">
          El descuento se resta del precio de los boletos; el cargo por servicio
          se calcula sobre el precio con descuento. Un monto fijo se descuenta
          una vez por compra.
        </p>
        {create.error ? (
          <p
            role="alert"
            className="mt-4 rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-[14px] text-fg"
          >
            {create.error.message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={create.isPending}
          className="mt-5 inline-flex rounded-md border border-border-ink bg-primary px-5 py-3 font-body text-[13px] font-semibold uppercase tracking-[0.04em] text-primary-fg shadow-brick-md transition hover:bg-primary-hover disabled:opacity-50"
        >
          {create.isPending ? "Creando…" : "Crear código"}
        </button>
      </form>

      <section>
        <h2 className="mb-3 font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-muted">
          Códigos de este evento
        </h2>
        {rowError ? (
          <p
            role="alert"
            className="mb-3 rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-[14px] text-fg"
          >
            {rowError}
          </p>
        ) : null}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-border bg-surface text-left font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-muted">
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Descuento</th>
                <th className="px-4 py-3">Usos</th>
                <th className="px-4 py-3">Descuento dado</th>
                <th className="px-4 py-3">Expira</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {!isLoading && promos?.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-[14px] text-fg-muted"
                  >
                    Aún no hay códigos.
                  </td>
                </tr>
              ) : null}
              {promos?.map((p) => {
                const status = STATUS[p.status] ?? STATUS.inactive;
                return (
                  <tr
                    key={p.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 font-mono text-[14px] text-fg">
                      {p.code}
                    </td>
                    <td className="px-4 py-3 font-mono text-[13px] text-fg-secondary">
                      {discountLabel(p)}
                    </td>
                    <td className="px-4 py-3 font-mono text-[13px] text-fg-secondary">
                      {p.usesCount} / {p.maxUses ?? "∞"}
                    </td>
                    <td className="px-4 py-3 font-mono text-[13px] text-fg-secondary">
                      {formatMoney(p.discountGiven)}{" "}
                      <span className="text-fg-muted">
                        ({p.paidOrders}{" "}
                        {p.paidOrders === 1 ? "compra" : "compras"})
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-fg-secondary">
                      {p.expiresAt
                        ? new Date(p.expiresAt).toLocaleString("es-MX", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                            timeZone: "America/Mexico_City",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.04em]",
                          status.className,
                        )}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          update.mutate({
                            eventId,
                            id: p.id,
                            isActive: !p.isActive,
                          })
                        }
                        disabled={update.isPending}
                        className="font-body text-[12px] font-semibold uppercase tracking-[0.04em] text-fg-secondary hover:text-primary"
                      >
                        {p.isActive ? "Desactivar" : "Activar"}
                      </button>
                      {p.usesCount === 0 && p.paidOrders === 0 ? (
                        <button
                          type="button"
                          onClick={() => remove.mutate({ eventId, id: p.id })}
                          disabled={remove.isPending}
                          className="ml-4 font-body text-[12px] font-semibold uppercase tracking-[0.04em] text-danger hover:underline"
                        >
                          Eliminar
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
