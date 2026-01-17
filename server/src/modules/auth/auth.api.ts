// The API to be used in inter-service communication
//

import { sessionSelectSchema, userSelectSchema } from "./auth.schema";
import { AuthService } from "./auth.service";
import { authRepoFactory } from "./user.providers";

export async function validateSession(sessionToken: string) {
  const authService = new AuthService(authRepoFactory);
  const session = await authService.validateSessionToken(sessionToken);
  if (session != null) {
    const safeSession = sessionSelectSchema.parse({
      id: session.id,
      user_id: session.userId,
      createdAt: session.createdAt,
      lastVerifiedAt: session.lastVerifiedAt,
    },
    );
    const [user] = await authService.getUserFromId(session.userId);
    if (!user) {
      return null;
    }
    const safeUser = userSelectSchema.parse(user);
    return { user: safeUser, session: safeSession };
  }
  return null;
}
