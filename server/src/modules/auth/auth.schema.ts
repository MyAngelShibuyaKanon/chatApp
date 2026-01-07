import { users } from "@/db/schema/user";
import { createSelectSchema } from "drizzle-zod";

export const userSelectSchema = createSelectSchema(users)
