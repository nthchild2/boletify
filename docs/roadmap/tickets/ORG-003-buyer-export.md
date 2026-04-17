# ORG-003: Buyer Export (CSV)

**Epic:** Organiser Dashboard
**Ticket ID:** ORG-003
**Type:** feature
**Status:** TODO

---

## Description

Allow organizers to download a CSV of all buyer data for an event: name, email, tier, purchase date, check-in status. This is a core value proposition of Boletify — organisers own their audience data.

Phase 2 refs: O9 (buyer data export), Phase 2 § 7.6 (organiser data ownership), Phase 1 § 5 (data portability as differentiator vs. Boletia).

---

## Acceptance Criteria

- [ ] **AC1:** In the event detail view, a "Exportar asistentes" button generates and downloads a CSV file.
- [ ] **AC2:** CSV columns: Nombre, Email, Tipo de boleto, Cantidad, Fecha de compra, Método de pago, Check-in.
- [ ] **AC3:** Server-side: only the organiser who owns the event can export the data. Unauthorized attempts return 403.
- [ ] **AC4:** CSV generation is streamed (for large events with 1000+ attendees) to avoid memory issues.
- [ ] **AC5:** Export is available for both upcoming and past events.
- [ ] **AC6:** Check-in status shows "✓ Check-in" or "✗ No check-in" per row.

---

## Figma Link

[Placeholder]

---

## Technical Notes

### API Changes
- `packages/api/src/routers/organiser.ts` — `getBuyers` query (exists as stub; add CSV streaming)
- New route: `GET /api/export/[eventId]/buyers.csv` — returns CSV directly

### CSV Streaming

```typescript
// apps/web/app/api/export/[eventId]/buyers/route.ts
export async function GET(req: Request, { params }: { params: { eventId: string } }) {
  const buyers = await db.query.tickets.findMany({
    where: eq(tickets.eventId, params.eventId),
    with: { order: true, tier: true },
  });

  const stream = new ReadableStream({
    start(controller) {
      // CSV header
      controller.enqueue('Nombre,Email,Tipo de boleto,Cantidad,Fecha de compra,Método de pago,Check-in\n');
      // Stream rows one by one
      for (const ticket of buyers) {
        const row = `${ticket.holderName},${ticket.holderEmail},${ticket.tier.name},...`;
        controller.enqueue(row);
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="asistentes-${eventId}.csv"`,
    },
  });
}
```

### LFPDPPP Compliance

- Only export data for events the organiser owns (enforced server-side)
- Buyer data is the organiser's own data — no consent required for export
- Do not include payment card details (PCI scope)
- Do not export to third parties from Boletify's side

### Packages Touched
- [ ] `@boletify/api` — `organiserRouter.getBuyers`
- [ ] `apps/web` — CSV streaming route

---

## Dependencies

- EVT-001 (Event creation) — buyers exist after events are sold
- ORG-002 (Sales Dashboard) — same event detail view hosts the export button

---

## Notes

- CSV export must not include raw payment card details (PCI SAQ-A — card data never touches our servers anyway).
- Consider adding a "select columns" option — some organisers may not want all fields.
- For large events (5000+ buyers), streaming is essential. Don't load all rows into memory.
- The export button should be prominent. This is a key differentiator from Boletia (locked ecosystem).
