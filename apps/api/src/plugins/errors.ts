import { ZodError } from "zod";
import { apiErrorSchema } from "../../../../packages/contracts/src/index";
import { ApiError } from "../errors";

export const formatApiError = (code: string | number, error: unknown) => {
  if (error instanceof ApiError) {
    return {
      status: error.status,
      body: apiErrorSchema.parse({
        code: error.code,
        message: error.message,
        details: error.details,
      }),
    };
  }

  if (code === "VALIDATION" || error instanceof ZodError) {
    return {
      status: 400,
      body: apiErrorSchema.parse({
        code: "VALIDATION_ERROR",
        message: "The request payload is invalid.",
        details: error instanceof ZodError ? error.flatten() : undefined,
      }),
    };
  }

  return {
    status: 500,
    body: apiErrorSchema.parse({
      code: "INTERNAL_ERROR",
      message: "The server could not complete the request.",
    }),
  };
};
