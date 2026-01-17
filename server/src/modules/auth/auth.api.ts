// The API to be used in inter-service communication
//

import type { Session } from "./auth.types";

import { AuthRepository } from "./auth.repository";
import { sessionSelectSchema } from "./auth.schema";
import { AuthService } from "./auth.service";
import { authRepoFactory } from "./user.providers";

const authService = new AuthService(authRepoFactory);

export async function validateSession(sessionToken: string) {
  const session = await authService.validateSessionToken(sessionToken);
  if (session != null) {
    const safeSession = sessionSelectSchema.parse(session);
    return safeSession;
  }
  return null;
}
