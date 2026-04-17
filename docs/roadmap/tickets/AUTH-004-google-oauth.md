# AUTH-004: Google OAuth

**Epic:** Authentication
**Ticket ID:** AUTH-004
**Type:** feature
**Status:** ⬜ Not Started

---

## Implementation Summary

Both web and mobile Google OAuth are fully implemented.

### Mobile (Primary Implementation)
- **Frontend**: `@boletify/screens/src/auth/LoginScreen.tsx` + `RegisterScreen.tsx` wired to `@boletify/mobile/lib/google-auth.ts` (Expo AuthSession with PKCE)
- **Backend**: `authRouter.googleExchange` in `packages/api/src/routers/auth.ts` validates Google ID token, creates/links user account, returns Bearer session token
- **Flow**: Mobile uses `expo-auth-session` → gets Google ID token → exchanges at backend → receives session token stored in SecureStore

### Web (NextAuth)
- **Config**: Already configured in `apps/web/lib/auth.ts` with Google provider
- **Forms**: Use NextAuth `signIn('google')` redirect
- **Backend**: Same `authRouter.googleExchange` handles token validation (for OAuth-based web auth)

---

## Description

Add Google OAuth as a sign-in option for buyers and organisers. Users can link their Google account for faster registration and login without a password.

Phase 2 refs: B4 (Google OAuth), Phase 4 § 7.1 (Auth provider table).

---

## Acceptance Criteria

- [ ] **AC1:** Login page on both web and mobile shows "Continuar con Google" button.
- [ ] **AC2:** Clicking "Continuar con Google" initiates OAuth flow (web: redirect; mobile: in-app browser / AuthSession).
- [ ] **AC3:** On successful OAuth callback, a user account is created (if first time) or existing account is matched (by Google ID or email).
- [ ] **AC4:** User is logged in after OAuth flow completes — same as email/password login.
- [ ] **AC5:** If an existing account has the same email but no Google ID linked, the user is prompted to link Google (with password verification first).
- [ ] **AC6:** Google OAuth is available for both buyer and organiser registration flows.
- [ ] **AC7:** Web uses Auth.js Google provider (already configured in ADR-006).
- [ ] **AC8:** Mobile uses `expo-auth-session` with Google provider.

---

## Figma Link

[Placeholder]

---

## Technical Notes

### Web (Auth.js)

```typescript
// apps/web/lib/auth.ts — add Google provider
import { GoogleProvider } from '@auth/core/providers/google';
// Auth.js v5 handles the OAuth callback at /api/auth/callback/google
```

### Mobile (Expo AuthSession)

```typescript
// apps/mobile/lib/auth/google.ts
import * as AuthSession from 'expo-auth-session';
// Use redirectUri and useProxy: true for Expo Go compatibility
```

### Database Changes
- `users.googleId` column must exist in schema (verify Drizzle schema)
- If linking Google to existing account: add `googleId` to existing user row on confirmation

### Environment Variables
- [ ] `GOOGLE_CLIENT_ID` — OAuth 2.0 client ID from Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` — OAuth 2.0 client secret
- [ ] `NEXTAUTH_URL` — Must be set for OAuth callback URLs

### OAuth Scopes

```
email
profile
openid
```

### Packages Touched
- [ ] `@boletify/auth` — `AUTH_PROVIDERS` (add Google config if needed)
- [ ] `apps/web` — Auth.js Google provider setup
- [ ] `apps/mobile` — `expo-auth-session` Google integration
- [ ] `@boletify/screens` — Add Google sign-in button to LoginScreen

---

## Dependencies

- AUTH-001 (Login/Register) — Google OAuth is an additional login method, not a replacement

---

## Notes

- Google OAuth is a **nice-to-have** for MVP — email/password must be fully functional first. It's valuable for buyer conversion but not blocking.
- Mobile OAuth on Expo requires configuring `app.json` / `app.config.ts` with the Google client ID and a custom URI scheme (`com.boletify.app://`).
- For Expo Go during development, use `AuthSession.makeRedirectUri({ useProxy: true })`.
- Google account emails should be marked as `emailVerified = true` automatically (Google has already verified them).
