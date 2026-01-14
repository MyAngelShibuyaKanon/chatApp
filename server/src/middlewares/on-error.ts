import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import env from "@/env";
import { INTERNAL_SERVER_ERROR, OK } from "@/utils/http-status-codes";

const onError: ErrorHandler = (err, c) => {
  const currentStatus = "status" in err
    ? err.status
    : c.res?.status;
  const statusCode = currentStatus && currentStatus !== OK // check if currentStatus is not empty
    ? (currentStatus as ContentfulStatusCode)
    : INTERNAL_SERVER_ERROR;

  return c.json(
    {
      message: err.message,

      stack: env.ENVIRONMENT === "production"
        ? undefined
        : err.stack,
    },
    statusCode,
  );
};

export default onError;
