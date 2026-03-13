export const appRoles = ["user", "collector", "staff", "super_admin"] as const;

export type AppRole = (typeof appRoles)[number];
