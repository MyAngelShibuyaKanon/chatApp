import { createRouter } from "@/lib/create-app";

import * as handlers from "./auth.handlers";
import * as routes from "./auth.routes";

export const router = createRouter()
  .openapi(routes.register, handlers.register)
  .openapi(routes.getMe, handlers.getMe)
  .openapi(routes.login, handlers.login);
export default router;
