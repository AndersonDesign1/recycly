export const appRoles = ["user", "collector", "staff", "super_admin"] as const;

export type AppRole = (typeof appRoles)[number];

export const roleLabels: Record<AppRole, string> = {
  user: "User",
  collector: "Collector",
  staff: "Staff",
  super_admin: "Super Admin",
};

export function isElevatedRole(role: AppRole) {
  return role === "staff" || role === "super_admin";
}

export function hasAnyRole(role: AppRole, allowed: AppRole[]) {
  return allowed.includes(role);
}
