import type { z } from "@hono/zod-openapi";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import type { ZodSchema } from "./types";

export function jsonContent<
  T extends ZodSchema,
>(schema: T, description: string) {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  };
}

export function jsonContentRequired<
  T extends ZodSchema,
>(schema: T, description: string) {
  return {
    ...jsonContent(schema, description),
    required: true,
  };
}

export function strictJSONResponse<
  C extends Context,
  S extends ZodSchema,
  D extends Parameters<Context["json"]>[0] & z.infer<S>,
  U extends ContentfulStatusCode,
>(c: C, schema: S, data: D, statusCode?: U) {
  const validatedResponse = schema.safeParse(data);

  if (!validatedResponse.success) {
    return c.json(
      {
        message: "Strict response validation failed",
      },
      500,
    );
  }

  return c.json(validatedResponse.data, statusCode);
}
