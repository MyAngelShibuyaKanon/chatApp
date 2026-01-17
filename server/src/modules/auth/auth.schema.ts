import { z } from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { sessions, users } from "@/db/schema/auth";

export const sessionSelectSchema = createSelectSchema(sessions).omit({ secretHash: true });

export const sessionQuerySchema = sessionSelectSchema.omit({ createdAt: true, lastVerifiedAt: true });
export const authResponseHeaders = z.object({
  "Set-Cookie": z.string().openapi({
    description: "Session cookie for web clients (httpOnly, secure, sameSite=Lax)",
    example: "session=abc123...; HttpOnly; Secure; SameSite=Lax; Path=/; Expires=...",
  }),
  "Set-Auth-Token": z.string().openapi({
    description: "Session token for mobile/desktop clients (use in Authorization: Bearer header)",
    example: "abc123def456...",
  }),
});

export const userSelectSchema = createSelectSchema(users).omit({ passwordHash: true });
export const userRegisterSchema = z.object({
  username: z.string(),
  password: z.string(),
});
