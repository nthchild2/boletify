import React from 'react';
import { Column, Heading, Img, Row, Section, Text } from '@react-email/components';
import { EmailLayout, PrimaryButton, colors, fonts, overline } from './layout';

export type OrderConfirmationEmailProps = {
  appUrl: string;
  orderNumber: string;
  buyerName: string | null;
  event: { title: string; dateLabel: string; venueName: string; city: string };
  lines: Array<{ tierName: string; quantity: number }>;
  totalLabel: string;
  tickets: Array<{ ticketNumber: string; tierName: string; qrImageUrl: string }>;
  viewTicketsUrl: string;
};

export function OrderConfirmationEmail(props: OrderConfirmationEmailProps) {
  const { event, tickets } = props;
  const firstName = props.buyerName?.trim().split(/\s+/)[0];
  const rows: Array<typeof tickets> = [];
  for (let i = 0; i < tickets.length; i += 2) rows.push(tickets.slice(i, i + 2));

  return (
    <EmailLayout
      appUrl={props.appUrl}
      preview={`Tus boletos para ${event.title} · ${event.dateLabel}`}
    >
      <Heading
        as="h1"
        style={{
          fontFamily: fonts.display,
          fontSize: '36px',
          lineHeight: '38px',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          color: colors.bone,
          margin: '0 0 12px',
        }}
      >
        {firstName ? `¡Listo, ${firstName}!` : '¡Listo!'} Tienes tus boletos.
      </Heading>
      <Text style={{ fontFamily: fonts.body, fontSize: '16px', lineHeight: '24px', color: colors.muted, margin: '0 0 24px' }}>
        Muestra el código QR en la entrada. Cada boleto tiene el suyo y solo entra una vez.
      </Text>

      <Section
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <Text style={overline}>Pedido {props.orderNumber}</Text>
        <Text style={{ fontFamily: fonts.display, fontSize: '22px', fontWeight: 700, color: colors.bone, margin: '0 0 12px' }}>
          {event.title}
        </Text>
        <Text style={{ fontFamily: fonts.mono, fontSize: '14px', lineHeight: '22px', color: colors.bone, margin: 0 }}>
          {event.dateLabel}
          <br />
          {event.venueName} · {event.city}
          <br />
          {props.lines.map((l) => `${l.quantity}× ${l.tierName}`).join(' · ')}
        </Text>
        <Text style={{ fontFamily: fonts.mono, fontSize: '18px', color: colors.signal, margin: '12px 0 0' }}>
          Total pagado {props.totalLabel}
        </Text>
      </Section>

      <Section style={{ marginTop: '24px' }}>
        {rows.map((row, i) => (
          <Row key={i} style={{ marginBottom: '16px' }}>
            {row.map((ticket, j) => (
              <Column key={ticket.ticketNumber} style={{ width: '50%', padding: '0 6px', verticalAlign: 'top' }}>
                <Img
                  src={ticket.qrImageUrl}
                  width="240"
                  height="240"
                  alt={`Código QR del boleto ${ticket.ticketNumber}`}
                  style={{ width: '100%', maxWidth: '240px', height: 'auto', backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #000000' }}
                />
                <Text style={{ ...overline, margin: '8px 0 2px' }}>
                  Boleto {i * 2 + j + 1} de {tickets.length} · {ticket.tierName}
                </Text>
                <Text style={{ fontFamily: fonts.mono, fontSize: '13px', color: colors.bone, margin: 0 }}>
                  {ticket.ticketNumber}
                </Text>
              </Column>
            ))}
            {row.length === 1 ? <Column style={{ width: '50%' }} /> : null}
          </Row>
        ))}
      </Section>

      <Section style={{ marginTop: '16px' }}>
        <PrimaryButton href={props.viewTicketsUrl}>Ver mis boletos →</PrimaryButton>
      </Section>
    </EmailLayout>
  );
}
