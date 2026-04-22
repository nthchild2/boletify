# Database (packages/db)

## Quick Reference

### Seed the database
```bash
cd packages/db
npm run seed
```

Requires `DATABASE_URL` env var. From repo root:
```bash
DATABASE_URL="postgresql://..." npm run seed --filter=@boletify/db
```

### Connect to DB locally
```bash
# Option 1: Set env first
export DATABASE_URL="postgresql://neondb_owner:xxxxx@..."

# Option 2: Use .env file in root
# DATABASE_URL is already in .env
```

### Run migrations
```bash
cd packages/db
npx drizzle-kit push
```

---

## Schema

Tables are in `src/schema/index.ts`:

- **users** - User accounts
- **organiser_profiles** - organiser profiles linked to users
- **events** - Event listings
- **ticket_tiers** - Pricing tiers for events
- **orders** - Ticket purchases

---

## Known Issues / Gotchas

### Neon + Drizzle version conflict

The current setup uses:
- `@neondatabase/serverless` for connection
- `drizzle-orm` for queries

When raw parameterized queries fail with `"use sql\`...\` not sql(...)"`:
- Use tagged template literals: `` sql`SELECT * FROM events` ``
- Do NOT use: `sql('SELECT * FROM events', [])`

### genre_tags column

PostgreSQL array column stores as string like `{tag1,tag2}`. 
When reading from DB, parse it:
```typescript
let tags = e.genre_tags;
if (typeof tags === 'string') {
  tags = tags.replace(/[{}"]/g, '').split(',').filter(Boolean);
}
```

### cover_image_url

Can be NULL. Handle in code:
```typescript
cover_image_url: e.cover_image_url || null
```

---

## Seed Script

Edit `seed.ts` to add/modify events. Key patterns that work:

```typescript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);

async function seed() {
  // Get organiser ID first
  const orgs = await sql`SELECT id FROM organiser_profiles LIMIT 1`;
  const orgId = orgs[0].id;

  // Delete existing
  await sql`DELETE FROM events`;

  // Insert with ARRAY syntax for arrays
  await sql`
    INSERT INTO events (organiser_id, title, slug, description, venue_name, city, genre_tags, status, start_date, published_at, cover_image_url)
    VALUES (${orgId}, ${title}, ${slug}, ${desc}, ${venue}, ${city}, ARRAY['tag1','tag2'], 'published', NOW() + INTERVAL '7 days', NOW(), ${imageUrl})
  `;
}
```

---

## Project Structure

```
packages/db/
├── src/
│   ├── client.ts    # DB connection (neon + drizzle)
│   ├── schema/      # Table definitions
│   │   └── index.ts # All schemas
│   └── index.ts     # Exports
├── seed.ts         # Seed script
├── drizzle.config.ts
└── package.json
```

---

## Env Variables

From `.env`:
```
DATABASE_URL=postgresql://neondb_owner:xxx@ep-.../neondb?sslmode=require
DATABASE_URL_UNPOOLED=...  # Without pgbouncer
```

---

## Troubleshooting

**"This function can now be called only as a tagged-template function"**
- Don't use `sql(query, params)` - use `` sql`query ${params}` ``

**"could not determine data type of parameter"**
- Neon can't infer types for arrays/intervals
- Use raw numbers/intervals in template: `NOW() + INTERVAL '7 days'`

**Images not showing**
- Check `genre_tags` parsing in API route
- Ensure `cover_image_url` is returned from API
- Verify URL is valid (test in browser)

**Empty events**
- Check `DATABASE_URL` is set in env
- Restart dev server after changing env