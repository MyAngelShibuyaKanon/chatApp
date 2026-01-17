import { createRoute } from "@hono/zod-openapi";

import { requireAuth } from "@/middlewares/auth";
import { HttpStatusCode } from "@/utils/constants";
import createErrorSchema from "@/utils/create-error-schema";
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

export const getSession = createRoute({
  path: "/session",
  method: "get",
  tags,
  middleware: requireAuth,
  responses: {
    [HttpStatusCode.OK]: jsonContent(sessionSelectSchema, "Get user session data"),
  },
});

export type registerRoute = typeof register;
