import { OpenAPIHono } from "@hono/zod-openapi";
import { pinoLogger } from "hono-pino";
import { requestId } from "hono/request-id";

import { defaultHook } from "./types";

export function createRouter() {
  return new OpenAPIHono({
    strict: false,
    defaultHook,
  });
}

export function createApp() {
  const app = createRouter();
  app.use(requestId());
  app.use(pinoLogger());
  return app;
}
