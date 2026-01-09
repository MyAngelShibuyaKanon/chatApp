import { z } from "@hono/zod-openapi";
import { logger, pinoLogger } from "hono-pino";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db/db";
import { users } from "@/db/schema/user";
import { HttpStatusCode } from "@/utils/types";
import { expectType } from "@/utils/validator";

import type { CreateRoute, ListRoute } from "./auth.routes";
import type { SelectUser, SelectUserArray } from "./auth.schema";

import {

  selectUserArraySchema,
  selectUserSchema,
} from "./auth.schema";
import { hashPassword } from "./utils/password-utils";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const result = await db.query.users.findMany({
    columns: {
      password: false,
    },
  });

  // validate result to schema
  expectType<SelectUserArray>({} as typeof result);
  expectType<typeof result>({} as SelectUserArray);

  return c.json(result);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const user = c.req.valid("json");
  const hashedPassword = await hashPassword(user.password);

  user.password = hashedPassword;
  const [returning] = await db.insert(users).values(user).returning();
  const { password, ...returningSafe } = returning;
  const response = selectUserSchema.safeParse(returningSafe);

  return c.json(response.data, HttpStatusCode.OK);
};
