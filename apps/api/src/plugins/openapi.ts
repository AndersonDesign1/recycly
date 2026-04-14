import { openapi } from "@elysiajs/openapi";
import { z } from "zod";

export const openApiPlugin = openapi({
  documentation: {
    info: {
      title: "Recycly API",
      version: "1.0.0",
      description:
        "Bun-first Elysia backend for Recycly's pickup-first recycling workflows.",
    },
    tags: [
      { name: "System", description: "Infrastructure and health endpoints." },
      {
        name: "Auth",
        description: "Authentication and session introspection.",
      },
      {
        name: "Pickup Requests",
        description: "Recycler pickup request workflows.",
      },
    ],
  },
  path: "/openapi",
  mapJsonSchema: {
    zod: z.toJSONSchema,
  },
});
