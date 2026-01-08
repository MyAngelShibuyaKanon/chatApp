import { z } from "@hono/zod-openapi";
import { createSelectSchema } from "drizzle-zod";

import { users } from "@/db/schema/user";

export const selectUserSchema = z.strictObject(createSelectSchema(users).omit({ passwordHash: true }).shape);

export const selectUserArraySchema = z.array(selectUserSchema);
export type SelectUserArray = z.infer<typeof selectUserArraySchema>;
