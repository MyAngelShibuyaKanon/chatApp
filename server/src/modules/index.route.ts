import { createRoute, z } from "@hono/zod-openapi";

import { createRouter } from "@/lib/create-app.js";
import { jsonContent } from "@/utils/json-helpers";

const router = createRouter().openapi(
  createRoute({
    tags: ["Index"],
    method: "get",
    path: "/",
    responses: {
      200:
        jsonContent(z.object({
          message: z.string(),
        }).openapi({
          example: {
            message: "Hello",
          },
        }), "Le Test"),

    },
  }),
  (c) => {
    return c.json(
      {
        message: "Hello",
      },
      200,
    );
  },
);

export default router;
