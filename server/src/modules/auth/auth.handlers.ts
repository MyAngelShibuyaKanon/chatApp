import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db/db";

import type { ListRoute } from "./auth.routes";
import type { UserSelect } from "./auth.schema";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const users = (await db.query.users.findMany({
    columns: {
      passwordHash: false,
    },
  }));
  return c.json(users as UserSelect[]);
};
