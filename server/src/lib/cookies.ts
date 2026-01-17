import type { Context } from "hono";

import env from "@/env";

export function setSessionTokenCookie(c: Context, token: string): void {
  c.header(
    "Set-Cookie",
    `session=${token}; HttpOnly; SameSite=Lax; Path=/; ${env.ENVIRONMENT === "production" ? "Secure;" : ""}`,
  );
  c.header("Set-Auth-Token", token);
}

export function deleteSessionTokenCookie(c: Context): void {
  c.header(
    "Set-Cookie",
    `session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0; ${env.ENVIRONMENT === "production" ? "Secure;" : ""}`,
  );
  c.header("Set-Auth-Token", "");
}
