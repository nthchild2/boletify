/**
 * GET /api/org/export/buyers?eventId=92   → CSV of one event's buyers
 * GET /api/org/export/buyers              → CSV across all the organiser's events
 *
 * One row per sold ticket (ORG-003). Organiser-only (web session or Bearer
 * token); only the organiser's own events are ever included.
 */

import { NextResponse } from "next/server";
import { toCsv } from "@boletify/api/csv";
import { getOrganiserEvent, getOrganiserId } from "@boletify/api/organiser";
import { listBuyers } from "@boletify/api/sales";
import { getRequestUserId } from "../../../../../lib/request-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const METHOD: Record<string, string> = {
  card: "Tarjeta",
  oxxo: "OXXO",
  mercadopago: "Mercado Pago",
};

function mxDateTime(value: Date | null): string {
  if (!value) return "";
  // "2026-11-15 23:49" in Mexico City time; sorts correctly and Excel reads it as a date.
  return value
    .toLocaleString("sv-SE", { timeZone: "America/Mexico_City", hour12: false })
    .slice(0, 16);
}

// Accents left over after NFD normalisation (é -> e + U+0301).
const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

function slugify(text: string): string {
  return (
    text
      .normalize("NFD")
      .replace(COMBINING_MARKS, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40) || "evento"
  );
}

export async function GET(request: Request) {
  const userId = await getRequestUserId(request);
  if (!userId)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const organiserId = await getOrganiserId(userId);
  if (!organiserId)
    return NextResponse.json(
      { error: "No tienes un perfil de organizador" },
      { status: 403 },
    );

  const rawEventId = new URL(request.url).searchParams.get("eventId");
  let eventId: number | undefined;
  let scope = "todos";
  if (rawEventId) {
    eventId = Number(rawEventId);
    const event =
      Number.isInteger(eventId) && eventId > 0
        ? await getOrganiserEvent(organiserId, eventId)
        : null;
    if (!event)
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 },
      );
    scope = slugify(event.title);
  }

  const { rows } = await listBuyers(organiserId, { eventId });
  const csv = toCsv(
    [
      ...(eventId ? [] : ["Evento"]),
      "Nombre",
      "Correo",
      "Tipo de boleto",
      "Boleto",
      "Pedido",
      "Fecha de compra",
      "Método de pago",
      "Check-in",
      "Hora de check-in",
    ],
    rows.map((r) => [
      ...(eventId ? [] : [r.eventTitle]),
      r.attendeeName,
      r.buyerEmail,
      r.tierName,
      r.ticketNumber,
      r.orderNumber,
      mxDateTime(r.purchasedAt),
      METHOD[r.paymentMethod ?? "card"] ?? r.paymentMethod,
      r.checkedIn ? "Sí" : "No",
      mxDateTime(r.checkedInAt),
    ]),
  );

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Mexico_City",
  });
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="boletify-compradores-${scope}-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
