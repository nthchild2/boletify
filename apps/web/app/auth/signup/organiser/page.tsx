"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Routes } from "@boletify/routes";
import {
  BrutalButton,
  Container,
  PageShell,
  SiteNav,
} from "../../../../components/brutal-glass";

export default function OrganiserSignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [organiserName, setOrganiserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "organiser",
          organiserName: organiserName || name,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Error al crear la cuenta");
        setLoading(false);
        return;
      }

      // Auto sign-in after successful registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push(Routes.AUTH_SIGNIN);
        return;
      }

      // Organisers go straight to their dashboard
      router.push(Routes.ORGANIZER_DASHBOARD);
    } catch {
      setError("Error al crear la cuenta. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <PageShell mesh="ambient">
      <SiteNav />
      <section className="border-t border-border py-20">
        <Container className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_520px]">
          <div>
            <div className="font-body text-overline uppercase text-fg-muted">
              Organizadores · registro
            </div>
            <h1 className="mt-4 font-display text-[56px] font-black leading-[0.92] tracking-[-0.03em] text-fg md:text-[96px]">
              Arma tu
              <br />
              show.
            </h1>
            <p className="mt-5 max-w-[560px] text-body-lg leading-8 text-fg-secondary">
              Crea eventos, vende boletos y cobra directo. Sin intermediarios oscuros,
              sin fees escondidos. Tu público, tus datos, tu lana.
            </p>
            <div className="mt-8 space-y-4 text-body-sm text-fg-muted">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-primary">&#10003;</span>
                <span>Comisión transparente: 5% + $10 MXN por boleto</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-primary">&#10003;</span>
                <span>Pagos con tarjeta, OXXO y Mercado Pago</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-primary">&#10003;</span>
                <span>Check-in por QR en la puerta</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-primary">&#10003;</span>
                <span>Dashboard con ventas en tiempo real</span>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-glass-edge bg-glass-tint p-8 shadow-glass-lg backdrop-blur-glass-md">
            <h2 className="font-display text-heading-lg text-fg">Cuenta de organizador</h2>
            <p className="mt-2 text-body-sm text-fg-muted">
              Registra tu cuenta para empezar a crear y publicar eventos.
            </p>

            {error && (
              <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-body-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block font-body text-overline uppercase text-fg-muted">
                  Tu nombre
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 w-full rounded-md border border-glass-edge bg-glass-tint px-4 font-body text-body-md text-fg shadow-glass-sm backdrop-blur-glass-sm placeholder:text-fg-subtle focus:border-primary focus:outline-none focus:shadow-glow-focus"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-body text-overline uppercase text-fg-muted">
                  Nombre del proyecto / colectivo
                </label>
                <input
                  type="text"
                  value={organiserName}
                  onChange={(e) => setOrganiserName(e.target.value)}
                  className="h-12 w-full rounded-md border border-glass-edge bg-glass-tint px-4 font-body text-body-md text-fg shadow-glass-sm backdrop-blur-glass-sm placeholder:text-fg-subtle focus:border-primary focus:outline-none focus:shadow-glow-focus"
                  placeholder="Ej: Foro Underground, Colectivo Luna, etc."
                />
                <p className="mt-1 text-caption text-fg-subtle">
                  Opcional. Si lo dejas vacío usamos tu nombre.
                </p>
              </div>

              <div>
                <label className="mb-2 block font-body text-overline uppercase text-fg-muted">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-md border border-glass-edge bg-glass-tint px-4 font-body text-body-md text-fg shadow-glass-sm backdrop-blur-glass-sm placeholder:text-fg-subtle focus:border-primary focus:outline-none focus:shadow-glow-focus"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-body text-overline uppercase text-fg-muted">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 w-full rounded-md border border-glass-edge bg-glass-tint px-4 pr-12 font-body text-body-md text-fg shadow-glass-sm backdrop-blur-glass-sm placeholder:text-fg-subtle focus:border-primary focus:outline-none focus:shadow-glow-focus"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg transition-colors"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block font-body text-overline uppercase text-fg-muted">
                  Confirmar contraseña
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 w-full rounded-md border border-glass-edge bg-glass-tint px-4 font-body text-body-md text-fg shadow-glass-sm backdrop-blur-glass-sm placeholder:text-fg-subtle focus:border-primary focus:outline-none focus:shadow-glow-focus"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>

              <button type="submit" disabled={loading} className="w-full text-left">
                <BrutalButton size="xl" className="w-full">
                  {loading ? "Creando..." : "Crear cuenta de organizador"}
                </BrutalButton>
              </button>
            </form>

            <p className="mt-8 text-center text-body-sm text-fg-muted">
              ¿Solo quieres comprar boletos?{" "}
              <Link href={Routes.AUTH_SIGNUP} className="text-primary underline-offset-4 hover:underline">
                Crear cuenta de comprador
              </Link>
            </p>
            <p className="mt-2 text-center text-body-sm text-fg-muted">
              ¿Ya tienes cuenta?{" "}
              <Link href={Routes.AUTH_SIGNIN} className="text-primary underline-offset-4 hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
