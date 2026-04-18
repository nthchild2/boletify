import Link from "next/link";
import type { ReactNode } from "react";
import type { EventRecord } from "../lib/mock-data";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-ink-800 bg-[rgba(8,8,12,0.72)] px-5 py-3 backdrop-blur-[20px] md:px-12 md:py-4">
      <Link
        href="/"
        className="font-display text-[22px] font-black tracking-[-0.03em] text-bone-50"
      >
        bolet<span className="text-signal-500">ify</span>
      </Link>
      <div className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink-300">
        v2.0 · Brutal-Glass · 2026
      </div>
    </nav>
  );
}

export function PageShell({
  children,
  mesh = "hero",
}: {
  children: ReactNode;
  mesh?: "hero" | "ambient" | "none";
}) {
  const meshClassName =
    mesh === "hero"
      ? "bg-mesh-gradient"
      : mesh === "ambient"
        ? "bg-[radial-gradient(900px_500px_at_20%_0%,rgba(198,255,46,0.08),transparent_55%),radial-gradient(700px_600px_at_90%_30%,rgba(255,46,136,0.10),transparent_55%),#0F0F15]"
        : "bg-ink-950";

  return <div className={cn("min-h-screen text-bone-50", meshClassName)}>{children}</div>;
}

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto w-full max-w-[1440px] px-5 md:px-12", className)}>{children}</div>;
}

export function SectionHeading({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
      <div>
        <div className="font-body text-overline uppercase text-ink-300">{kicker}</div>
        <h2 className="mt-3 font-display text-[40px] font-[850] leading-[0.95] tracking-[-0.03em] text-bone-50 md:text-[72px]">
          {title}
        </h2>
      </div>
      {description ? (
        <div className="max-w-[420px] text-body-sm leading-7 text-ink-300">{description}</div>
      ) : null}
    </div>
  );
}

export function BrutalButton({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "accent" | "secondary" | "ghost" | "glass" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const baseClassName =
    "inline-flex items-center justify-center gap-2 rounded-md border text-center font-body uppercase transition duration-instant ease-motion-instant focus-visible:outline-none focus-visible:shadow-glow-focus";
  const variantClassName = {
    primary:
      "border-ink-1000 bg-signal-500 text-ink-950 shadow-brick-md hover:bg-signal-400 active:translate-x-[6px] active:translate-y-[6px] active:shadow-none",
    accent:
      "border-ink-1000 bg-rosa-500 text-ink-950 shadow-brick-md hover:bg-rosa-400 active:translate-x-[6px] active:translate-y-[6px] active:shadow-none",
    secondary:
      "border-ink-700 bg-transparent text-bone-50 hover:border-signal-500 hover:text-signal-500",
    ghost: "border-transparent bg-transparent text-bone-50 hover:text-signal-500",
    glass:
      "rounded-xl border-white/10 bg-white/5 text-bone-50 shadow-glass-md backdrop-blur-glass-sm",
    danger:
      "border-ink-1000 bg-oxblood-500 text-bone-50 shadow-brick-md hover:bg-oxblood-400 active:translate-x-[6px] active:translate-y-[6px] active:shadow-none",
  }[variant];
  const sizeClassName = {
    sm: "h-9 px-3.5 text-[12px] font-semibold tracking-[0.04em]",
    md: "h-[52px] px-6 text-label tracking-[0.04em]",
    lg: "h-[52px] px-8 text-label tracking-[0.04em]",
    xl: "h-16 px-8 font-display text-[18px] font-bold normal-case tracking-[-0.01em]",
  }[size];

  if (href) {
    return (
      <Link href={href} className={cn(baseClassName, variantClassName, sizeClassName, className)}>
        {children}
      </Link>
    );
  }

  return <div className={cn(baseClassName, variantClassName, sizeClassName, className)}>{children}</div>;
}

export function HeroKicker({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-xs border border-ink-700 px-[14px] py-2 font-body text-overline uppercase text-ink-300">
      <span className="h-1.5 w-1.5 rounded-full bg-signal-500 shadow-glow-signal" />
      <span>{children}</span>
    </div>
  );
}

export function EventCard({ event }: { event: EventRecord }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group block overflow-hidden rounded-lg border border-ink-800 bg-ink-900 text-bone-50 shadow-brick-md transition duration-fast ease-motion-fast hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brick-lg active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
    >
      <div className={cn("relative aspect-[4/5] overflow-hidden", event.posterClassName)}>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(8,8,12,0.72)_100%)]" />
        <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between gap-3">
          <span
            className={cn(
              "rounded-xs border px-2.5 py-1 font-body text-overline uppercase",
              event.accent === "signal"
                ? "border-ink-950 bg-signal-500 text-ink-950"
                : "border-white/10 bg-[rgba(8,8,12,0.72)] text-bone-50 backdrop-blur-[12px]",
            )}
          >
            {event.status}
          </span>
          <span className="rounded-xs border border-white/10 bg-[rgba(8,8,12,0.72)] px-2.5 py-1 font-body text-overline uppercase text-ink-100 backdrop-blur-[12px]">
            {event.category}
          </span>
        </div>
        <div className="absolute inset-0 z-[1] flex items-end p-4">
          <span className="whitespace-pre-line font-display text-[56px] font-black uppercase leading-[0.9] tracking-[-0.035em] text-bone-50/95">
            {event.posterTitle}
          </span>
        </div>
      </div>
      <div className="grid gap-2 p-5">
        <div className="font-mono text-mono-sm uppercase tracking-[0.08em] text-ink-300">
          {event.eyebrow}
        </div>
        <h3 className="font-display text-heading-md font-bold leading-[1.125] tracking-[-0.01em] text-bone-50">
          {event.title}
        </h3>
        <div className="mt-2 flex items-baseline justify-between gap-4">
          <span className="text-body-sm text-ink-300">
            {event.venue} · {event.location}
          </span>
          <span className="font-mono text-mono-md text-signal-500">{event.price}</span>
        </div>
      </div>
    </Link>
  );
}

