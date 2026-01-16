import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { sessions } from "@/db/schema/auth";

import type { Session } from "./auth.types";

export class AuthRepository {
  async createSession(session: Session) {
    return db.insert(sessions).values(session).returning();
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    return db.delete(sessions).where(eq(sessions.id, sessionId)).returning() != null;
  }

  async getSession(sessionId: string) {
    return await db.select().from(sessions).where(eq(sessions.id, sessionId));
  }
}
