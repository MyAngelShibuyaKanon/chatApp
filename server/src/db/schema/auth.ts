import { bytea, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("uuid").primaryKey().defaultRandom(),
  username: varchar("username").unique().notNull(),
  passwordHash: varchar("password_hash", {
    length: 255,
  }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 32 }).primaryKey().unique(),
  user_id: uuid("user_id").references(() => users.id).notNull(),
  secretHash: bytea("secret_hash").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).notNull(),
  lastVerifiedAt: timestamp("last_verified_at", {
    withTimezone: true,
  }).notNull(),
});
