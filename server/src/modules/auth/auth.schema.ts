import { z } from "@hono/zod-openapi";
import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-zod";

import { users } from "@/db/schema/user";

export const selectUserSchema = z.strictObject(createSelectSchema(users).omit({ password: true }).shape).openapi("User");
export type SelectUser = z.infer<typeof selectUserSchema>;
export const selectUserArraySchema = z.array(selectUserSchema);
export type SelectUserArray = z.infer<typeof selectUserArraySchema>;

export const insertUserSchema = createInsertSchema(users, {
  name: field => field.min(1).max(32),
}).omit({
  id: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  role: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
