"use client";

import { useEffect, useState, type FormEvent } from "react";
import { trpc } from "../../../lib/trpc";

const label =
  "mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-muted";
const input =
  "h-11 w-full rounded-md border border-border-strong bg-surface-sunken px-3 font-body text-[15px] text-fg placeholder:text-fg-subtle focus:border-primary focus:outline-none";

/** ORG-001: the organiser's public profile (shown on their event pages). */
export default function OrgSettingsPage() {
  const utils = trpc.useUtils();
  const {
    data: profile,
    isLoading,
    error: loadError,
  } = trpc.organiser.profile.useQuery();
  const save = trpc.organiser.updateProfile.useMutation({
    onSuccess: (updated) => {
      utils.organiser.profile.setData(undefined, updated);
      setSavedAt(Date.now());
    },
  });

  const [form, setForm] = useState({
    organiserName: "",
    bio: "",
    logoUrl: "",
    slug: "",
  });
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (profile) {
      setForm({
        organiserName: profile.organiserName,
        bio: profile.bio ?? "",
        logoUrl: profile.logoUrl ?? "",
        slug: profile.slug,
      });
    }
  }, [profile]);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSavedAt(null);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    save.mutate(form);
  }

  const logoOk = /^https:\/\/\S+$/i.test(form.logoUrl.trim());

  return (
    <div className="max-w-[760px] p-8">
      <div className="font-body text-[11px] uppercase tracking-[0.06em] text-fg-muted">
        Ajustes
      </div>
      <h1 className="mt-2 font-display text-[36px] font-[850] leading-[0.95] tracking-[-0.03em] text-fg">
        Perfil de organizador
      </h1>
      <p className="mt-3 text-[14px] text-fg-muted">
        Así te ven los compradores en la página de cada evento.
      </p>

      {loadError ? (
        <div className="mt-6 rounded-lg border border-danger/40 p-4 text-[14px] text-fg">
          {loadError.message}
        </div>
      ) : isLoading ? (
        <div className="mt-10 h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      ) : (
        <form
          onSubmit={submit}
          className="mt-8 space-y-6 rounded-lg border border-border bg-surface p-6"
        >
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-strong bg-surface-sunken">
              {logoOk ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.logoUrl.trim()}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-display text-[28px] font-black text-fg-muted">
                  {form.organiserName.trim().charAt(0).toUpperCase() || "?"}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <label className={label} htmlFor="logoUrl">
                Logo (URL de la imagen)
              </label>
              <input
                id="logoUrl"
                className={input}
                value={form.logoUrl}
                onChange={(e) => update("logoUrl", e.target.value)}
                placeholder="https://…/logo.png"
                inputMode="url"
              />
              <p className="mt-1.5 text-[12px] text-fg-muted">
                Pronto podrás subir la imagen directamente.
              </p>
            </div>
          </div>

          <div>
            <label className={label} htmlFor="organiserName">
              Nombre del organizador *
            </label>
            <input
              id="organiserName"
              className={input}
              value={form.organiserName}
              onChange={(e) => update("organiserName", e.target.value)}
              maxLength={80}
              required
            />
          </div>

          <div>
            <label className={label} htmlFor="slug">
              Enlace público *
            </label>
            <div className="flex items-center overflow-hidden rounded-md border border-border-strong bg-surface-sunken focus-within:border-primary">
              <span className="pl-3 font-mono text-[13px] text-fg-muted">
                boletify.mx/o/
              </span>
              <input
                id="slug"
                className="h-11 min-w-0 flex-1 bg-transparent px-1 font-mono text-[15px] text-fg focus:outline-none"
                value={form.slug}
                onChange={(e) =>
                  update(
                    "slug",
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                  )
                }
                maxLength={40}
                required
              />
            </div>
            <p className="mt-1.5 text-[12px] text-fg-muted">
              Letras minúsculas, números y guiones.
            </p>
          </div>

          <div>
            <label className={label} htmlFor="bio">
              Bio (breve)
            </label>
            <textarea
              id="bio"
              className={`${input} h-28 resize-y py-2`}
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              maxLength={500}
              placeholder="Producimos los mejores shows indie de la ciudad…"
            />
            <p className="mt-1 text-right font-mono text-[11px] text-fg-muted">
              {form.bio.length}/500
            </p>
          </div>

          {save.error ? (
            <p
              role="alert"
              className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-[14px] text-fg"
            >
              {save.error.message}
            </p>
          ) : null}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={save.isPending}
              className="inline-flex items-center rounded-md border border-border-ink bg-primary px-5 py-3 font-body text-[13px] font-semibold uppercase tracking-[0.04em] text-primary-fg shadow-brick-md transition hover:bg-primary-hover disabled:opacity-50"
            >
              {save.isPending ? "Guardando…" : "Guardar perfil"}
            </button>
            {savedAt ? (
              <span role="status" className="text-[13px] text-fg-muted">
                ✅ Guardado
              </span>
            ) : null}
          </div>
        </form>
      )}
    </div>
  );
}
