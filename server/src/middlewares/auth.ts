// shared/middleware/auth.ts
import type { Context, Next } from "hono";

import { setSessionTokenCookie } from "@/lib/cookies";
import { validateSession } from "@/modules/auth/auth.api";

export async function requireAuth(c: Context, next: Next) {
  // 1. Extract token from cookie or Authorization header
  let sessionToken: string | null = null;

  // Try to get from cookie first
  const cookieHeader = c.req.header("Cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map(c => c.trim());
    const sessionCookie = cookies.find(cookie => cookie.startsWith("session="));
    if (sessionCookie) {
      sessionToken = sessionCookie.split("=")[1];
    }
  }

  // Fall back to Authorization header (for mobile/desktop)
  if (!sessionToken) {
    const authHeader = c.req.header("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      sessionToken = authHeader.replace("Bearer ", "");
    }
  }

  // 2. No token found
  if (!sessionToken) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // 3. Validate session
  const session = await validateSession(sessionToken);

  // 4. Invalid or expired session
  if (!session) {
    return c.json({ error: "Invalid or expired session" }, 401);
  }

  // 5. Refresh cookie if session was extended (sliding sessions)
  // This happens automatically in validateSessionToken when session is close to expiring
  setSessionTokenCookie(c, sessionToken);

  // 6. Set user and session in context for handlers
  c.set("session", session);
  c.set("sessionId", session.id);

  await next();
}
