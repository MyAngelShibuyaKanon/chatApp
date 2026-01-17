import type { Hook, OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { Context, Schema } from "hono";
import type { PinoLogger } from "hono-pino";

import type { Session, User } from "@/modules/auth/auth.types";

import { HttpStatusCode } from "@/utils/constants";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
    user: User;
    session: Session;
    sessionId: string;
  };
}

// eslint-disable-next-line ts/no-empty-object-type
export type AppOpenAPI<S extends Schema = {}> = OpenAPIHono<AppBindings, S>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings & AuthContext>;

export const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    return c.json(
      {
        success: result.success,
        error: {
          name: result.error.name,
          issues: result.error.issues,
        },
      },
      HttpStatusCode.UNPROCESSABLE_ENTITY,
    );
  }
};

export interface AuthContext extends Context<AppBindings> {
  get: ((key: "user") => User) & ((key: "session") => Session) & ((key: "sessionId") => string);
  set: ((key: "user", value: User) => void) & ((key: "session", value: Session) => void) & ((key: "sessionId", value: string) => void);
}
