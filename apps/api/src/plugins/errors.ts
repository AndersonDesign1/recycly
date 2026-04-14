import { apiErrorSchema } from "@recycly/contracts";
import { Elysia } from "elysia";
import { ZodError } from "zod";
import { ApiError } from "../errors";

export const errorPlugin = new Elysia({ name: "error-plugin" }).onError(
  ({ code, error, set }) => {
    if (error instanceof ApiError) {
      set.status = error.status;

      return apiErrorSchema.parse({
        code: error.code,
        message: error.message,
        details: error.details,
      });
    }

    if (code === "VALIDATION" || error instanceof ZodError) {
      set.status = 400;

      return apiErrorSchema.parse({
        code: "VALIDATION_ERROR",
        message: "The request payload is invalid.",
        details: error instanceof ZodError ? error.flatten() : undefined,
      });
    }

    set.status = 500;

    return apiErrorSchema.parse({
      code: "INTERNAL_ERROR",
      message: "The server could not complete the request.",
    });
  }
);
