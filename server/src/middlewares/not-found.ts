import type { NotFoundHandler } from "hono";

import { NOT_FOUND } from "@/utils/http-status-codes.js";

const notFound: NotFoundHandler = (c) => {
  return c.json({
    message: `Not Found - ${c.req.path}`,
  }, NOT_FOUND);
};

export default notFound;
