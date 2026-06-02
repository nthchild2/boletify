/**
 * Seed script — real CDMX music events for June–July 2026.
 *
 * Usage:  node scripts/seed-events.mjs
 *
 * Reads DATABASE_URL from apps/web/.env.local.
 */

import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read DATABASE_URL from apps/web/.env.local
const envPath = resolve(__dirname, "../apps/web/.env.local");
const envContent = readFileSync(envPath, "utf-8");
const match = envContent.match(/^DATABASE_URL=(.+)$/m);
if (!match) throw new Error("DATABASE_URL not found in .env.local");
const DATABASE_URL = match[1].trim();

const sql = neon(DATABASE_URL);

// ─── Events ──────────────────────────────────────────────────────────
const events = [
  {
    title: "Pulp",
    description:
      "El legendario grupo de Britpop regresa a México con su Te Mereces Más Live Tour, presentando material de su nuevo álbum 'More' junto a clásicos como Common People y Disco 2000.",
    venue_name: "Palacio de los Deportes",
    venue_address: "Av. Río Churubusco y Añil s/n, Granjas México, Iztacalco",
    city: "CDMX",
    genre_tags: ["rock", "britpop", "indie"],
    status: "published",
    start_date: "2026-06-02T21:00:00-06:00",
    cover_image_url:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80",
    tiers: [
      { name: "General B", price: 98000, quantity: 3000, sale_start: "2026-02-20", sale_end: "2026-06-02" },
      { name: "Preferente", price: 180000, quantity: 1500, sale_start: "2026-02-20", sale_end: "2026-06-02" },
      { name: "VIP", price: 280000, quantity: 500, sale_start: "2026-02-20", sale_end: "2026-06-02" },
    ],
  },
  {
    title: "Pomme",
    description:
      "La cantautora francesa Pomme llega a CDMX con su pop intimista y poético. Una velada en francés, llena de delicadeza y emoción cruda.",
    venue_name: "Teatro Metropólitan",
    venue_address: "Independencia 90, Centro Histórico",
    city: "CDMX",
    genre_tags: ["pop", "folk", "francés"],
    status: "published",
    start_date: "2026-06-03T21:00:00-06:00",
    cover_image_url:
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",
    tiers: [
      { name: "Balcón E", price: 94250, quantity: 400, sale_start: "2026-03-01", sale_end: "2026-06-03" },
      { name: "Preferente B", price: 174400, quantity: 600, sale_start: "2026-03-01", sale_end: "2026-06-03" },
      { name: "Preferente A", price: 227900, quantity: 300, sale_start: "2026-03-01", sale_end: "2026-06-03" },
    ],
  },
  {
    title: "Metronomy",
    description:
      "Metronomy trae su Live World Tour al Teatro Metropólitan. Synth-pop bailable, luces parpadeantes y una energía que convierte cualquier sala en pista de baile.",
    venue_name: "Teatro Metropólitan",
    venue_address: "Independencia 90, Centro Histórico",
    city: "CDMX",
    genre_tags: ["electrónica", "synth-pop", "indie"],
    status: "published",
    start_date: "2026-06-04T21:00:00-06:00",
    cover_image_url:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    tiers: [
      { name: "Balcón C", price: 159950, quantity: 400, sale_start: "2026-03-20", sale_end: "2026-06-04" },
      { name: "Preferente B", price: 202725, quantity: 600, sale_start: "2026-03-20", sale_end: "2026-06-04" },
      { name: "Preferente A", price: 279000, quantity: 300, sale_start: "2026-03-20", sale_end: "2026-06-04" },
    ],
  },
  {
    title: "Metronomy · Noche 2",
    description:
      "Segunda fecha de Metronomy en CDMX debido a la alta demanda. Misma energía, mismo venue, último chance de verlos.",
    venue_name: "Teatro Metropólitan",
    venue_address: "Independencia 90, Centro Histórico",
    city: "CDMX",
    genre_tags: ["electrónica", "synth-pop", "indie"],
    status: "published",
    start_date: "2026-06-05T21:00:00-06:00",
    cover_image_url:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
    tiers: [
      { name: "Balcón C", price: 159950, quantity: 400, sale_start: "2026-03-20", sale_end: "2026-06-05" },
      { name: "Preferente B", price: 202725, quantity: 600, sale_start: "2026-03-20", sale_end: "2026-06-05" },
      { name: "Preferente A", price: 279000, quantity: 300, sale_start: "2026-03-20", sale_end: "2026-06-05" },
    ],
  },
  {
    title: "HONNE",
    description:
      "El dúo londinense HONNE llega con su R&B electrónico y sus melodías nocturnas. Invitada especial: BEKA. Una noche para dejarse llevar.",
    venue_name: "Teatro Metropólitan",
    venue_address: "Independencia 90, Centro Histórico",
    city: "CDMX",
    genre_tags: ["electrónica", "r&b", "indie"],
    status: "published",
    start_date: "2026-06-08T21:00:00-06:00",
    cover_image_url:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    tiers: [
      { name: "Balcón E", price: 94250, quantity: 300, sale_start: "2026-03-25", sale_end: "2026-06-08" },
      { name: "Preferente B", price: 151275, quantity: 500, sale_start: "2026-03-25", sale_end: "2026-06-08" },
      { name: "Preferente A", price: 197150, quantity: 400, sale_start: "2026-03-25", sale_end: "2026-06-08" },
    ],
  },
  {
    title: "Julieta Venegas · Norteña Tour",
    description:
      "Julieta Venegas cierra su aclamada gira Norteña en el Auditorio Nacional. Acordeón, corazón y las canciones que definieron una generación.",
    venue_name: "Auditorio Nacional",
    venue_address: "Paseo de la Reforma 50, Polanco",
    city: "CDMX",
    genre_tags: ["pop", "latin", "folk"],
    status: "published",
    start_date: "2026-06-17T20:30:00-06:00",
    cover_image_url:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    tiers: [
      { name: "Segundo Piso D", price: 68200, quantity: 800, sale_start: "2026-01-20", sale_end: "2026-06-17" },
      { name: "Luneta B", price: 210800, quantity: 1000, sale_start: "2026-01-20", sale_end: "2026-06-17" },
      { name: "Preferente A", price: 401760, quantity: 600, sale_start: "2026-01-20", sale_end: "2026-06-17" },
    ],
  },
  {
    title: "Jesse & Joy · El Despecho Tour",
    description:
      "Jesse & Joy regresan al Auditorio Nacional con su Despecho Tour: sus mejores canciones, temas del nuevo documental de HBO 'Lo que nunca dijimos', y pura energía positiva.",
    venue_name: "Auditorio Nacional",
    venue_address: "Paseo de la Reforma 50, Polanco",
    city: "CDMX",
    genre_tags: ["pop", "latin"],
    status: "published",
    start_date: "2026-06-19T20:30:00-06:00",
    cover_image_url:
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80",
    tiers: [
      { name: "Segundo Piso", price: 85000, quantity: 900, sale_start: "2026-02-01", sale_end: "2026-06-19" },
      { name: "Luneta", price: 195000, quantity: 1200, sale_start: "2026-02-01", sale_end: "2026-06-19" },
      { name: "Preferente", price: 350000, quantity: 500, sale_start: "2026-02-01", sale_end: "2026-06-19" },
    ],
  },
  {
    title: "ZAYN · The Konnakol Tour",
    description:
      "ZAYN llega por primera vez al Estadio GNP Seguros con The Konnakol Tour. Pop, R&B y una de las voces más reconocibles del planeta en un show masivo.",
    venue_name: "Estadio GNP Seguros",
    venue_address: "Av. Vasco de Quiroga 3000, Santa Fe",
    city: "CDMX",
    genre_tags: ["pop", "r&b"],
    status: "published",
    start_date: "2026-06-20T21:00:00-06:00",
    cover_image_url:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80",
    tiers: [
      { name: "Naranja", price: 84325, quantity: 5000, sale_start: "2026-02-13", sale_end: "2026-06-20" },
      { name: "General B", price: 399700, quantity: 3000, sale_start: "2026-02-13", sale_end: "2026-06-20" },
      { name: "Azul", price: 534300, quantity: 2000, sale_start: "2026-02-13", sale_end: "2026-06-20" },
    ],
  },
  {
    title: "Gloria Trevi · Celebration",
    description:
      "Gloria Trevi celebra su carrera con un show espectacular en el Auditorio Nacional. Hits, coreografías y la energía inagotable de La Trevi.",
    venue_name: "Auditorio Nacional",
    venue_address: "Paseo de la Reforma 50, Polanco",
    city: "CDMX",
    genre_tags: ["pop", "latin"],
    status: "published",
    start_date: "2026-06-20T20:00:00-06:00",
    cover_image_url:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80",
    tiers: [
      { name: "Segundo Piso", price: 75000, quantity: 800, sale_start: "2026-02-15", sale_end: "2026-06-20" },
      { name: "Luneta", price: 180000, quantity: 1000, sale_start: "2026-02-15", sale_end: "2026-06-20" },
      { name: "Preferente", price: 380000, quantity: 500, sale_start: "2026-02-15", sale_end: "2026-06-20" },
    ],
  },
  {
    title: "Los Tigres del Norte",
    description:
      "Los Jefes de Jefes llegan al Estadio GNP Seguros para una noche de norteñas, corridos y la historia viva de la música mexicana.",
    venue_name: "Estadio GNP Seguros",
    venue_address: "Av. Vasco de Quiroga 3000, Santa Fe",
    city: "CDMX",
    genre_tags: ["regional", "norteño", "corridos"],
    status: "published",
    start_date: "2026-06-27T20:00:00-06:00",
    cover_image_url:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80",
    tiers: [
      { name: "Naranja", price: 75000, quantity: 6000, sale_start: "2026-03-01", sale_end: "2026-06-27" },
      { name: "General A", price: 250000, quantity: 4000, sale_start: "2026-03-01", sale_end: "2026-06-27" },
      { name: "VIP", price: 450000, quantity: 1500, sale_start: "2026-03-01", sale_end: "2026-06-27" },
    ],
  },
  {
    title: "Rüfüs Du Sol · Inhale / Exhale",
    description:
      "El trío australiano de electrónica melódica aterriza en el Estadio GNP Seguros. Invitados especiales: Maribou State y Peces Raros. Una experiencia audiovisual inmersiva bajo las estrellas.",
    venue_name: "Estadio GNP Seguros",
    venue_address: "Av. Vasco de Quiroga 3000, Santa Fe",
    city: "CDMX",
    genre_tags: ["electrónica", "house", "live"],
    status: "published",
    start_date: "2026-07-04T21:00:00-06:00",
    cover_image_url:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    tiers: [
      { name: "Naranja C", price: 98000, quantity: 4000, sale_start: "2026-02-24", sale_end: "2026-07-04" },
      { name: "Verde B", price: 209600, quantity: 2500, sale_start: "2026-02-24", sale_end: "2026-07-04" },
      { name: "GNP", price: 271600, quantity: 1500, sale_start: "2026-02-24", sale_end: "2026-07-04" },
    ],
  },
  {
    title: "México Vibra 2026",
    description:
      "Festival único que reúne a Los Ángeles Azules, Alejandro Fernández, Carla Morrison, Carlos Rivera, Banda El Recodo, Emmanuel, Timbiriche y Mijares, acompañados de la Orquesta Sinfónica de Minería. Celebración de la música mexicana de 1930 a hoy, en el contexto del Mundial 2026.",
    venue_name: "Auditorio Nacional",
    venue_address: "Paseo de la Reforma 50, Polanco",
    city: "CDMX",
    genre_tags: ["festival", "latin", "orquesta"],
    status: "published",
    start_date: "2026-06-09T19:00:00-06:00",
    cover_image_url:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
    tiers: [
      { name: "Segundo Piso", price: 120000, quantity: 800, sale_start: "2026-03-01", sale_end: "2026-06-09" },
      { name: "Luneta", price: 350000, quantity: 1000, sale_start: "2026-03-01", sale_end: "2026-06-09" },
      { name: "Preferente", price: 550000, quantity: 500, sale_start: "2026-03-01", sale_end: "2026-06-09" },
    ],
  },
];

