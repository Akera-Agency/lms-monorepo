import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SuperAdminApi } from "../api/tenant-api";
import { useAuthForm } from "../../../../packages/auth/src/hooks/use.auth";
import type { TenantEntity } from "elysia-app/src/modules/tenants/infrastructure/tenant.entity";
import type { TenantRoleEntity } from "elysia-app/src/modules/tenants/infrastructure/tenant-role.entity";
import type { PermissionOption, Resource } from "../../../../packages/features/src/validation/tenantValidation";
import { normalizeError } from "../utils/handlers/error-handlers";
import type { TenantUserEntity } from "elysia-app/src/modules/tenants/infrastructure/tenant-user.entity";
import type { UserEntity } from "elysia-app/src/modules/users/infrastructure/user.entity";
import type { UsersTenants } from "@/types/users-tenants";
import { useMemo } from "react";

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

  const users = () => {
    const {
      data: users = [],
      isLoading: loading,
      isError,
      error,
    } = useQuery<UserEntity[], Error>({
      queryKey: ["users"],
      queryFn: () => SuperAdminApi.fetchUsers(session),
      enabled: !!session,
    });
    return { users, loading, isError,  error: error ? normalizeError(error) : null };
  };

  const usersWithTenants = () => {
    const {
      data: usersWithTenants = [],
      isLoading: loading,
      isError,
      error,
    } = useQuery<UsersTenants[], Error>({
      queryKey: ["tenants"],
      queryFn: () => SuperAdminApi.fetchUsersWithTenants(session),
      enabled: !!session,
    });
    return { usersWithTenants, loading, isError,  error: error ? normalizeError(error) : null };
  };

  const tenantById = (id: string) => {
    const {
      data: tenant,
      isLoading: loading,
      isError,
      error,
    } = useQuery({
      queryKey: ["tenants", id],
      queryFn: () => {
        if (!id) throw new Error("Tenant ID is required");
        return SuperAdminApi.fetchTenantById(session, id);
      },
      enabled: !!session && !!id, 
    });
    
    return { 
      tenant, 
      loading, 
      isError,  
      error: error ? normalizeError(error) : null 
    };
  };

  const tenantRoles = (tenant_id: string) => {
    const {
      data: rawTenantRoles = [],
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
  
    // Memoize tenantRoles to prevent unnecessary re-renders
    const tenantRoles = useMemo(() => {
      return rawTenantRoles;
    }, [JSON.stringify(rawTenantRoles)]);
  
    return { tenantRoles, loading, isError, error: error ? normalizeError(error) : null };
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
      console.error("Delete tenant error:", normalizeError(err));
    },
  });

  const deleteUserMutation = useMutation<void, Error, string>({
    mutationFn: (user_id) => SuperAdminApi.deleteTenant(session, user_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      console.error("Delete user error:", normalizeError(err));
    },
  });

  const deleteTenantRoleMutation = useMutation<void, Error, {tenant_id: string, id: string}>({
    mutationFn: ({tenant_id, id}) => SuperAdminApi.deleteTenantRole(session, tenant_id, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tenant_roles", variables.tenant_id] });
    },
    onError: (err) => {
      console.error("Delete tenant role error:", normalizeError(err));
    },
  });

  const updateTenantRoleMutation = useMutation<TenantRoleEntity, Error, 
  {
    tenant_id: string;
    id: string;
    name: string;
    permissions: Record<Resource, PermissionOption[]> | Record<string, string[]>;
    is_default: boolean;
    is_system_role: boolean;
    description?: string;
  }
  >({
    mutationFn: async({ 
      tenant_id,
      id,
      name,
      permissions,
      is_default,
      is_system_role,
      description
    }) => SuperAdminApi.updateTenantRole(
      session,
      tenant_id,
      id,
      name,
      permissions,
      is_default,
      is_system_role,
      description
    ),
    onSuccess: (updatedRole, variables) => {
      queryClient.setQueryData<TenantRoleEntity[]>(
        ["tenant_roles", variables.tenant_id],
        (old = []) => old.map(role => 
          role.id === variables.id ? updatedRole : role
        )
      );
    },
    onError: (err) => {
      console.error("Update tenant role error:", normalizeError(err));
    },
  });

  const updateTenantMutation = useMutation<TenantEntity, Error, 
  {
    id: string,
    name: string,
    is_public: boolean,
    description?: string,
    logo_url?: string
  }
  >({
    mutationFn: async({ 
      id,
      name,
      is_public,
      description,
      logo_url
    }) => SuperAdminApi.updateTenant(
      session,
      id,
      name,
      is_public,
      description,
      logo_url
    ),
    onSuccess: (updatedTenant, variables) => {
      queryClient.setQueryData<TenantEntity[]>(
        ["tenant", variables.id],
        (old = []) => old.map(tenant => 
          tenant.id === variables.id ? updatedTenant : tenant
        )
      );
    },
    onError: (err) => {
      console.error("Update tenant error:", normalizeError(err));
    },
  });

  const InviteUserMutation = useMutation<
  { tenantUser: TenantUserEntity },
  Error,
  {
    email: string,
    tenantId: string,
    roleId: string,
    
  }
>({
  mutationFn: async ({
    email,
    tenantId,
    roleId,
  }) => {

    const user = await SuperAdminApi.inviteUser(email, roleId, tenantId)
    if (user){
      const assignUserToTenant = await SuperAdminApi.assignUserToTenant(session,tenantId,user.id,roleId)
      return { invitedUser: user, tenantUser: assignUserToTenant };
    }
    else{
      throw Error ("Error inviting user")
    }
  },
  onSuccess: ({ tenantUser }) => {
    queryClient.setQueryData<TenantUserEntity[]>(["tenant_users"], (old = []) => [...old, tenantUser]);
  },
  onError: (err) => {
    console.error("Assigning user to tenant error:", normalizeError(err));
  },
});

const removeUserFromTenantMutation = useMutation<void, Error, {tenantId: string, userId: string}>({
  mutationFn: ({tenantId, userId}) => SuperAdminApi.removeUserFromTenant(session, tenantId, userId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tenant_users"] });
  },
  onError: (err) => {
    console.error("Remove user from tenant error:", normalizeError(err));
  },
});

  return {
    tenants,
    users,
    usersWithTenants,
    tenantById,
    tenantRoles,
    handleCreateTenant: createTenantMutation.mutateAsync,
    handleAssignUserTotenant: InviteUserMutation.mutateAsync,
    deleteTenant: deleteTenantMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    deleteTenantRole: deleteTenantRoleMutation.mutateAsync,
    removeUserFromTenant: removeUserFromTenantMutation.mutateAsync,
    updateTenantRole: updateTenantRoleMutation.mutateAsync,
    updateTenant: updateTenantMutation.mutateAsync,
    successMessage: createTenantMutation.status,
    deleteTenantStatus: deleteTenantMutation.status,
    deleteUserStatus: deleteUserMutation.status,
    deleteTenantRoleStatus: deleteTenantRoleMutation.status,
    updateTenantRoleStatus: updateTenantRoleMutation.status,
    updateTenantStatus: updateTenantMutation.status,
    userTenantStatus: InviteUserMutation.status
  };
}