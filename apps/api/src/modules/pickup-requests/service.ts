import { randomUUID } from "node:crypto";
import type {
  CreatePickupRequestInput,
  PickupRequestDetail,
  PickupRequestListFilters,
  PickupRequestSummary,
} from "../../../../../packages/contracts/src/index";
import { ApiError } from "../../errors";

export interface PickupRequestStore {
  create(input: PickupRequestDetail): Promise<PickupRequestDetail>;
  getById(id: string): Promise<PickupRequestDetail | null>;
  list(filters: PickupRequestListFilters): Promise<PickupRequestSummary[]>;
}

export class InMemoryPickupRequestStore implements PickupRequestStore {
  readonly #records = new Map<string, PickupRequestDetail>();

  create(input: PickupRequestDetail): Promise<PickupRequestDetail> {
    this.#records.set(input.id, input);
    return Promise.resolve(input);
  }

  list(filters: PickupRequestListFilters): Promise<PickupRequestSummary[]> {
    const records = [...this.#records.values()].filter((record) => {
      if (filters.requesterId && record.requesterId !== filters.requesterId) {
        return false;
      }

      if (filters.city && record.city !== filters.city) {
        return false;
      }

      if (filters.status && record.status !== filters.status) {
        return false;
      }

      return true;
    });

    return Promise.resolve(
      records.map(({ id, ...rest }) => ({
        id,
        ...rest,
      }))
    );
  }

  getById(id: string): Promise<PickupRequestDetail | null> {
    return Promise.resolve(this.#records.get(id) ?? null);
  }
}

export class PickupRequestService {
  readonly #store: PickupRequestStore;

  constructor(store: PickupRequestStore) {
    this.#store = store;
  }

  create(
    requesterId: string,
    input: CreatePickupRequestInput
  ): Promise<PickupRequestDetail> {
    const now = new Date().toISOString();
    const pickupRequest: PickupRequestDetail = {
      id: randomUUID(),
      requesterId,
      status: "requested",
      wasteType: input.wasteType,
      quantityLabel: input.quantityLabel,
      city: input.city,
      addressLine: input.addressLine,
      notes: input.notes ?? null,
      pickupWindow: input.pickupWindow,
      createdAt: now,
      updatedAt: now,
    };

    return this.#store.create(pickupRequest);
  }

  list(filters: PickupRequestListFilters): Promise<PickupRequestSummary[]> {
    return this.#store.list(filters);
  }

  async getById(id: string): Promise<PickupRequestDetail> {
    const pickupRequest = await this.#store.getById(id);

    if (!pickupRequest) {
      throw new ApiError(404, "NOT_FOUND", "Pickup request was not found.");
    }

    return pickupRequest;
  }
}
