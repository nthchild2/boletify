/**
 * The signed-in user for an API request: the native app's Bearer token if
 * present, otherwise the web session cookie (Auth.js).
 */

import { auth } from "./auth";
import { verifyToken } from "../app/api/auth/token";

export async function getRequestUserId(
  request: Request,
): Promise<number | null> {
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    return verifyToken(header.slice(7))?.sub ?? null;
  }
  try {
    const session = await auth();
    const id = Number(session?.user?.id);
    return Number.isInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}
