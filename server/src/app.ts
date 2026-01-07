import { createApp } from "@/lib/createApp.js";
import index from "@/modules/index.route";
import configOpenAPI from "@/lib/configOpenAPI";
import auth from "@/modules/auth/auth.index"
const app = createApp();

configOpenAPI(app);

const routes = [index, auth];

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
