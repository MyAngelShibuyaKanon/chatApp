import type { z } from "@hono/zod-openapi";

import * as HttpStatusCode from "./http-status-codes";
import * as HttpStatusPhrase from "./http-status-phrases";

export { HttpStatusCode, HttpStatusPhrase };
export type ZodSchema = z.ZodTypeAny | z.ZodObject | z.ZodArray;
export type ZodIssue = z.core.$ZodIssue;
