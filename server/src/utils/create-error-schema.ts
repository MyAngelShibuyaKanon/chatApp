import { z } from "@hono/zod-openapi";

export function createErrorSchema<T extends z.ZodType>(schema: T) {
  const invalidValue
    = schema instanceof z.ZodArray
      ? [null]
      : schema instanceof z.ZodObject
        ? {}
        : null;

  const result = schema.safeParse(invalidValue);

  const example = !result.success
    ? {
        name: result.error.name,
        issues: result.error.issues.map((issue: z.core.$ZodIssue) => ({
          code: issue.code,
          path: issue.path,
          message: issue.message,
        })),
      }
    : {
        name: "ZodError",
        issues: [
          {
            code: "invalid_type",
            path: ["fieldName"],
            message: "Expected string, received undefined",
          },
        ],
      };

  return z.object({
    success: z.boolean().openapi({
      example: false,
    }),
    error: z
      .object({
        issues: z.array(
          z.object({
            code: z.string(),
            path: z.array(z.union([z.string(), z.number()])),
            message: z.string().optional(),
          }),
        ),
        name: z.string(),
      })
      .openapi({
        example,
      }),
  });
}

export default createErrorSchema;
