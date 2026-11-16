import { Routes } from "@boletify/routes";
import { BrutalButton, Container, PageShell, SiteNav } from "../../../components/brutal-glass";

export const dynamic = "force-dynamic";

/**
 * Landing page for the emailed magic link. Redeeming takes a click (a POST),
 * so link scanners that open emails automatically don't use up the token.
 */
export default async function TicketAccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { token } = await searchParams;

  return (
    <PageShell mesh="ambient">
      <SiteNav />
      <section className="border-t border-border py-16 md:py-24">
        <Container className="max-w-[640px]">
          <div className="rounded-lg border border-border bg-surface/80 p-6 shadow-brick-sm">
            <div className="font-body text-overline uppercase text-fg-muted">Acceso a tus boletos</div>
            {typeof token === "string" && token ? (
              <>
                <h1 className="mt-3 font-display text-[36px] font-black leading-none tracking-[-0.03em] text-fg">
                  Ya casi.
                </h1>
                <p className="mt-4 text-body-lg text-fg-secondary">
                  Confirma para ver los boletos comprados con tu correo en este dispositivo.
                </p>
                <form action="/api/tickets/access" method="post" className="mt-6">
                  <input type="hidden" name="token" value={token} />
                  <BrutalButton type="submit" size="xl">
                    Ver mis boletos →
                  </BrutalButton>
                </form>
              </>
            ) : (
              <>
                <h1 className="mt-3 font-display text-[36px] font-black leading-none tracking-[-0.03em] text-fg">
                  Enlace incompleto
                </h1>
                <p className="mt-4 text-body-lg text-fg-secondary">
                  Abre el enlace completo desde tu correo o pide uno nuevo.
                </p>
                <BrutalButton href={Routes.MY_TICKETS} variant="secondary" className="mt-6">
                  Pedir un enlace nuevo
                </BrutalButton>
              </>
            )}
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
