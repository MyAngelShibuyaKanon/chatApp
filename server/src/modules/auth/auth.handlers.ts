import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db/db";

import type { ListRoute } from "./auth.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const users = await db.query.users.findMany();
  return c.json(users);
};