export function StatStrip({
  stats,
}: {
  stats: Array<{ label: string; value: string; delta?: string }>;
}) {
  return (
    <dl className="grid grid-cols-1 gap-6 border-y border-ink-800 py-8 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={cn("px-0 md:px-6", index === 0 ? "" : "md:border-l md:border-ink-800")}
        >
          <dt className="mb-3 font-body text-overline uppercase text-ink-300">{stat.label}</dt>
          <dd className="font-mono text-[36px] leading-none tracking-[-0.02em] text-bone-50">
            {stat.value}
            {stat.delta ? <small className="ml-2 text-[14px] text-signal-500">{stat.delta}</small> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function TicketArtifact({ event }: { event: EventRecord }) {
  return (
    <div className="relative flex min-h-[720px] items-center justify-center py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(400px_400px_at_50%_50%,rgba(198,255,46,0.12),transparent_60%),radial-gradient(500px_500px_at_50%_50%,rgba(255,46,136,0.14),transparent_65%)]" />
      <div className="relative aspect-[9/16] w-[360px] max-w-[90%] overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(600px_300px_at_50%_0%,rgba(255,46,136,0.18),transparent_60%),radial-gradient(600px_400px_at_50%_100%,rgba(198,255,46,0.14),transparent_60%),rgba(22,22,32,0.72)] shadow-glass-lg backdrop-blur-glass-md">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.7)_1px,transparent_0)] [background-size:12px_12px]" />
        <div className="relative flex h-full flex-col p-7">
          <div className="font-body text-overline uppercase text-ink-200">
            {event.venue} <span className="text-signal-500">·</span> {event.location}
          </div>
          <h3 className="mt-4 font-display text-[44px] font-black leading-[0.92] tracking-[-0.03em] text-bone-50">
            {event.title.split(" ").slice(0, 2).join(" ")}
            <br />
            {event.title.split(" ").slice(2).join(" ")}
          </h3>
          <p className="mt-2 text-body-sm text-ink-200">{event.lineup}</p>
          <dl className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <dt className="mb-1.5 font-body text-[10px] font-bold uppercase tracking-[0.16em] text-ink-300">
                Fecha
              </dt>
              <dd className="font-mono text-[16px] text-bone-50">{event.date}</dd>
            </div>
            <div>
              <dt className="mb-1.5 font-body text-[10px] font-bold uppercase tracking-[0.16em] text-ink-300">
                Acceso
              </dt>
              <dd className="font-mono text-[16px] text-bone-50">{event.access}</dd>
            </div>
            <div>
              <dt className="mb-1.5 font-body text-[10px] font-bold uppercase tracking-[0.16em] text-ink-300">
                Sección
              </dt>
              <dd className="font-mono text-[16px] text-bone-50">GRAL A</dd>
            </div>
            <div>
              <dt className="mb-1.5 font-body text-[10px] font-bold uppercase tracking-[0.16em] text-ink-300">
                Precio
              </dt>
              <dd className="font-mono text-[16px] text-signal-500">{event.price}</dd>
            </div>
          </dl>
          <div className="absolute left-0 right-0 top-[62%] border-t border-dashed border-white/20" />
          <div className="mt-auto flex flex-col items-center gap-3 pt-8">
            <div className="grid h-32 w-32 grid-cols-7 gap-1 rounded-md bg-white p-2 shadow-glow-signal">
              {Array.from({ length: 49 }).map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "rounded-[1px]",
                    [0, 1, 2, 7, 9, 14, 15, 16, 42, 43, 44, 35, 37, 28, 29, 30].includes(index) ||
                      index % 3 === 0 ||
                      index % 5 === 0
                      ? "bg-ink-950"
                      : "bg-white",
                  )}
                />
              ))}
            </div>
            <div className="font-mono text-mono-md uppercase tracking-[0.08em] text-ink-200">
              TCK · 0412 · 0091
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BrutalInput({
  label,
  hint,
  error,
  placeholder,
  defaultValue,
  type = "text",
  glass = false,
}: {
  label: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  defaultValue?: string;
  type?: string;
  glass?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block font-body text-overline uppercase text-ink-300">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={cn(
          "h-12 w-full rounded-md border px-4 font-body text-body-md text-bone-50 placeholder:text-ink-400 focus:border-signal-500 focus:outline-none focus:shadow-glow-focus",
          glass
            ? "border-white/10 bg-white/5 shadow-glass-sm backdrop-blur-glass-sm"
            : "border-ink-700 bg-ink-850",
          error ? "border-oxblood-500" : "",
        )}
      />
      {hint ? (
        <p className={cn("mt-2 text-caption", error ? "text-oxblood-400" : "text-ink-400")}>
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}

export function MarqueeBand({ items }: { items: string[] }) {
  const content = items.join(" · ");
  return (
    <div className="overflow-hidden border-y border-ink-800 bg-ink-950 py-6">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        <span className="pr-12 font-display text-[48px] font-[850] uppercase tracking-[-0.03em] text-bone-50 md:text-[96px]">
          {content} ·
        </span>
        <span className="pr-12 font-display text-[48px] font-[850] uppercase tracking-[-0.03em] text-bone-50 md:text-[96px]">
          {content} ·
        </span>
      </div>
    </div>
  );
}
