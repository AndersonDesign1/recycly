import { describe, expect, it } from "bun:test";
import { createApp } from "../src/application";
import { InMemoryPickupRequestStore } from "../src/modules/pickup-requests/service";

const env = {
  API_HOST: "127.0.0.1",
  API_PORT: 4001,
  API_BASE_URL: "http://127.0.0.1:4001",
  WEB_APP_URL: "http://127.0.0.1:3000",
  RECYCLY_INTERNAL_API_TOKEN: "recycly-internal-token-12345",
};

const createHeaders = (overrides?: Record<string, string>) => ({
  "content-type": "application/json",
  "x-recycly-user-id": "user_123",
  "x-recycly-active-role": "user",
  "x-recycly-roles": "user",
  "x-recycly-internal-token": env.RECYCLY_INTERNAL_API_TOKEN,
  ...overrides,
});

describe("recycly api", () => {
  it("boots with serverless-safe defaults for public routes", async () => {
    const app = createApp();
    const response = await app.handle(new Request("http://localhost/health"));

    expect(response.status).toBe(200);
  });

  it("rejects protected routes when the internal token is not configured", async () => {
    const app = createApp();
    const response = await app.handle(
      new Request("http://localhost/v1/me", {
        headers: {
          "x-recycly-user-id": "user_123",
        },
      })
    );

    expect(response.status).toBe(401);
  });

  it("returns a healthy status", async () => {
    const app = createApp({ env });
    const response = await app.handle(new Request("http://localhost/health"));

    expect(response.status).toBe(200);

    const payload = (await response.json()) as { status: string };
    expect(payload.status).toBe("ok");
  });

  it("rejects unauthenticated session inspection", async () => {
    const app = createApp({ env });
    const response = await app.handle(new Request("http://localhost/v1/me"));

    expect(response.status).toBe(401);
  });

  it("rejects access when the caller role is forbidden", async () => {
    const app = createApp({ env });
    const response = await app.handle(
      new Request("http://localhost/v1/pickup-requests", {
        headers: createHeaders({
          "x-recycly-active-role": "staff",
          "x-recycly-roles": "staff",
        }),
      })
    );

    expect(response.status).toBe(403);
  });

  it("validates pickup request payloads", async () => {
    const app = createApp({ env });
    const response = await app.handle(
      new Request("http://localhost/v1/pickup-requests", {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify({
          wasteType: "plastic",
          quantityLabel: "2 sacks",
          city: "Kano",
          addressLine: "12 Palm Street",
          pickupWindow: {
            startAt: "2026-04-15T09:00:00.000Z",
            endAt: "2026-04-15T11:00:00.000Z",
          },
        }),
      })
    );

    expect(response.status).toBe(422);
  });

  it("creates and retrieves pickup requests for an authenticated recycler", async () => {
    const store = new InMemoryPickupRequestStore();
    const app = createApp({
      env,
      pickupRequests: { store },
    });

    const createResponse = await app.handle(
      new Request("http://localhost/v1/pickup-requests", {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify({
          wasteType: "plastic",
          quantityLabel: "2 sacks",
          city: "Lagos",
          addressLine: "12 Palm Street",
          notes: "Ring the gate bell",
          pickupWindow: {
            startAt: "2026-04-15T09:00:00.000Z",
            endAt: "2026-04-15T11:00:00.000Z",
          },
        }),
      })
    );

    expect(createResponse.status).toBe(201);
    const created = (await createResponse.json()) as { id: string };

    const listResponse = await app.handle(
      new Request("http://localhost/v1/pickup-requests", {
        headers: createHeaders(),
      })
    );

    expect(listResponse.status).toBe(200);
    const listed = (await listResponse.json()) as { id: string }[];
    expect(listed).toHaveLength(1);
    expect(listed[0]?.id).toBe(created.id);

    const detailResponse = await app.handle(
      new Request(`http://localhost/v1/pickup-requests/${created.id}`, {
        headers: createHeaders(),
      })
    );

    expect(detailResponse.status).toBe(200);
    const detail = (await detailResponse.json()) as { id: string };
    expect(detail.id).toBe(created.id);
  });

  it("serves generated OpenAPI JSON", async () => {
    const app = createApp({ env });
    const response = await app.handle(
      new Request("http://localhost/openapi/json")
    );

    expect(response.status).toBe(200);
  });
});
