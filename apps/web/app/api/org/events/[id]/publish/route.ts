/**
 * POST /api/org/events/:id/publish — publish a draft event
 * (rules in packages/api/src/lib/event-lifecycle.ts)
 */

import { NextResponse } from "next/server";
import {
  EventLifecycleError,
  publishEvent,
} from "@boletify/api/event-lifecycle";
import { requireOrganiser } from "../../../auth-helper";
import { lifecycleErrorResponse } from "../lifecycle-response";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: RouteContext) {
  const result = await requireOrganiser(request);
  if (result instanceof NextResponse) return result;

  const eventId = parseInt((await ctx.params).id, 10);
  if (isNaN(eventId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }
  try {
    return NextResponse.json(await publishEvent(result.organiserId, eventId));
  } catch (err) {
    if (err instanceof EventLifecycleError) return lifecycleErrorResponse(err);
    throw err;
  }
}
