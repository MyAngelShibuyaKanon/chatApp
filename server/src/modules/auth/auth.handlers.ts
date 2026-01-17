import type { AppRouteHandler, AuthContext } from "@/lib/types";

import { db } from "@/db/db";
import { setSessionTokenCookie } from "@/lib/cookies";
import { HttpStatusCode, HttpStatusPhrase } from "@/utils/constants";

import type { GetMeRoute, RegisterRoute } from "./auth.routes";

import { AuthRepository } from "./auth.repository";
import { userSelectSchema } from "./auth.schema";
import { AuthService } from "./auth.service";
import { authRepoFactory } from "./user.providers";

export const register: AppRouteHandler<RegisterRoute> = async (c) => {
  const { username, password } = c.req.valid("json");

  const authService = new AuthService(authRepoFactory);

  const [existingUser] = await authService.getUserFromUsername(username);

  if (existingUser) {
    return c.json({ username, password }, HttpStatusCode.CONFLICT);
  }

  const result = await authService.createUser(username, password);
  const user = userSelectSchema.parse(result.user);
  const token = result.token;
  setSessionTokenCookie(c, token);
  return c.json(user, HttpStatusCode.CREATED);
};

export const getMe: AppRouteHandler<GetMeRoute> = async (c: AuthContext) => {
  const user = c.get("user");

  return c.json(user, HttpStatusCode.OK);
};
