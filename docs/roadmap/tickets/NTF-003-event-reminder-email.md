# NTF-003: Event Reminder Email

**Epic:** Notifications
**Ticket ID:** NTF-003
**Type:** feature
**Status:** TODO

---

## Description

Send a reminder email to all ticket holders 24 hours before their event starts. The email includes event details, venue directions (with map link), a QR ticket link, and relevant last-minute info from the organiser.

Phase 2 refs: C5 (event reminder email), Phase 3 Appendix B (E-05).

---

## Acceptance Criteria

- [ ] **AC1:** Cron job runs every 15 minutes and sends reminder emails to all ticket holders for events starting in 24±15 minutes.
- [ ] **AC2:** Email includes: event name, date/time, venue name + address + Google Maps link, QR code, "Ver mis boletos" CTA, organiser contact (if provided).
- [ ] **AC3:** Reminder is sent only once per ticket (tracked via a `reminderSentAt` flag on the Ticket record).
- [ ] **AC4:** If the buyer has already checked in, no reminder is sent.
- [ ] **AC5:** Organiser can optionally add a custom message ("¡Nos vemos mañana! — El equipo de [Event]") that is included in the email.

---

## Figma Link

[Placeholder — Phase 3 Appendix B § E-05]

---

## Technical Notes

### Cron Route

```typescript
// apps/web/app/api/cron/event-reminders/route.ts
// Vercel Cron: every 15 minutes
// { "crons": [{ "path": "/api/cron/event-reminders", "schedule": "*/15 * * * *" }] }

export async function GET() {
  const now = new Date();
  const reminderWindow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24h
  const windowStart = new Date(now.getTime() + 23.75 * 60 * 60 * 1000); // +23h45m

  // Find events starting in the next 15 minutes
  const events = await db.query.events.findMany({
    where: and(
      gte(events.date, windowStart.toISOString().split('T')[0]),
      lte(events.date, reminderWindow.toISOString().split('T')[0]),
    ),
    with: {
      tickets: {
        where: and(
          isNull(tickets.reminderSentAt),
          eq(tickets.status, 'active'), // not checked in, not cancelled
        ),
      },
    },
  });

  for (const event of events) {
    for (const ticket of event.tickets) {
      await sendEventReminderEmail(ticket, event);
      await db.update(tickets)
        .set({ reminderSentAt: new Date() })
        .where(eq(tickets.id, ticket.id));
    }
  }

  return Response.json({ sent: total });
}
```

### Reminder Email Content

```typescript
// packages/email/src/event-reminder.tsx
// Key content:
// - "¡Mañana es! {Event Name}"
// - Date, time (with timezone: "Hora de la Ciudad de México")
// - Venue name + address + Google Maps link
// - QR ticket (smaller, as a reminder — not the main event)
// - Organiser custom message (if set)
// - "Ver mis boletos" CTA
```

### Organiser Custom Message

Add a `events.reminderMessage` field (optional, max 500 chars). Organiser enters it in the event edit form. Included in the reminder email.

### Packages Touched
- [ ] `packages/email` — `event-reminder.tsx` template
- [ ] `apps/web` — cron route `/api/cron/event-reminders`
- [ ] `@boletify/db` — `tickets.reminderSentAt` column

---

## Dependencies

- TKT-002 (QR generation) — QR images embedded in reminder email
- EVT-001 (Event creation) — event data needed for email

---

## Notes

- The 15-minute cron window means a buyer could get the reminder anywhere from 23h45m to 24h15m before the event. This is acceptable — the important thing is they get it before the event.
- Track `reminderSentAt` to avoid double-sending. If the cron fires twice within 15 minutes, the second run will find tickets with `reminderSentAt` already set and skip them.
- If the event is tomorrow and the buyer hasn't checked in, they should get this email. The check-in flag is for "already checked in early" — those people don't need a reminder.
- Consider adding a "add to phone" CTA: links to Apple Wallet / Google Wallet pass (NTF-Wallet in v1.1).
