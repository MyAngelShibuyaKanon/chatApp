import type { z } from "@hono/zod-openapi";

import * as HttpStatusCode from "./http-status-codes";

export { HttpStatusCode };
export type ZodSchema = z.ZodTypeAny;
export type ZodIssue = z.core.$ZodIssue;
