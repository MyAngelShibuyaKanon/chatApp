import { createRoute, z } from "@hono/zod-openapi";

import { OK } from "@/utils/http-status-codes";
import { jsonContent } from "@/utils/json-helpers";

import {
  selectUserArraySchema,
} from "./auth.schema";

const tags = ["Auth"];

export const list = createRoute({
  path: "/users",
  method: "get",
  tags,
  responses: {
    [OK]: jsonContent(
      selectUserArraySchema,
      "List of users",
    ),
  },
},
);

export type ListRoute = typeof list;
