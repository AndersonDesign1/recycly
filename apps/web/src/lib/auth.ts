import { type ApiAuthContext, roleSchema } from "@recycly/contracts";
import { withAuth } from "@workos-inc/authkit-nextjs";

export interface ViewerProfile {
  email: string | null;
  fullName: string;
  initials: string;
  userId: string;
}

export const getStringField = (
  value: unknown,
  fieldName: string
): string | undefined => {
  if (!(typeof value === "object" && value !== null)) {
    return undefined;
  }

  const fieldValue = value[fieldName as keyof typeof value];

  return typeof fieldValue === "string" ? fieldValue : undefined;
};

export const createInitials = (fullName: string): string => {
  const initials = fullName
    .split(" ")
    .filter((part) => part.length > 0)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "RC";
};

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

export const createViewerProfile = (user: unknown): ViewerProfile | null => {
  if (!(typeof user === "object" && user !== null)) {
    return null;
  }

  const userId = getStringField(user, "id");

  if (!userId) {
    return null;
  }

  const firstName = getStringField(user, "firstName");
  const lastName = getStringField(user, "lastName");
  const email = getStringField(user, "email") ?? null;
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const fallbackName = email?.split("@")[0] ?? "Recycly member";
  const resolvedName = fullName || fallbackName;

  return {
    userId,
    email,
    fullName: resolvedName,
    initials: createInitials(resolvedName),
  };
};

export const getViewerProfile = async (): Promise<ViewerProfile | null> => {
  const session = await withAuth();
  return createViewerProfile(session.user);
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
