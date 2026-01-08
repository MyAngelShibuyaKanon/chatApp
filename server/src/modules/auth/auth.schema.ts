import type { z } from "@hono/zod-openapi";

import { createSelectSchema } from "drizzle-zod";

import { users } from "@/db/schema/user";

export const userSelectSchema = createSelectSchema(users).omit({ passwordHash: true });
export type UserSelect = z.infer<typeof userSelectSchema>;
