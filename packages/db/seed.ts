import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function seed() {
  const orgs = await sql`SELECT id FROM organiser_profiles LIMIT 1`;
  const orgId = orgs[0].id;
  
  await sql`DELETE FROM events`;

  const events = [
    { title: "Noche Cruda", slug: "noche-cruda", desc: "Indie rock night", venue: "Foro Indie", tags: ["indie","rock"], img: "https://plus.unsplash.com/premium_photo-1661284892176-fd7713b764a6?q=80&w=2340&auto=format&fit=crop" },
    { title: "Sonido del Valle", slug: "sonido-del-valle", desc: "Cumbia sonidera", venue: "Salon LA", tags: ["cumbia","tropical"], img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2340&auto=format&fit=crop" },
    { title: "Cenote Club", slug: "cenote-club", desc: "Electronic music", venue: "Terraza", tags: ["electrónica","house"], img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2340&auto=format&fit=crop" },
    { title: "Jazz en el Corazón", slug: "jazz-en-el-corazon", desc: "Live jazz night", venue: "Club Jazz", tags: ["jazz","acoustic"], img: "https://plus.unsplash.com/premium_photo-1661286678499-211423a9ff5e?q=80&w=987&auto=format&fit=crop" },
    { title: "Techno Bunker", slug: "techno-bunker", desc: "Techno beats", venue: "Warehouse", tags: ["techno","industrial"], img: "https://images.unsplash.com/photo-1565035010268-a3816f98589a?q=80&w=988&auto=format&fit=crop" },
    { title: "Salsa y Más", slug: "salsa-y-mas", desc: "Salsa dancing", venue: "El Tropical", tags: ["salsa","bachata"], img: "https://images.unsplash.com/photo-1590721791974-d6c8ca43f6bc?q=80&w=987&auto=format&fit=crop" },
    { title: "Rock Underground", slug: "rock-underground", desc: "Underground rock", venue: "Cafe", tags: ["rock","punk"], img: "https://images.unsplash.com/photo-1576967402682-19976eb930f2?q=80&w=1035&auto=format&fit=crop" },
    { title: "Ambient Dreams", slug: "ambient-dreams", desc: "Chillout vibes", venue: "Terraza Luna", tags: ["ambient","chillout"], img: "https://images.unsplash.com/photo-1503853585905-d53f628e46ac?q=80&w=986&auto=format&fit=crop" },
    { title: "Reggaetón Fire", slug: "reggaeton-fire", desc: "Reggaeton hits", venue: "Club 58", tags: ["reggaetón","urban"], img: "https://plus.unsplash.com/premium_photo-1661284892176-fd7713b764a6?q=80&w=2340&auto=format&fit=crop" },
    { title: "Folk Revival", slug: "folk-revival", desc: "Folk music", venue: "Casa Folk", tags: ["folk","mexicana"], img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2340&auto=format&fit=crop" },
    { title: "Metal Mayhem", slug: "metal-mayhem", desc: "Heavy metal", venue: "El Metal", tags: ["metal","heavy"], img: "https://images.unsplash.com/photo-1565035010268-a3816f98589a?q=80&w=988&auto=format&fit=crop" },
    { title: "Pop Hits Night", slug: "pop-hits-night", desc: "Pop music", venue: "Plaza Pop", tags: ["pop","mainstream"], img: "https://images.unsplash.com/photo-1503853585905-d53f628e46ac?q=80&w=986&auto=format&fit=crop" },
  ];

  for (const e of events) {
    const tagsStr = e.tags.join(",");
    await sql`
      INSERT INTO events (organiser_id, title, slug, description, venue_name, venue_address, city, genre_tags, status, start_date, published_at, cover_image_url)
      VALUES (${orgId}, ${e.title}, ${e.slug}, ${e.desc}, ${e.venue}, ${e.venue}, 'CDMX', ARRAY[${e.tags.map(t => `'${t}'`).join(",")}], 'published', NOW() + INTERVAL '7 days', NOW(), ${e.img})
    `;
  }
  console.log("Seeded", events.length, "events");
}

seed().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });