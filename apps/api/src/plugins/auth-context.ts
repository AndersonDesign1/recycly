import {
  type ApiAuthContext,
  type Role,
  roleSchema,
} from "../../../../packages/contracts/src/index";
import { ApiError } from "../errors";

const splitRoles = (value: string | undefined): Role[] => {
  if (!value) {
    return [];
  }

  const roles = value
    .split(",")
    .map((role) => role.trim())
    .filter((role) => role.length > 0);

  return roles.flatMap((role) => {
    const parsed = roleSchema.safeParse(role);
    return parsed.success ? [parsed.data] : [];
  });
};

type HeaderRecord = Record<string, string | undefined>;

const INTERNAL_TOKEN_HEADER = "x-recycly-internal-token";

export const getAuthContext = (
  headers: HeaderRecord,
  expectedInternalToken?: string
): ApiAuthContext | null => {
  if (!expectedInternalToken) {
    return null;
  }

  if (headers[INTERNAL_TOKEN_HEADER] !== expectedInternalToken) {
    return null;
  }

  const userId = headers["x-recycly-user-id"];

  if (!userId) {
    return null;
  }

  const activeRoleValue = headers["x-recycly-active-role"];
  const activeRole = activeRoleValue
    ? roleSchema.safeParse(activeRoleValue).data
    : undefined;
  const roles = splitRoles(headers["x-recycly-roles"] ?? undefined);

  return {
    userId,
    activeRole: activeRole ?? roles[0] ?? "user",
    roles: roles.length > 0 ? roles : [activeRole ?? "user"],
    sessionId: headers["x-workos-session-id"],
  };
};

export const requireAuth = (auth: ApiAuthContext | null): ApiAuthContext => {
  if (!auth) {
    throw new ApiError(401, "UNAUTHORIZED", "Authentication is required.");
  }

  return auth;
};

export const requireRole = (
  auth: ApiAuthContext | null,
  allowedRoles: Role[]
): ApiAuthContext => {
  const session = requireAuth(auth);

  if (!allowedRoles.includes(session.activeRole)) {
    throw new ApiError(
      403,
      "FORBIDDEN",
      "You do not have access to this resource.",
      {
        activeRole: session.activeRole,
        allowedRoles,
      }
    );
  }

  return session;
};
