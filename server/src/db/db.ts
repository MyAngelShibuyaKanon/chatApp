import "dotenv/config";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgAsyncDatabase } from "drizzle-orm/pg-core";

import { DrizzleEntityClass } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "@/db/schema/auth";
import env from "@/env";

export const db = drizzle(env.DATABASE_URL!, { schema });
export type DbClient = PgAsyncDatabase<NodePgQueryResultHKT, typeof schema>;
