import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  
  const events = await sql`
    SELECT id, title, description, venue_name, venue_address, city, genre_tags, status, start_date, cover_image_url
    FROM events 
    WHERE status = 'published' 
    ORDER BY start_date DESC
  `;
  
  const fixed = events.map((e: any) => {
    let tags: string[] = [];
    try {
      // PostgreSQL array as string: {tag1,tag2} or {"tag1","tag2"}
      const raw = String(e.genre_tags || '{}');
      if (raw && raw !== '{}') {
        tags = raw.replace(/[{}"]/g, '').split(',').filter(Boolean);
      }
    } catch (err) {
      console.log("Parse error:", err);
    }
    return { 
      ...e, 
      genre_tags: tags,
      // Explicitly handle undefined cover_image_url
      cover_image_url: e.cover_image_url || null
    };
  });
  
  return NextResponse.json(fixed);
}