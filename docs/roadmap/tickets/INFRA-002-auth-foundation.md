# TICKET: Auth Foundation Package

**Epic:** Infrastructure
**Ticket ID:** INFRA-002
**Type:** feature
**Status:** TODO

**Dependencies:** INFRA-001 (Database Setup)

---

## Description

Create the `@boletify/auth` package with Auth.js v5 configuration, password hashing utilities, and session management. This package provides the foundation for authentication across both web and native platforms.

---

## Acceptance Criteria

- [ ] **AC1:** `@boletify/auth` package created
- [ ] **AC2:** Auth.js v5 configured with database adapter (Drizzle)
- [ ] **AC3:** Email/password authentication implemented
- [ ] **AC4:** Google OAuth provider configured
- [ ] **AC5:** Web sessions use cookies (Auth.js default)
- [ ] **AC6:** Mobile sessions use Bearer tokens with SecureStore
- [ ] **AC7:** Password hashing with bcrypt (cost 12)
- [ ] **AC8:** Role-based access control (buyer, organiser, admin)

---

## Technical Notes

### Auth.js Providers

- **Email/Password:** Credentials provider with bcrypt verification
- **Google OAuth:** OAuth provider for social login

### Session Strategy

- **Web:** HTTP-only cookies (secure, httpOnly, sameSite: lax)
- **Mobile:** Bearer token in Authorization header, stored in SecureStore

### User Roles

```typescript
enum UserRole {
  BUYER = 'buyer',
  ORGANISER = 'organiser',
  ADMIN = 'admin'
}
```

### Package Structure

```
packages/auth/
├── src/
│   ├── index.ts          # Main exports
│   ├── auth.ts           # Auth.js configuration
│   ├── adapters/         # Drizzle adapter
│   ├── providers/        # Custom providers
│   └── utils/            # Password utilities
└── package.json
```

---

## Related

- Epic: [00-Epic-INFRA.md](../00-Epic-INFRA.md)
- Tech Doc: [04-technical-architecture.md](../04-technical-architecture.md) § 7.1
- Auth.js: https://authjs.dev