import configOpenAPI from "@/lib/config-open-api";
import { createApp } from "@/lib/create-app";
import index from "@/modules/index.route";

const app = createApp();

configOpenAPI(app);

const routes = [index];

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
