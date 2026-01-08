import { createRouter } from "@/lib/createApp";
import * as routes from "./auth.routes";
import * as handlers from "./auth.handlers";
const router = createRouter()
    .openapi(routes.list, handlers.list);
export default router;
