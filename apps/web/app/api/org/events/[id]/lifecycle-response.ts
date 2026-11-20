import { NextResponse } from "next/server";
import type { EventLifecycleError } from "@boletify/api/event-lifecycle";

const STATUS = { NOT_FOUND: 404, CONFLICT: 409, BAD_REQUEST: 400 } as const;

/** JSON error for the REST event routes, with the user-facing Spanish message. */
export function lifecycleErrorResponse(err: EventLifecycleError) {
  return NextResponse.json(
    { error: err.message },
    { status: STATUS[err.code] },
  );
}
