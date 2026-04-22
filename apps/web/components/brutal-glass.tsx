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
      <div className="flex items-center gap-4">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink-500">v0.0.2 beta</span>
        <BrutalButton href="/auth/signin" variant="ghost" size="sm">
          Iniciar sesión
        </BrutalButton>
        <BrutalButton href="/auth/signup" variant="primary" size="sm">
          Registrarse
        </BrutalButton>
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

export function EventCard({ event }: { event: any }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group block overflow-hidden rounded-lg border border-ink-800 bg-ink-900 text-bone-50 shadow-brick-md transition duration-fast ease-motion-fast hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brick-lg active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
    >
      <div className={cn("relative aspect-[4/5] overflow-hidden", event.posterClassName)}>
        {event.posterImage && (
          <img src={event.posterImage} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
        )}
        { /* Light gloss overlay always visible */ }
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/0 via-white/8 to-white/18 opacity-25" />
        { /* Heavy gloss overlay on hover */ }
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay bg-gradient-to-br from-white/0 via-white/12 to-white/40 opacity-0 group-hover:opacity-60 transition-opacity" />
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

export function Footer() {
  return (
    <footer className="border-t border-ink-800 py-16">
      <Container>
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-display text-2xl font-black tracking-tight text-bone-50">
              Boletify
            </div>
            <p className="mt-3 max-w-sm text-body-sm text-ink-300">
              La plataforma de ticketing transparente para organizadores independientes y fans de la música en vivo.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://instagram.com/boletify"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-400 transition-colors hover:text-signal-500"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/boletify"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-400 transition-colors hover:text-signal-500"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@boletify"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-400 transition-colors hover:text-signal-500"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-ink-400">Organizadores</div>
            <ul className="mt-4 space-y-2 text-body-sm">
              <li>
                <a href="/organizador" className="text-ink-300 transition-colors hover:text-bone-50">
                  Crear evento
                </a>
              </li>
              <li>
                <a href="/panel" className="text-ink-300 transition-colors hover:text-bone-50">
                  Panel de control
                </a>
              </li>
              <li>
                <a href="/precios" className="text-ink-300 transition-colors hover:text-bone-50">
                  Precios
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-ink-400">Empresa</div>
            <ul className="mt-4 space-y-2 text-body-sm">
              <li>
                <a href="/about" className="text-ink-300 transition-colors hover:text-bone-50">
                  Nosotros
                </a>
              </li>
              <li>
                <a href="/ayuda" className="text-ink-300 transition-colors hover:text-bone-50">
                  Ayuda
                </a>
              </li>
              <li>
                <a href="mailto:hola@boletify.com" className="text-ink-300 transition-colors hover:text-bone-50">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap justify-between gap-4 border-t border-ink-800 pt-8">
          <div className="font-mono text-xs uppercase tracking-widest text-ink-500">
            © 2026 Boletify
          </div>
          <div className="flex gap-6 font-mono text-xs uppercase tracking-widest text-ink-500">
            <a href="/privacidad" className="transition-colors hover:text-ink-300">Privacidad</a>
            <a href="/terminos" className="transition-colors hover:text-ink-300">Términos</a>
          </div>
        </div>
      </Container>
    </footer>
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
