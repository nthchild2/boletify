# ORG-002: Sales Dashboard Data

**Epic:** Organiser Dashboard
**Ticket ID:** ORG-002
**Type:** feature
**Status:** TODO

---

## Description

Aggregate and surface sales data for organisers: per-event ticket sales, revenue breakdown, sales over time, payment method distribution, and check-in stats. This is the organiser's primary window into their event performance.

Phase 2 refs: O8 (sales dashboard), Phase 4 § 7.6 (dashboard metrics).

---

## Acceptance Criteria

- [ ] **AC1:** Organiser dashboard home shows a list of all events (upcoming, live, past) with summary stats per event: tickets sold / total, gross revenue, net revenue (after fees), status badge.
- [ ] **AC2:** Clicking an event opens the event detail view with: sales over time (line chart by day), revenue by tier (bar chart), payment method distribution (pie chart), check-in count.
- [ ] **AC3:** Real-time polling every 30 seconds keeps stats current during active sales periods.
- [ ] **AC4:** Organiser sees gross sales, service fee deducted, payment processing fee deducted, and net payout amount.
- [ ] **AC5:** Data is scoped to the authenticated organiser's events only (server-side filter via `organiserProcedure`).
- [ ] **AC6:** The dashboard is accessible on both web and mobile via the shared organiser dashboard screen.

---

## Figma Link

[Placeholder]

---

## Technical Notes

### API Changes
- `packages/api/src/routers/organiser.ts` — `getProfile` (exists as stub), `getSales` query

### Dashboard Query

```typescript
// organiserRouter.getDashboard:
const events = await db.query.events.findMany({
  where: eq(events.organiserId, ctx.session.user.id),
  with: {
    ticketTiers: true,
    orders: {
      where: eq(orders.status, 'confirmed'),
    },
  },
});

// Calculate per-event stats:
// - totalSold: sum of ticketTiers.sold
// - totalRevenue: sum of orders.totalAmount
// - serviceFee: totalRevenue * 0.05 + (10 MXN * totalSold)
// - netRevenue: totalRevenue - serviceFee - paymentProcessingFee
```

### Charts (UI)

- Use Recharts (web) / @shopify/react-native-skia (mobile) for charts
- Or: use a shared chart component that renders differently on each platform

### Polling Strategy

```typescript
// useDashboardData hook — polling every 30s
const { data, refetch } = useQuery({
  queryKey: ['organiser-dashboard'],
  queryFn: () => trpc.organiser.getDashboard.query(),
  refetchInterval: 30_000, // 30 seconds
});
```

### Packages Touched
- [ ] `@boletify/api` — `organiserRouter.getProfile`, `getSales`
- [ ] `@boletify/db` — queries against `events`, `orders`, `payments`, `ticketTiers`
- [ ] `@boletify/screens` — `OrganiserDashboardScreen` (shell exists; wire up data)
- [ ] `@boletify/features` — `useOrganiserDashboard` hook
- [ ] `apps/web` — charts (Recharts)
- [ ] `apps/mobile` — charts (@shopify/react-native-skia or Victory Native)

---

## Dependencies

- EVT-001 (Event creation) — events must exist for dashboard to show data
- PAY-001 (Stripe payment) — revenue data comes from confirmed orders

---

## Notes

- The dashboard will look empty until there are events and orders. Show a meaningful empty state: "Crea tu primer evento para ver estadísticas aquí."
- Payment method distribution requires joining `orders` → `payments` → `payment.method` field.
- For the "live" event indicator: an event is "live" if it's currently within its start/end time window.
- Consider adding a "top event" highlight on the dashboard home: the event with the most tickets sold this month.
