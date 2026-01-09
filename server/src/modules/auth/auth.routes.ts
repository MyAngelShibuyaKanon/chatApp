import { createRoute, z } from "@hono/zod-openapi";

import createErrorSchema from "@/utils/create-error-schema";
import createMessageObjectSchema from "@/utils/create-message-object-schema";
import { jsonContent, jsonContentRequired } from "@/utils/json-helpers";
import { HttpStatusCode } from "@/utils/types";

import {
  insertUserSchema,
  selectUserArraySchema,
  selectUserSchema,
} from "./auth.schema";
import { hashPassword } from "./utils/password-utils";

const tags = ["Auth"];

export const list = createRoute({
  path: "/users",
  method: "get",
  tags,
  responses: {
    [HttpStatusCode.OK]: jsonContent(
      selectUserArraySchema,
      "List of users",
    ),
  },
},
);
export const get = createRoute({
  path: "/user",
  method: "get",
  request: {
    params: z.object({
      name: z.string().openapi({
        param: {
          name: "name",
          in: "path",
          required: true,
        },
        required: ["name"],
        example: "Ikuyo Kita",
      }),
    }),
  },
  tags,
  responses: {
    [HttpStatusCode.OK]: jsonContent(
      selectUserSchema,
      "Get user",
    ),
    [HttpStatusCode.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("User not found"),
      "User not found",
    ),
  },
},
);
export const create = createRoute({
  path: "/user",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertUserSchema,
      "Create a new user",
    ),
  },
  tags,
  responses: {
    [HttpStatusCode.OK]: jsonContent(
      selectUserSchema,
      "Returns the newly created user",
    ),
    [HttpStatusCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertUserSchema),
      "Validation error(s)",
    ),
  },
});

export type ListRoute = typeof list;
export type GetRoute = typeof get;
export type CreateRoute = typeof create;
