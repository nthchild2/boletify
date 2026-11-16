"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { loadStripe, type Appearance } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Routes, formatMxnPrice } from "@boletify/routes";
import type { CheckoutTier } from "@boletify/api/checkout";
import { calculateOrderAmounts } from "@boletify/api/fees";
import { BrutalButton } from "../../../components/brutal-glass";
import { trpc } from "../../../lib/trpc";
import { cn } from "../../../lib/utils";

const MAX_TICKETS = 10;

export type CheckoutEventView = {
  id: number;
  title: string;
  venueName: string;
  city: string;
  dateLabel: string;
  onSale: boolean;
  tiers: CheckoutTier[];
};

type PendingPayment = {
  orderNumber: string;
  clientSecret: string;
  total: number;
  holdExpiresAt: Date;
};

const panel = "rounded-lg border border-border bg-surface/80 p-5 shadow-brick-sm md:p-6";
const overline = "font-body text-overline uppercase text-fg-muted";
const inputClass =
  "h-12 w-full rounded-md border border-border-strong bg-surface-sunken px-4 font-body text-body-md text-fg placeholder:text-fg-subtle focus:border-primary focus:outline-none focus:shadow-glow-focus";

function money(cents: number): string {
  return formatMxnPrice(cents);
}

export function CheckoutForm({
  event,
  publishableKey,
  paymentsReady,
}: {
  event: CheckoutEventView;
  publishableKey: string;
  paymentsReady: boolean;
}) {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingPayment | null>(null);

  const createCheckout = trpc.orders.createCheckout.useMutation();
  const cancelCheckout = trpc.orders.cancelCheckout.useMutation();

  const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);
  const amounts = calculateOrderAmounts(
    event.tiers.map((tier) => ({ price: tier.price, quantity: quantities[tier.id] ?? 0 })),
  );

  function setQuantity(tier: CheckoutTier, next: number) {
    const others = totalTickets - (quantities[tier.id] ?? 0);
    const max = Math.min(tier.maxPerOrder, tier.available, MAX_TICKETS - others);
    setQuantities((q) => ({ ...q, [tier.id]: Math.max(0, Math.min(next, max)) }));
  }

  async function startPayment(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const result = await createCheckout.mutateAsync({
        eventId: event.id,
        buyerName,
        buyerEmail,
        items: Object.entries(quantities)
          .filter(([, quantity]) => quantity > 0)
          .map(([tierId, quantity]) => ({ tierId: Number(tierId), quantity })),
      });
      if (!result) return;
      setPending({
        orderNumber: result.orderNumber,
        clientSecret: result.clientSecret,
        total: result.amounts.total,
        holdExpiresAt: new Date(result.holdExpiresAt),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos iniciar el pago.");
    }
  }

  async function changeTickets() {
    if (!pending) return;
    const current = pending;
    setPending(null);
    await cancelCheckout
      .mutateAsync({ orderNumber: current.orderNumber, clientSecret: current.clientSecret })
      .catch(() => undefined); // the hold expires on its own anyway
  }

  const header = (
    <div className="mb-10">
      <div className={overline}>
        Checkout · {event.venueName} · {event.city}
      </div>
      <h1 className="mt-3 font-display text-[40px] font-black leading-[0.95] tracking-[-0.03em] text-fg md:text-[64px]">
        {event.title}
      </h1>
      <div className="mt-3 font-mono text-mono-md text-fg-secondary">{event.dateLabel}</div>
    </div>
  );

  if (!event.onSale) {
    return (
      <div>
        {header}
        <div className={cn(panel, "max-w-[640px]")}>
          <div className={overline}>Venta cerrada</div>
          <p className="mt-3 text-body-lg text-fg">
            Este evento no tiene boletos a la venta en este momento.
          </p>
          <div className="mt-6">
            <BrutalButton href={Routes.EVENT_DETAIL(String(event.id))} variant="secondary">
              Volver al evento
            </BrutalButton>
          </div>
        </div>
      </div>
    );
  }

  const summary = (
    <div className={panel}>
      <div className={overline}>Resumen</div>
      <dl className="mt-4 space-y-3 font-mono text-mono-md">
        {event.tiers
          .filter((tier) => (quantities[tier.id] ?? 0) > 0)
          .map((tier) => (
            <div key={tier.id} className="flex justify-between gap-4 text-fg-secondary">
              <dt>
                {quantities[tier.id]}× {tier.name}
              </dt>
              <dd>{money(tier.price * (quantities[tier.id] ?? 0))}</dd>
            </div>
          ))}
        <div className="flex justify-between gap-4 border-t border-border pt-3 text-fg-secondary">
          <dt>Subtotal</dt>
          <dd>{totalTickets ? money(amounts.subtotal) : "—"}</dd>
        </div>
        <div className="flex justify-between gap-4 text-fg-secondary">
          <dt>Cargo por servicio</dt>
          <dd>{totalTickets ? money(amounts.serviceFee) : "—"}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-3 text-[20px] text-fg">
          <dt>Total</dt>
          <dd className="text-primary">{totalTickets ? money(amounts.total) : "—"}</dd>
        </div>
      </dl>
      <p className="mt-4 text-caption text-fg-subtle">Precio final. Sin cargos sorpresa al pagar.</p>
    </div>
  );

  if (pending) {
    return (
      <div>
        {header}
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className={panel}>
            <div className={overline}>Pago con tarjeta</div>
            <p className="mt-2 text-body-sm text-fg-muted">
              Apartamos tus boletos hasta las{" "}
              {pending.holdExpiresAt.toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
              . Pedido {pending.orderNumber}.
            </p>
            <StripePayment
              publishableKey={publishableKey}
              clientSecret={pending.clientSecret}
              orderNumber={pending.orderNumber}
              total={pending.total}
            />
            <button
              type="button"
              onClick={changeTickets}
              className="mt-4 font-mono text-mono-md text-fg-muted hover:text-primary"
            >
              ← Cambiar boletos
            </button>
          </div>
          {summary}
        </div>
      </div>
    );
  }

  const canContinue =
    paymentsReady && totalTickets > 0 && buyerName.trim().length >= 2 && /\S+@\S+\.\S+/.test(buyerEmail);

  return (
    <form onSubmit={startPayment}>
      {header}
      {!paymentsReady ? (
        <div className="mb-8 rounded-lg border border-warning bg-surface/80 p-5 text-body-md text-fg">
          Los pagos todavía no están configurados en este entorno. Agrega las llaves de Stripe para
          poder comprar.
        </div>
      ) : null}

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-8">
          <div className={panel}>
            <div className={overline}>Boletos · máximo {MAX_TICKETS} por compra</div>
            <ul className="mt-4 divide-y divide-border">
              {event.tiers.map((tier) => {
                const quantity = quantities[tier.id] ?? 0;
                const unavailable = !tier.onSale || tier.available === 0;
                const atMax =
                  quantity >= Math.min(tier.maxPerOrder, tier.available) || totalTickets >= MAX_TICKETS;
                return (
                  <li key={tier.id} className="flex items-center justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <div className="font-display text-[20px] font-bold text-fg">{tier.name}</div>
                      {tier.description ? (
                        <div className="text-body-sm text-fg-muted">{tier.description}</div>
                      ) : null}
                      <div className="mt-1 flex flex-wrap gap-x-3 font-mono text-mono-md text-primary">
                        <span className="whitespace-nowrap">{money(tier.price)}</span>
                        {unavailable ? (
                          <span className="text-fg-subtle">
                            {tier.available === 0 ? "AGOTADO" : "NO DISPONIBLE"}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Stepper
                        label={`Quitar un boleto ${tier.name}`}
                        disabled={unavailable || quantity === 0}
                        onClick={() => setQuantity(tier, quantity - 1)}
                      >
                        −
                      </Stepper>
                      <span className="w-6 text-center font-mono text-[20px] text-fg" aria-live="polite">
                        {quantity}
                      </span>
                      <Stepper
                        label={`Agregar un boleto ${tier.name}`}
                        disabled={unavailable || atMax}
                        onClick={() => setQuantity(tier, quantity + 1)}
                      >
                        +
                      </Stepper>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={panel}>
            <div className={overline}>Tus datos</div>
            <p className="mt-2 text-body-sm text-fg-muted">
              Tu pedido queda a nombre de este correo. No necesitas cuenta.
            </p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className={cn(overline, "mb-2 block")}>Nombre</span>
                <input
                  className={inputClass}
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  autoComplete="name"
                  placeholder="Como aparece en tu INE"
                  required
                />
              </label>
              <label className="block">
                <span className={cn(overline, "mb-2 block")}>Correo</span>
                <input
                  className={inputClass}
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="tu@correo.com"
                  required
                />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24">
          {summary}
          {error ? (
            <p role="alert" className="rounded-md border border-danger bg-surface/80 p-4 text-body-sm text-fg">
              {error}
            </p>
          ) : null}
          <BrutalButton
            type="submit"
            size="xl"
            className="w-full"
            disabled={!canContinue || createCheckout.isPending}
          >
            {createCheckout.isPending ? "Apartando boletos…" : "Continuar al pago"}
          </BrutalButton>
        </div>
      </div>
    </form>
  );
}

function Stepper({
  children,
  label,
  disabled,
  onClick,
}: {
  children: string;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-md border border-border-strong font-mono text-[20px] text-fg transition hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

/** Reads the current theme's colors so Stripe's form matches light and dark mode. */
function stripeAppearance(): Appearance {
  const css = getComputedStyle(document.documentElement);
  const rgb = (name: string) => `rgb(${css.getPropertyValue(name).trim().split(/\s+/).join(", ")})`;
  return {
    theme: document.documentElement.classList.contains("dark") ? "night" : "stripe",
    variables: {
      colorPrimary: rgb("--color-primary"),
      colorBackground: rgb("--color-surface-sunken"),
      colorText: rgb("--color-fg"),
      colorDanger: rgb("--color-danger"),
      fontFamily: "Inter, system-ui, sans-serif",
      borderRadius: "6px",
    },
  };
}

function StripePayment({
  publishableKey,
  clientSecret,
  orderNumber,
  total,
}: {
  publishableKey: string;
  clientSecret: string;
  orderNumber: string;
  total: number;
}) {
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);
  const appearance = useMemo(() => stripeAppearance(), []);

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance, locale: "es-419" }}>
      <PayForm orderNumber={orderNumber} total={total} />
    </Elements>
  );
}

function PayForm({ orderNumber, total }: { orderNumber: string; total: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Stripe appends payment_intent_client_secret, which the order page uses as proof of access.
        return_url: `${window.location.origin}${Routes.ORDER_CONFIRMATION(orderNumber)}`,
      },
    });
    // Only reached when the payment didn't redirect (e.g. card declined).
    setError(stripeError?.message ?? "No pudimos procesar el pago.");
    setSubmitting(false);
  }

  return (
    <form onSubmit={pay} className="mt-6">
      <PaymentElement />
      {error ? (
        <p role="alert" className="mt-4 rounded-md border border-danger p-3 text-body-sm text-fg">
          {error}
        </p>
      ) : null}
      <BrutalButton type="submit" size="xl" className="mt-6 w-full" disabled={!stripe || submitting}>
        {submitting ? "Procesando…" : `Pagar ${formatMxnPrice(total)}`}
      </BrutalButton>
    </form>
  );
}
