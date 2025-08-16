import { UserRole } from "@prisma/client";

// Role hierarchy (higher number = higher permission)
export const ROLE_HIERARCHY = {
  [UserRole.USER]: 1,
  [UserRole.WASTE_MANAGER]: 2,
  [UserRole.ADMIN]: 3,
  [UserRole.SUPERADMIN]: 4,
} as const;

// Role permissions
export const ROLE_PERMISSIONS = {
  [UserRole.SUPERADMIN]: [
    "manage_users",
    "manage_admins",
    "manage_waste_managers",
    "manage_system_settings",
    "view_all_data",
    "manage_campaigns",
    "manage_rewards",
    "manage_waste_bins",
    "verify_disposals",
    "manage_reports",
    "view_analytics",
  ],
  [UserRole.ADMIN]: [
    "manage_users",
    "manage_waste_managers",
    "view_all_data",
    "manage_campaigns",
    "manage_rewards",
    "manage_waste_bins",
    "verify_disposals",
    "manage_reports",
    "view_analytics",
  ],
  [UserRole.WASTE_MANAGER]: [
    "manage_waste_bins",
    "verify_disposals",
    "manage_reports",
    "view_assigned_data",
  ],
  [UserRole.USER]: [
    "create_disposals",
    "redeem_rewards",
    "create_reports",
    "view_own_data",
  ],
} as const;

export function hasPermission(userRole: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[userRole].includes(permission as never);
}

export function hasHigherRole(
  userRole: UserRole,
  targetRole: UserRole
): boolean {
  return ROLE_HIERARCHY[userRole] > ROLE_HIERARCHY[targetRole];
}

export function canManageUser(
  managerRole: UserRole,
  targetRole: UserRole
): boolean {
  // Super Admin can manage everyone
  if (managerRole === UserRole.SUPERADMIN) return true;

  // Admin can manage Waste Managers and Users
  if (managerRole === UserRole.ADMIN) {
    return (
      targetRole === UserRole.WASTE_MANAGER || targetRole === UserRole.USER
    );
  }

  // Waste Manager can only manage regular Users
  if (managerRole === UserRole.WASTE_MANAGER) {
    return targetRole === UserRole.USER;
  }

  return false;
}

export function getRoleDisplayName(role: UserRole): string {
  const roleNames = {
    [UserRole.SUPERADMIN]: "Super Administrator",
    [UserRole.ADMIN]: "Administrator",
    [UserRole.WASTE_MANAGER]: "Waste Manager",
    [UserRole.USER]: "User",
  };
  return roleNames[role];
}

export function getRoleColor(role: UserRole): string {
  const roleColors = {
    [UserRole.SUPERADMIN]: "bg-purple-100 text-purple-800",
    [UserRole.ADMIN]: "bg-red-100 text-red-800",
    [UserRole.WASTE_MANAGER]: "bg-blue-100 text-blue-800",
    [UserRole.USER]: "bg-green-100 text-green-800",
  };
  return roleColors[role];
}
