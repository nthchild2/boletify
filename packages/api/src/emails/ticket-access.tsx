import React from 'react';
import { Heading, Section, Text } from '@react-email/components';
import { EmailLayout, PrimaryButton, colors, fonts } from './layout';

export type TicketAccessEmailProps = {
  appUrl: string;
  accessUrl: string;
  expiresInMinutes: number;
};

export function TicketAccessEmail({ appUrl, accessUrl, expiresInMinutes }: TicketAccessEmailProps) {
  return (
    <EmailLayout appUrl={appUrl} preview="Tu enlace para ver tus boletos en Boletify">
      <Heading
        as="h1"
        style={{
          fontFamily: fonts.display,
          fontSize: '32px',
          lineHeight: '34px',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          color: colors.bone,
          margin: '0 0 12px',
        }}
      >
        Tus boletos, a un clic.
      </Heading>
      <Text style={{ fontFamily: fonts.body, fontSize: '16px', lineHeight: '24px', color: colors.muted, margin: '0 0 24px' }}>
        Abre este enlace para ver todos los boletos comprados con este correo. Sirve una sola vez y caduca
        en {expiresInMinutes} minutos.
      </Text>
      <Section>
        <PrimaryButton href={accessUrl}>Ver mis boletos →</PrimaryButton>
      </Section>
      <Text style={{ fontFamily: fonts.body, fontSize: '13px', lineHeight: '20px', color: colors.muted, margin: '24px 0 0' }}>
        Si no pediste este enlace, ignora este correo. Nadie puede ver tus boletos sin él.
      </Text>
    </EmailLayout>
  );
}
