import { hash, verify } from "argon2";
import { error } from "node:console";

import type { DbClient } from "@/db/db";

import { db } from "@/db/db";

import type { Session, SessionWithToken } from "./auth.types";
import type { AuthRepoFactory } from "./user.providers";

import { userSelectSchema } from "./auth.schema";

export class AuthService {
  private sessionExpiresInSeconds = 60 * 60 * 24 * 7; // 7 days

  private inactivityTimeoutSeconds = 60 * 60 * 24 * 7; // 7 days
  private activityCheckIntervalSeconds = 60 * 60; // 1 hour
  constructor(
    private readonly authRepoFactory: AuthRepoFactory,
  ) { }

  generateSecureRandomString(): string {
    // Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
    const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";

    // Generate 24 bytes = 192 bits of entropy.
    // We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);

    let id = "";
    for (let i = 0; i < bytes.length; i++) {
      // >> 3 "removes" the right-most 3 bits of the byte
      id += alphabet[bytes[i] >> 3];
    }
    return id;
  }

  async createUser(username: string, password: string) {
    const passwordHash = await hash(password);
    const result = await db.transaction(async (tx) => {
      const authRepo = this.authRepoFactory(tx);
      const [user] = await authRepo.createUser(username, passwordHash);

      const session = await this.createSessionInTransaction(user.id, tx);

      if (!session) {
        throw error("Empty session");
      }

      const token = session.token;

      return { user, session, token };
    });

    return result;
  }

  async verifyUserLogin(username: string, password: string) {
    const authRepo = this.authRepoFactory(db);
    const [user] = await authRepo.getUserFromUsername(username);
    if (!user) {
      return null;
    }
    const isPasswordValid = await verify(user.passwordHash, password);
    if (!isPasswordValid) {
      return null;
    }

    const session = await this.createSession(user.id);
    if (!session) {
      return null;
    }

    const token = session.token;
    return { user, session, token };
  }

  async getUserFromId(userId: string) {
    const authRepo = this.authRepoFactory(db);
    return await authRepo.getUserFromId(userId);
  }

  async getUserFromUsername(username: string) {
    const authRepo = this.authRepoFactory(db);
    return await authRepo.getUserFromUsername(username);
  }

  async createSession(userId: string): Promise<SessionWithToken | null> {
    const authRepo = this.authRepoFactory(db);
    const now = new Date();

    const id = this.generateSecureRandomString();
    const secret = this.generateSecureRandomString();
    const secretHash = await this.hashSecret(secret);

    const token = `${id}.${secret}`;

    const session: SessionWithToken = {
      id,
      userId,
      secretHash,
      createdAt: now,
      lastVerifiedAt: now,
      token,
    };

    const createdSession = await authRepo.createSession(session);

    if (createdSession.length !== 1) {
      return null;
    }

    return session;
  }

  async createSessionInTransaction(userId: string, tx: DbClient): Promise<SessionWithToken | null> {
    const authRepo = this.authRepoFactory(tx);
    const now = new Date();

    const id = this.generateSecureRandomString();
    const secret = this.generateSecureRandomString();
    const secretHash = await this.hashSecret(secret);

    const token = `${id}.${secret}`;

    const session: SessionWithToken = {
      id,
      userId,
      secretHash,
      createdAt: now,
      lastVerifiedAt: now,
      token,
    };

    const createdSession = await authRepo.createSession(session);

    if (createdSession.length !== 1) {
      return null;
    }

    return session;
  }

  async validateSessionToken(token: string): Promise<Session | null> {
    const now = new Date();

    const tokenParts = token.split(".");
    if (tokenParts.length !== 2) {
      return null;
    }
    const sessionId = tokenParts[0];
    const sessionSecret = tokenParts[1];

    const session = await this.getSession(sessionId);

    if (!session) {
      return null;
    }
    const tokenSecretHash = await this.hashSecret(sessionSecret);
    const validSecret = this.constantTimeEqual(tokenSecretHash, session.secretHash);
    if (!validSecret) {
      return null;
    }

    if (now.getTime() - session.lastVerifiedAt.getTime() >= this.activityCheckIntervalSeconds * 1000) {
      const authRepo = this.authRepoFactory(db);
      const result = await authRepo.updateSessionLastVerifiedAt(sessionId, now);
      if (result.length !== 1) {
        return null;
      }
      session.lastVerifiedAt = result[0].lastVerifiedAt;
    }

    return session;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    const authRepo = this.authRepoFactory(db);
    const now = new Date();

    const result = await authRepo.getSession(sessionId);
    if (result.length !== 1) {
      return null;
    }
    const row = result[0];
    const session: Session = {
      id: row.id,
      userId: row.user_id,
      secretHash: row.secretHash,
      createdAt: row.createdAt,
      lastVerifiedAt: row.lastVerifiedAt,
    };

    // Check expiration
    if (now.getTime() - session.createdAt.getTime() >= this.sessionExpiresInSeconds * 1000) {
      await authRepo.deleteSession(sessionId);
      return null;
    }

    return session;
  }

  async hashSecret(secret: string): Promise<Uint8Array> {
    const secretBytes = new TextEncoder().encode(secret);
    const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
    return new Uint8Array(secretHashBuffer);
  }

  constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.byteLength !== b.byteLength) {
      return false;
    }
    let c = 0;
    for (let i = 0; i < a.byteLength; i++) {
      c |= a[i] ^ b[i];
    }
    return c === 0;
  }
}
