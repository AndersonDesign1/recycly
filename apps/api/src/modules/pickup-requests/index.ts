import {
  createPickupRequestSchema,
  pickupRequestDetailSchema,
  pickupRequestListFiltersSchema,
  pickupRequestSummarySchema,
} from "@recycly/contracts";
import { Elysia } from "elysia";
import { z } from "zod";
import { ApiError } from "../../errors";
import { getAuthContext, requireRole } from "../../plugins/auth-context";
import {
  InMemoryPickupRequestStore,
  PickupRequestService,
  type PickupRequestStore,
} from "./service";

export interface PickupRequestModuleOptions {
  store?: PickupRequestStore;
}

export const createPickupRequestModule = (
  options: PickupRequestModuleOptions = {}
) => {
  const pickupRequestParamsSchema = z.object({
    id: z.string().uuid(),
  });
  const service = new PickupRequestService(
    options.store ?? new InMemoryPickupRequestStore()
  );

  return new Elysia({ prefix: "/pickup-requests", name: "pickup-requests" })
    .get(
      "/",
      ({ headers, query }) => {
        const session = requireRole(getAuthContext(headers), ["user"]);

        return service.list({
          ...query,
          requesterId: session.userId,
        });
      },
      {
        detail: {
          tags: ["Pickup Requests"],
          summary: "List pickup requests",
        },
        query: pickupRequestListFiltersSchema,
        response: {
          200: pickupRequestSummarySchema.array(),
        },
      }
    )
    .post(
      "/",
      ({ body, headers, set }) => {
        const session = requireRole(getAuthContext(headers), ["user"]);
        set.status = 201;
        return service.create(session.userId, body);
      },
      {
        detail: {
          tags: ["Pickup Requests"],
          summary: "Create a pickup request",
        },
        body: createPickupRequestSchema,
        response: {
          201: pickupRequestDetailSchema,
        },
      }
    )
    .get(
      "/:id",
      async ({ headers, params }) => {
        const session = requireRole(getAuthContext(headers), ["user"]);
        const pickupRequest = await service.getById(params.id);

        if (pickupRequest.requesterId !== session.userId) {
          throw new ApiError(
            403,
            "FORBIDDEN",
            "You do not have access to this pickup request."
          );
        }

        return pickupRequest;
      },
      {
        detail: {
          tags: ["Pickup Requests"],
          summary: "Get pickup request details",
        },
        params: pickupRequestParamsSchema,
        response: {
          200: pickupRequestDetailSchema,
        },
      }
    );
};
