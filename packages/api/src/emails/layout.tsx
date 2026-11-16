import React from 'react';
import type { ReactNode } from 'react';
import { Body, Container, Head, Hr, Html, Link, Preview, Section, Text } from '@react-email/components';

/** Brutal-Glass palette, email-safe (no CSS variables in email clients). */
export const colors = {
  ink: '#08080C',
  surface: '#0F0F15',
  raised: '#161620',
  border: '#2E2E3E',
  bone: '#F6F2EA',
  muted: '#9B9BB3',
  signal: '#C6FF2E',
};

export const fonts = {
  display: "'Bricolage Grotesque', 'Helvetica Neue', Arial, sans-serif",
  body: "Inter, 'Helvetica Neue', Arial, sans-serif",
  mono: "'JetBrains Mono', Menlo, Consolas, monospace",
};

export const overline = {
  fontFamily: fonts.body,
  fontSize: '11px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: colors.muted,
  margin: '0 0 6px',
};

export function EmailLayout({
  preview,
  appUrl,
  children,
}: {
  preview: string;
  appUrl: string;
  children: ReactNode;
}) {
  return (
    <Html lang="es-MX">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: colors.ink, margin: 0, padding: '24px 0' }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', padding: '0 16px' }}>
          <Text
            style={{
              fontFamily: fonts.display,
              fontSize: '24px',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: colors.bone,
              margin: '0 0 24px',
            }}
          >
            bolet<span style={{ color: colors.signal }}>ify</span>
          </Text>
          {children}
          <Hr style={{ borderColor: colors.border, margin: '32px 0 16px' }} />
          <Section>
            <Text style={{ fontFamily: fonts.body, fontSize: '13px', color: colors.muted, margin: '0 0 8px' }}>
              ¿Necesitas ayuda? Escríbenos a{' '}
              <Link href="mailto:ayuda@boletify.com" style={{ color: colors.bone }}>
                ayuda@boletify.com
              </Link>
            </Text>
            <Text style={{ fontFamily: fonts.mono, fontSize: '12px', color: colors.muted, margin: 0 }}>
              Boletify · CDMX ·{' '}
              <Link href={`${appUrl}/privacidad`} style={{ color: colors.muted }}>
                Aviso de privacidad
              </Link>{' '}
              ·{' '}
              <Link href={`${appUrl}/terminos`} style={{ color: colors.muted }}>
                Términos
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: 'inline-block',
        backgroundColor: colors.signal,
        color: colors.ink,
        fontFamily: fonts.display,
        fontSize: '17px',
        fontWeight: 700,
        textDecoration: 'none',
        padding: '16px 28px',
        borderRadius: '6px',
        border: '1px solid #000000',
      }}
    >
      {children}
    </Link>
  );
}
