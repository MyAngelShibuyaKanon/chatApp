import type { z } from "@hono/zod-openapi";

import { users } from "@/db/schema/auth";

import type { sessionSelectSchema, userSelectSchema } from "./auth.schema";

export interface SessionWithToken extends Session {
  token: string;
}

export interface Session {
  id: string;
  userId: string;
  secretHash: Uint8Array; // Uint8Array is a byte array
  createdAt: Date;
  lastVerifiedAt: Date;
}

export type User = z.infer<typeof userSelectSchema>;
export type session = z.infer<typeof sessionSelectSchema>;
