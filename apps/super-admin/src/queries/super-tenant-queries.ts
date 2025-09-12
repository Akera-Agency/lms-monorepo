import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SuperAdminApi } from "../api/tenant-api";
import { useAuthForm } from "../../../../packages/auth/src/hooks/use.auth";
import type { TenantEntity } from "elysia-app/src/modules/tenants/infrastructure/tenant.entity";
import type { TenantRoleEntity } from "elysia-app/src/modules/tenants/infrastructure/tenant-role.entity";
import type { PermissionOption, Resource } from "../../../../packages/features/src/validation/tenantValidation";
import { normalizeError } from "../utils/handlers/error-handlers";

export function SuperAdminQueries() {
  const { session } = useAuthForm();
  const queryClient = useQueryClient();

  const tenants = () => {
    const {
      data: tenants = [],
      isLoading: loading,
      isError,
      error,
    } = useQuery<TenantEntity[], Error>({
      queryKey: ["tenants"],
      queryFn: () => SuperAdminApi.fetchTenants(session),
      enabled: !!session,
    });
    return { tenants, loading, isError,  error: error ? normalizeError(error) : null };
  };
  
  const tenantRoles = (tenant_id: string) => {
    const {
      data: tenantRoles = [],
      isLoading: loading,
      isError,
      error,
    } = useQuery<TenantRoleEntity[], Error>({
      queryKey: ["tenant_roles", tenant_id],
      queryFn: () => {
        if (!tenant_id) throw new Error("Tenant ID is required");
        return SuperAdminApi.fetchTenantRoles(session, tenant_id);
      },
      enabled: !!session && !!tenant_id,
    });
  
    return { tenantRoles, loading, isError,  error: error ? normalizeError(error) : null };
  };
  
  const createTenantMutation = useMutation<
    { tenant: TenantEntity; roles: TenantRoleEntity[] },
    Error,
    {
      tenantName: string;
      is_public: boolean;
      roles: {
        roleName: string;
        permissions: Record<Resource, PermissionOption[]> | Record<string, string[]>;
        is_default: boolean;
        is_system_role: boolean;
        roleDescription?: string;
      }[];
      tenantDescription?: string;
      logo_url?: string;
    }
  >({
    mutationFn: async ({
      tenantName,
      is_public,
      roles,
      tenantDescription,
      logo_url,
    }) => {
      const createdTenant = await SuperAdminApi.createTenant(
        session,
        tenantName,
        is_public,
        tenantDescription,
        logo_url
      );

      const createdRoles = await Promise.all(
        roles.map((role) =>
          SuperAdminApi.createTenantRole(
            session,
            createdTenant.id,
            role.roleName,
            role.permissions,
            role.is_default,
            role.is_system_role,
            role.roleDescription
          )
        )
      );

      return { tenant: createdTenant, roles: createdRoles };
    },
    onSuccess: ({ tenant }) => {
      queryClient.setQueryData<TenantEntity[]>(["tenants"], (old = []) => [...old, tenant]);
    },
    onError: (err) => {
      console.error("Create tenant error:", normalizeError(err));
    },
  });

  const deleteTenantMutation = useMutation<void, Error, string>({
    mutationFn: (tenant_id) => SuperAdminApi.deleteTenant(session, tenant_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (err) => {
      console.error("Delete user error:", normalizeError(err));
    },
  });

  return {
    tenants,
    tenantRoles,
    handleCreateTenant: createTenantMutation.mutateAsync,
    deleteTenant: deleteTenantMutation.mutateAsync,
    successMessage: createTenantMutation.status,
    deleteTenantStatus: deleteTenantMutation.status,
  };
}
