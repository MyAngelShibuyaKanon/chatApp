import { serve } from "@hono/node-server";
import app from "@/app";

serve(
  {
    fetch: app.fetch,
    port: 6727,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
