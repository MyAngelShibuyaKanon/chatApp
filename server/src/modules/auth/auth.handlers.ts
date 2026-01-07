import { AppRouteHandler } from "@/lib/types";
import { ListRoute } from "./auth.routes";
import { db } from "@/db/db";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const users = await db.query.users.findMany()
  return c.json(users)
}
