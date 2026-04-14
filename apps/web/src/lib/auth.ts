import { type ApiAuthContext, roleSchema } from "@recycly/contracts";
import { withAuth } from "@workos-inc/authkit-nextjs";

const normalizeRoles = (roles: string[] | undefined, fallbackRole: string) => {
  const parsedRoles = (roles ?? [])
    .map((role) => roleSchema.safeParse(role))
    .filter((result) => result.success)
    .map((result) => result.data);

  if (parsedRoles.length > 0) {
    return parsedRoles;
  }

  const parsedFallbackRole = roleSchema.safeParse(fallbackRole);
  return [parsedFallbackRole.success ? parsedFallbackRole.data : "user"];
};

export const getApiAuthContext = async (): Promise<ApiAuthContext | null> => {
  const session = await withAuth();

  if (!session.user) {
    return null;
  }

  const activeRole = "user";
  const roles = normalizeRoles(undefined, activeRole);

  return {
    userId: session.user.id,
    activeRole,
    roles,
    sessionId: session.sessionId ?? undefined,
  };
};

export const getApiAuthHeaders = async (): Promise<HeadersInit> => {
  const auth = await getApiAuthContext();

  if (!auth) {
    return {};
  }

  return {
    "x-recycly-user-id": auth.userId,
    "x-recycly-active-role": auth.activeRole,
    "x-recycly-roles": auth.roles.join(","),
    ...(auth.sessionId ? { "x-workos-session-id": auth.sessionId } : {}),
  };
};
