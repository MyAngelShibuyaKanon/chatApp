import type { z } from "@hono/zod-openapi";

export function jsonContent<
  T extends z.ZodType,
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
export function jsonContentWithHeader<
  T extends z.ZodType,
  U extends z.ZodType,
>(schema: T, description: string, headers: U) {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
    headers,
  };
}
export function jsonContentRequired<
  T extends z.ZodType,
>(schema: T, description: string) {
  return {
    ...jsonContent(schema, description),
    required: true,
  };
}
