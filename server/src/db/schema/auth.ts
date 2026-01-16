import { customType, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

const bytearray = customType<{
  data: Uint8Array;
  default: false;
}>({
  dataType() {
    return "bytea";
  },
});

export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 32 }).primaryKey().unique(),
  secretHash: bytearray("secret_hash").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).notNull(),
});

export const users = pgTable("users", {
});
