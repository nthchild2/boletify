"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Routes } from "@boletify/routes";
import {
  BrutalButton,
  Container,
  PageShell,
  SiteNav,
} from "../../../components/brutal-glass";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Call sign-in API
    setTimeout(() => {
      router.push(Routes.MY_TICKETS);
    }, 1000);
  };

  return (
    <PageShell mesh="hero">
      <SiteNav />
      <section className="border-t border-ink-800 py-20">
        <Container className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_480px]">
          <div>
            <div className="font-body text-overline uppercase text-ink-300">Cuenta · acceso</div>
            <h1 className="mt-4 font-display text-[56px] font-black leading-[0.92] tracking-[-0.03em] text-bone-50 md:text-[96px]">
              Inicia y
              <br />
              sal.
            </h1>
            <p className="mt-5 max-w-[560px] text-body-lg leading-8 text-ink-200">
              Entrar a Boletify debe sentirse igual que comprar un boleto: directo,
              contundente y sin interfaces tibias.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-glass-lg backdrop-blur-glass-md">
            <h2 className="font-display text-heading-lg text-bone-50">Iniciar sesión</h2>
            <p className="mt-2 text-body-sm text-ink-300">
              Accede a tu cuenta para comprar tickets, revisar tu QR y guardar eventos.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block font-body text-overline uppercase text-ink-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-md border border-white/10 bg-white/5 px-4 font-body text-body-md text-bone-50 shadow-glass-sm backdrop-blur-glass-sm placeholder:text-ink-400 focus:border-signal-500 focus:outline-none focus:shadow-glow-focus"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-body text-overline uppercase text-ink-300">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-md border border-white/10 bg-white/5 px-4 font-body text-body-md text-bone-50 shadow-glass-sm backdrop-blur-glass-sm placeholder:text-ink-400 focus:border-signal-500 focus:outline-none focus:shadow-glow-focus"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="w-full text-left">
                <BrutalButton size="xl" className="w-full">
                  {loading ? "Iniciando..." : "Iniciar sesión"}
                </BrutalButton>
              </button>
            </form>

            <p className="mt-8 text-center text-body-sm text-ink-300">
              ¿No tienes cuenta?{" "}
              <Link href={Routes.AUTH_SIGNUP} className="text-signal-500 underline-offset-4 hover:underline">
                Crear cuenta
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
