/* eslint-disable node/no-process-env */
import { z } from "@hono/zod-openapi";
import { config } from "dotenv";
import path from "node:path";

config({
  path: path.resolve(
    process.cwd(),
    ".env",
  ),
  quiet: true,
});

const EnvSchema = z.object({
  ENVIRONMENT: z.string().default("development"),
  PORT: z.coerce.number().default(6727),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]),
  DATABASE_URL: z.url(),
});

export type env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line ts/no-redeclare
const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
  console.error("Invalid ENV:");
  console.error(JSON.stringify(z.treeifyError(error), null, 2));
  process.exit(1);
}

export default env!;
