import { OpenAPIHono } from "@hono/zod-openapi";
import { requestId } from "hono/request-id";

import notFound from "@/middlewares/not-found";
import onError from "@/middlewares/on-error";
import { pinoLogger } from "@/middlewares/pino-logger";

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

  app.onError(onError);
  app.notFound(notFound);
  return app;
}
