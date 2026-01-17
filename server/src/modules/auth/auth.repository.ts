import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { eq } from "drizzle-orm";
import { Buffer } from "node:buffer";

import type { DbClient } from "@/db/db";

import { sessions, users } from "@/db/schema/auth";

import type { Session } from "./auth.types";

export class AuthRepository {
  constructor(private db: DbClient) { }
  async createSession(session: Session) {
    return this.db.insert(sessions).values({
      id: session.id,
      user_id: session.userId,
      secretHash: Buffer.from(session.secretHash),
      createdAt: session.createdAt,
      lastVerifiedAt: session.lastVerifiedAt,
    }).returning();
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    const deleted = await this.db.delete(sessions).where(eq(sessions.id, sessionId)).returning();
    return deleted.length === 1;
  }

  async getSession(sessionId: string) {
    return await this.db.select().from(sessions).where(eq(sessions.id, sessionId));
  }

  async updateSessionLastVerifiedAt(sessionId: string, lastVerifiedAt: Date) {
    return await this.db.update(sessions).set({ lastVerifiedAt }).where(eq(sessions.id, sessionId)).returning();
  }

  async getUserFromId(userId: string) {
    return await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
  }

  async getUserFromUsername(username: string) {
    return await this.db.select().from(users).where(eq(users.username, username)).limit(1);
  }

  async createUser(username: string, passwordHash: string) {
    return await this.db.insert(users).values({
      username,
      passwordHash,
    }).returning();
  }
}
