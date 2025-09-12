import type { Resource, PermissionOption } from "../../../../../packages/features/src/validation/tenantValidation";

export function normalizePermissions(
  raw: Record<string, string[]>
): Record<Resource, PermissionOption[]> {
  const normalized = {} as Record<Resource, PermissionOption[]>;

  for (const key of Object.keys(raw)) {
    if (["tenant_roles", "tenant_users", "notifications", "notification_preferences"].includes(key)) {
      normalized[key as Resource] = raw[key] as PermissionOption[];
    }
  }

  return normalized;
}
