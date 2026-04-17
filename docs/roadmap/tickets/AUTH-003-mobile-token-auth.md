# AUTH-003: Mobile Token Auth (Bearer)

**Epic:** Authentication
**Ticket ID:** AUTH-003
**Type:** feature
**Status:** ⬜ Not Started

---

## Description

Implement Bearer token authentication for the mobile app (Expo / React Native). Mobile cannot use HTTP-only cookies (native apps don't follow cookie semantics), so auth tokens are stored in Expo SecureStorage and sent as Authorization headers on every tRPC request.

Phase 4 refs: § 3.1 (mobile calls same tRPC API), § 7.3 (token-based sessions on mobile).

---

## Acceptance Criteria

- [ ] **AC1:** After login in the mobile app, a session token is received and stored in Expo SecureStorage (not AsyncStorage — SecureStorage is encrypted).
- [ ] **AC2:** All tRPC requests from mobile include `Authorization: Bearer <token>` header.
- [ ] **AC3:** The tRPC context on the server reads the Bearer token from headers and resolves the session (same DB session lookup as web).
- [ ] **AC4:** On 401 response, the mobile app redirects to the login screen.
- [ ] **AC5:** On logout, the token is removed from SecureStorage.
- [ ] **AC6:** Token refresh is handled automatically when a new token is issued (e.g., after session extension).
- [ ] **AC7:** Guard `guards.requireAuth()` in `@boletify/navigation` works on mobile (imported by `apps/mobile/app/(organiser)/_layout.tsx` and buyer protected routes).

---

## Figma Link

[Placeholder]

---

## Technical Notes

### Token Storage

```
Expo SecureStorage
  Key: "boletify_session_token"
  Value: <session_token_string>
  Options: { accessible: EXPO_SECURE_STORE_OPTIONS.ACCESSIBLE.WHEN_UNLOCKED }
```

NOT `AsyncStorage` — that stores in plain text and is not encrypted.

### tRPC Client Setup (Mobile)

```typescript
// apps/mobile/lib/trpc/client.ts
const getAuthHeader = () => {
  const token = SecureStore.getItem('boletify_session_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const trpcClient = createTRPCReact<AppRouter>();
const httpBatchLink = new TRPCHTTPBatchLink({
  url: `${API_URL}/api/trpc`,
  headers: getAuthHeader,
});
```

### Server-Side Token Resolution

- `packages/api/src/trpc.ts` context builder reads `Authorization` header when `x-user-agent: mobile` is set (or always, since web uses cookies and mobile uses headers — they don't conflict).
- Session lookup uses the same DB sessions table as web.
- If token is invalid or expired → `TRPCError(UNAUTHORIZED)`.

### Token Lifecycle

| Event | Action |
|-------|--------|
| Login success | Server issues session token → stored in SecureStorage |
| API request | Token sent in `Authorization` header |
| Token expired | Server returns 401 → redirect to login |
| Logout | Token deleted from SecureStorage |
| App reinstall | Token lost → user must log in again (correct security behavior) |

### Packages Touched
- [ ] `@boletify/auth` — `validateToken()` helper (may be needed server-side)
- [ ] `@boletify/api` — `trpc.ts` context to read Bearer token from headers
- [ ] `apps/mobile` — tRPC client setup, SecureStorage integration, logout action
- [ ] `@boletify/navigation` — `guards` already exist; verify they work with mobile auth context

---

## Dependencies

- AUTH-001 (Login/Register) — token is issued on login
- `@boletify/api` — tRPC context must be updated to handle Bearer tokens

---

## Notes

- Do NOT store tokens in AsyncStorage — it is not encrypted and can be read by any app on the device.
- Expo SecureStorage uses the iOS Keychain and Android Keystore under the hood.
- Consider implementing token refresh if session expiry is short (e.g., < 24h). For MVP, sessions can be long-lived (30 days) — convenience trumps security overhead for a ticketing app.
- The `trpc.ts` context must gracefully handle both cookie auth (web) and Bearer auth (mobile) simultaneously — they are mutually exclusive and will never conflict.
