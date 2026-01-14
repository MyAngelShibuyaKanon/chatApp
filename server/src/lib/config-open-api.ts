import { Scalar } from "@scalar/hono-api-reference";

import type { AppOpenAPI } from "./types";

export default function configOpenAPI(app: AppOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "0.0.1",
      title: "ChatApp API",
    },
  });

  app.get(
    "/reference",
    Scalar({
      url: "/doc",
      theme: "kepler",
      layout: "classic",
      defaultHttpClient: {
        targetKey: "dart",
        clientKey: "dio",
      },
    }),
  );
}
