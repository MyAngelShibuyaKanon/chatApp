import configOpenAPI from "@/lib/config-open-api";
import { createApp } from "@/lib/create-app";
import auth from "@/modules/auth/auth.index";
import index from "@/modules/index.route";

const app = createApp();

configOpenAPI(app);

const routes = [index, auth];

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
