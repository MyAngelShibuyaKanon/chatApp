import type { AuthRepository } from "./auth.repository";
import type { Session, SessionWithToken } from "./auth.types";

export class AuthService {
  private sessionExpiresInSeconds = 60 * 60 * 24 * 7; // 7 days

  constructor(private authRepo: AuthRepository) { }
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

  async createSession(): Promise<SessionWithToken | null> {
    const now = new Date();

    const id = this.generateSecureRandomString();
    const secret = this.generateSecureRandomString();
    const secretHash = await this.hashSecret(secret);

    const token = `${id}.${secret}`;

    const session: SessionWithToken = {
      id,
      secretHash,
      createdAt: now,
      token,
    };

    const createdSession = await this.authRepo.createSession(session);

    if (createdSession.length !== 1) {
      return null;
    }

    return session;
  }

  async validateSessionToken(token: string): Promise<Session | null> {
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

    return session;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    const now = new Date();

    const result = await this.authRepo.getSession(sessionId);
    if (result.length !== 1) {
      return null;
    }
    const row = result[0];
    const session: Session = {
      id: row.id,
      secretHash: row.secretHash,
      createdAt: row.createdAt,
    };

    // Check expiration
    if (now.getTime() - session.createdAt.getTime() >= this.sessionExpiresInSeconds * 1000) {
      await this.authRepo.deleteSession(sessionId);
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
