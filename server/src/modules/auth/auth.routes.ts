import { createRoute } from "@hono/zod-openapi";

import { requireAuth } from "@/middlewares/auth";
import { HttpStatusCode, HttpStatusPhrase } from "@/utils/constants";
import createErrorSchema from "@/utils/create-error-schema";
import createMessageObjectSchema from "@/utils/create-message-object-schema";
import { jsonContent, jsonContentRequired, jsonContentWithHeader } from "@/utils/json-helpers";

import { authResponseHeaders, sessionSelectSchema, userRegisterSchema, userSelectSchema } from "./auth.schema";

const tags = ["Authentication"];
export const register = createRoute({
  path: "/register",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(userRegisterSchema, "The user to create"),
  },
  responses: {
    [HttpStatusCode.CREATED]: jsonContentWithHeader(userSelectSchema, "Register a user to the authentication service", authResponseHeaders),
    [HttpStatusCode.CONFLICT]: jsonContent(userRegisterSchema, "The user already exists"),
    [HttpStatusCode.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(userRegisterSchema), "Invalid inputs"),
  },
});

export const getMe = createRoute({
  path: "/me",
  method: "get",
  tags,
  middleware: requireAuth,
  responses: {
    [HttpStatusCode.OK]: jsonContent(userSelectSchema, "Get user data"),
    [HttpStatusCode.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrase.UNAUTHORIZED),
      "User unauthorized",
    ),
  },
});

export type RegisterRoute = typeof register;
export type GetMeRoute = typeof getMe;
