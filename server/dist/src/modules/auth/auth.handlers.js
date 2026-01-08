import { db } from "@/db/db";
export const list = async (c) => {
    const users = await db.query.users.findMany();
    return c.json(users);
};
