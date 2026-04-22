# TICKET: Featured Event Slider (Web Home)

**Epic:** Events
**Ticket ID:** EVT-004
**Type:** feature
**Status:** TODO

---

## Description

Transform the single featured event on the web home screen into a horizontal slider that allows users to swipe through multiple featured events. This enables curators to showcase a carousel of curated/promoted events rather than a single static hero.

Phase 2 refs: S2 (home discovery feed), S3 (search + genre filters).

---

## Acceptance Criteria

- [ ] **AC1:** Home screen displays a horizontally swipeable slider of featured events (minimum 2, max 10)
- [ ] **AC2:** Slider supports touch swipe, mouse drag, and arrow key navigation
- [ ] **AC3:** Active slide indicator shows current position (dots or fraction)
- [ ] **AC4:** Auto-advance to next slide after 5 seconds of inactivity (configurable)
- [ ] **AC5:** Clicking a featured event navigates to the event detail page
- [ ] **AC6:** Slider is responsive and works on mobile viewports (single slide visible)
- [ ] **AC7:** Empty state shows a fallback promoted event if fewer than 2 featured events exist

---

## Figma Link

[Placeholder — link to Figma designs when available]

---

## Technical Notes

### API Changes
- [ ] tRPC procedure: `events.getFeatured` returns array instead of single event
- [ ] Add `featuredRank` field to Event for ordering in slider

### Database Changes
- [ ] Migration: Add `featuredRank` column to `events` table (nullable int, 1-based)

### Environment Variables
- [ ] None required

### External Services
- [ ] None

### Packages Touched
- [ ] `@boletify/api`
- [ ] `@boletify/db`
- [ ] `@boletify/screens` — WebHomeScreen
- [ ] `apps/web`

---

## Dependencies

| Ticket ID | Reason |
|-----------|--------|
| EVT-001 | Event Creation — events must exist before featuring |
| EVT-003 | Event Publish — only published events can be featured |

---

## Notes

- Featured events are curated by admins or scored algorithmically (ticket sales velocity, recency)
- Slider animation should be smooth (use CSS transforms, `will-change`)
- Consider reduced motion accessibility preference