// ─── Execute ─────────────────────────────────────────────────────────
async function main() {
  console.log("🗑️  Clearing existing data…");
  await sql`DELETE FROM ticket_tiers`;
  await sql`DELETE FROM events`;

  console.log(`🎵 Inserting ${events.length} events…`);

  for (const ev of events) {
    const [inserted] = await sql`
      INSERT INTO events (
        title, description, venue_name, venue_address, city,
        genre_tags, status, start_date, cover_image_url
      ) VALUES (
        ${ev.title},
        ${ev.description},
        ${ev.venue_name},
        ${ev.venue_address},
        ${ev.city},
        ${ev.genre_tags},
        ${ev.status},
        ${ev.start_date},
        ${ev.cover_image_url}
      )
      RETURNING id
    `;

    const eventId = inserted.id;
    console.log(`  ✓ ${ev.title} → id ${eventId}`);

    for (const tier of ev.tiers) {
      await sql`
        INSERT INTO ticket_tiers (
          event_id, name, price, quantity, sold,
          sale_start_date, sale_end_date
        ) VALUES (
          ${eventId},
          ${tier.name},
          ${tier.price},
          ${tier.quantity},
          0,
          ${tier.sale_start},
          ${tier.sale_end}
        )
      `;
    }
  }

  console.log(`\n✅ Done — ${events.length} events with ticket tiers seeded.`);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
