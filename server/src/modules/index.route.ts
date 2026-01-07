import { createRouter } from "@/lib/createApp.js";
import { jsonContent } from "@/utils/jsonHelpers";
import { createRoute, z } from "@hono/zod-openapi";

const router = createRouter().openapi(
  createRoute({
    tags: ["Index"],
    method: "get",
    path: "/",
    responses: {
      [200]:
        jsonContent(z.object({
          message: z.string(),
        }).openapi({
          example: {
            message: "Hello",
          },
        }),
          "Le Test",
        ),

    },
  }),
  (c) => {
    return c.json(
      {
        message: "Tasks API",
      },
      200,
    );
  },
);

export default router;
