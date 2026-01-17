import type { AppRouteHandler, AuthContext } from "@/lib/types";

import { db } from "@/db/db";
import { setSessionTokenCookie } from "@/lib/cookies";
import { HttpStatusCode, HttpStatusPhrase } from "@/utils/constants";
import createErrorSchema from "@/utils/create-error-schema";

import type { GetMeRoute, LoginRoute, RegisterRoute } from "./auth.routes";

import { AuthRepository } from "./auth.repository";
import { userRegisterSchema, userSelectSchema } from "./auth.schema";
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

export const login: AppRouteHandler<LoginRoute> = async (c) => {
  const { username, password } = c.req.valid("json");
  const authService = new AuthService(authRepoFactory);
  const result = await authService.verifyUserLogin(username, password);
  if (!result) {
    return c.json({
      success: false,
      error: {
        issues: [
          {
            code: "Invalid Inputs",
            path: [],
            message: "username or password is invalid",
          },
        ],
        name: "ZodError",
      },
    }, HttpStatusCode.UNPROCESSABLE_ENTITY);
  };

  const user = userSelectSchema.parse(result.user);
  const token = result.token;
  setSessionTokenCookie(c, token);
  return c.json(user, HttpStatusCode.OK);
};

export const getMe: AppRouteHandler<GetMeRoute> = async (c: AuthContext) => {
  const user = c.get("user");

  return c.json(user, HttpStatusCode.OK);
};
