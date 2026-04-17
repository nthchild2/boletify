# NTF-001: Order Confirmation Email

**Epic:** Notifications
**Ticket ID:** NTF-001
**Type:** feature
**Status:** TODO

---

## Description

Send a branded order confirmation email to buyers immediately after payment is confirmed. The email includes event details, QR ticket(s), and a "View My Tickets" link. This is the most important transactional email — it must be reliable, branded, and mobile-optimized.

Phase 2 refs: C1 (order confirmation email), Phase 3 Appendix B (email template E-01).

---

## Acceptance Criteria

- [ ] **AC1:** Email is sent within 5 seconds of payment confirmation webhook firing.
- [ ] **AC2:** Email includes: event name, date/time, venue name + address, ticket tier(s) + quantity, total paid, QR code image (embedded), "Ver mis boletos" CTA button.
- [ ] **AC3:** Email renders correctly on mobile (Gmail app, Apple Mail) — tested with Emailpreviews or Litmus.
- [ ] **AC4:** "Add to calendar" link (Google Calendar / Apple Calendar) for the event date is included.
- [ ] **AC5:** Sender is "Boletify <noreply@boletify.com>" (or configurable `RESEND_FROM_EMAIL`).
- [ ] **AC6:** The email is sent in Spanish (es-MX) at MVP launch.
- [ ] **AC7:** QR code image is embedded in the email (use Resend's built-in image embedding or CID reference).

---

## Figma Link

[Placeholder — Phase 3 Appendix B § E-01]

---

## Technical Notes

### React Email Template

```tsx
// packages/email/src/order-confirmation.tsx
import { Body, Button, Container, Head, Hr, Html, Img, Preview, Section, Text } from '@react-email/components';

export function OrderConfirmationEmail({ order, event, tickets }) {
  return (
    <Html lang="es">
      <Head>
        <title>Confirmación de tu compra — {event.title}</title>
        <Preview>Tu boleto para {event.title} está confirmado.</Preview>
      </Head>
      <Body style={main}>
        <Container style={container}>
          {/* Boletify logo */}
          <Img src={`${BASE_URL}/logo.png`} width="120" alt="Boletify" />
          <Text style={heading}>¡Listo, {order.buyerName}!</Text>
          <Text style={text}>Tu compra está confirmada. Aquí están tus boletos:</Text>
          {/* Event details */}
          <Section style={eventCard}>
            <Text style={eventTitle}>{event.title}</Text>
            <Text style={text}>{formatDate(event.date)} — {event.startTime}</Text>
            <Text style={text}>{event.venueName}</Text>
          </Section>
          {/* QR codes */}
          {tickets.map(ticket => (
            <Section key={ticket.id} style={ticketSection}>
              <Text style={tierName}>{ticket.tierName}</Text>
              <Img src={`cid:${ticket.qrCid}`} width="200" />
              <Text style={hint}>Muestra este código QR en la puerta</Text>
            </Section>
          ))}
          {/* CTA */}
          <Button href={`${BASE_URL}/my-tickets`} style={button}>
            Ver mis boletos
          </Button>
          <Hr style={hr} />
          <Text style={footer}>¿Preguntas? Escríbenos a soporte@boletify.com</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

### Sending via Resend

```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Boletify <noreply@boletify.com>',
  to: order.email,
  subject: `¡Listo! Tu boleto para ${event.title} está confirmado`,
  react: OrderConfirmationEmail({ order, event, tickets }),
});
```

### QR Embedding

Attach QR images with Content-ID (CID) references so they appear inline in email clients that support it (Apple Mail, Outlook desktop). Fallback: public URL for webmail clients.

### Packages Touched
- [ ] `packages/email` — new `order-confirmation.tsx` template
- [ ] `apps/web` — webhook handler triggers email send on `payment_intent.succeeded`
- [ ] `@boletify/api` — `sendOrderConfirmation` service function
- Resend: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`

---

## Dependencies

- PAY-002 (webhooks) — email is triggered from webhook handler
- TKT-002 (QR generation) — QR images must exist before email can embed them

---

## Notes

- The confirmation email is the #1 trust signal for buyers. It must look polished and branded.
- Test with Litmus or Emailpreviews.dev across Gmail, Apple Mail, Outlook, Yahoo before launch.
- QR codes embedded in emails may not scan reliably in all email apps (some block external images). Always include a "View My Tickets" link as a fallback for buyers who can't load the QR.
- Subject line: "¡Listo! Tu boleto para [EVENT NAME] está confirmado" — action-oriented, includes event name for quick scanning.
- Consider adding an "Add to Calendar" button: generates `.ics` file or Google Calendar URL.
