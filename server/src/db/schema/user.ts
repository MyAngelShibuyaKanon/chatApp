import { boolean, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "user",
  "admin",
]);

export const users = pgTable("users", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),
  password: text("password")
    .notNull(),

  name: text("name").unique().notNull(),

  isActive: boolean("is_active")
    .notNull()
    .default(true),
  role: userRoleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
