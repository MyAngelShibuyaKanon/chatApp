import type { DbClient } from "@/db/db";

import { AuthRepository } from "./auth.repository";

export type AuthRepoFactory = (db: DbClient) => AuthRepository;

export const authRepoFactory: AuthRepoFactory
  = db => new AuthRepository(db);
