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
} from "../../../components/brutal-glass";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Register the user
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Error al crear la cuenta");
        setLoading(false);
        return;
      }

      // 2. Auto sign-in after successful registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Registration succeeded but auto-login failed — redirect to sign-in
        router.push(Routes.AUTH_SIGNIN);
        return;
      }

      router.push(Routes.MY_TICKETS);
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
            <div className="font-body text-overline uppercase text-fg-muted">Cuenta · registro</div>
            <h1 className="mt-4 font-display text-[56px] font-black leading-[0.92] tracking-[-0.03em] text-fg md:text-[96px]">
              Haz perfil,
              <br />
              arma plan.
            </h1>
            <p className="mt-5 max-w-[560px] text-body-lg leading-8 text-fg-secondary">
              Desde aquí arranca todo: seguir artistas, guardar eventos y recibir el boleto
              como un artefacto, no como un PDF triste.
            </p>
          </div>

          <div className="rounded-[28px] border border-glass-edge bg-glass-tint p-8 shadow-glass-lg backdrop-blur-glass-md">
            <h2 className="font-display text-heading-lg text-fg">Crear cuenta</h2>
            <p className="mt-2 text-body-sm text-fg-muted">
              Regístrate para comprar tickets, gestionar accesos y seguir tus venues favoritos.
            </p>

            {error && (
              <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-body-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block font-body text-overline uppercase text-fg-muted">
                  Nombre
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 w-full rounded-md border border-glass-edge bg-glass-tint px-4 font-body text-body-md text-fg shadow-glass-sm backdrop-blur-glass-sm placeholder:text-fg-subtle focus:border-primary focus:outline-none focus:shadow-glow-focus"
                  placeholder="Tu nombre"
                  required
                />
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
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-md border border-glass-edge bg-glass-tint px-4 font-body text-body-md text-fg shadow-glass-sm backdrop-blur-glass-sm placeholder:text-fg-subtle focus:border-primary focus:outline-none focus:shadow-glow-focus"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <button type="submit" disabled={loading} className="w-full text-left">
                <BrutalButton size="xl" className="w-full">
                  {loading ? "Creando..." : "Crear cuenta"}
                </BrutalButton>
              </button>
            </form>

            <p className="mt-8 text-center text-body-sm text-fg-muted">
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
