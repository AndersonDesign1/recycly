import { getApiAuthHeaders } from "@/lib/auth";

const getApiBaseUrl = () =>
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:4000";

export const apiFetch = async (
  input: string,
  init: RequestInit = {}
): Promise<Response> => {
  const authHeaders = await getApiAuthHeaders();
  const headers = new Headers(init.headers);

  for (const [key, value] of Object.entries(authHeaders)) {
    headers.set(key, value);
  }

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${getApiBaseUrl()}${input}`, {
    ...init,
    headers,
    cache: "no-store",
  });
};
