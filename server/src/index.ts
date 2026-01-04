import { Hono, type Context } from "hono";
import authRoute from "./features/auth/index.js";

const app = new Hono();

app.get("/", (c: Context) => {
  return c.text("Hello Hono!");
});

app.route("/auth", authRoute);

export default app;
