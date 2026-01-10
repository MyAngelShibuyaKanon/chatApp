import { eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db/db";
import { users } from "@/db/schema/user";
import { HttpStatusCode, HttpStatusPhrase } from "@/utils/types";
import { expectType } from "@/utils/validator";

import type { CreateRoute, GetRoute, ListRoute, SignInRoute } from "./auth.routes";
import type { SelectUser, SelectUserArray } from "./auth.schema";

import { hashPassword, verifyPassword } from "./utils/password-utils";

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

  expectType<SelectUser>({} as typeof returningSafe);
  expectType<typeof returningSafe>({} as SelectUser);

  return c.json(returningSafe, HttpStatusCode.OK);
};

export const get: AppRouteHandler<GetRoute> = async (c) => {
  const name = c.req.param("name");
  const user = await db.query.users.findFirst({
    where: eq(users.name, name),
  });

  if (!user) {
    return c.json({
      message: HttpStatusPhrase.NOT_FOUND,
    }, HttpStatusCode.NOT_FOUND);
  }
  const { password, ...response } = user;

  expectType<SelectUser>({} as typeof response);
  expectType<typeof response>({} as SelectUser);

  return c.json(response, HttpStatusCode.OK);
};

export const signIn: AppRouteHandler<SignInRoute> = async (c) => {
  const userDetail = c.req.valid("json");
  const user = await db.query.users.findFirst({
    where: eq(users.name, userDetail.name),
  });

  if (!user) {
    return c.json({
      message: HttpStatusPhrase.NOT_FOUND,
    }, HttpStatusCode.NOT_FOUND);
  }

  const { password, ...response } = user;

  const isPasswordValid = await verifyPassword(userDetail.password, password);

  if (!isPasswordValid) {
    return c.json({
      message: HttpStatusPhrase.UNAUTHORIZED,
    }, HttpStatusCode.UNAUTHORIZED);
  }

  expectType<SelectUser>({} as typeof response);
  expectType<typeof response>({} as SelectUser);

  return c.json(response, HttpStatusCode.OK);
};
