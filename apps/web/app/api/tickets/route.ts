/**
 * GET /api/tickets  (Authorization: Bearer <token>)
 * The signed-in user's paid orders and tickets, for the native app.
 * Orders are matched by the account's email, so purchases made as a guest
 * show up once the buyer signs up with the same address.
 */

import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, users } from '@boletify/db';
import { formatEventDate, isPastEvent, listOrdersForEmail } from '@boletify/api/tickets';
import { verifyToken } from '../auth/token';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const header = request.headers.get('authorization');
  const payload = header?.startsWith('Bearer ') ? verifyToken(header.slice(7)) : null;
  if (!payload) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const [user] = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, payload.sub))
    .limit(1);
  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  const orders = await listOrdersForEmail(user.email);
  return NextResponse.json({
    orders: orders.map((order) => ({
      orderNumber: order.orderNumber,
      total: order.total,
      past: isPastEvent(order.event.startDate),
      event: {
        id: order.event.id,
        title: order.event.title,
        venueName: order.event.venueName,
        city: order.event.city,
        startDate: order.event.startDate.toISOString(),
        dateLabel: formatEventDate(order.event.startDate),
        coverImageUrl: order.event.coverImageUrl,
      },
      tickets: order.tickets.map((ticket) => ({
        ticketNumber: ticket.ticketNumber,
        tierName: ticket.tierName,
        status: ticket.status,
        qrImageUrl: ticket.qrImageUrl,
      })),
    })),
  });
}
