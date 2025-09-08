import { useEffect, useState } from "react";
import { SuperAdminApi } from "../api/tenant-api";
import { useAuthForm } from "../../../../packages/auth/src/hooks/use.auth";
import type { TenantEntity } from "elysia-app/src/modules/tenants/infrastructure/tenant.entity";
import { normalizeError } from '../utils/handlers/error-handlers'
import type { TenantRoleEntity } from "elysia-app/src/modules/tenants/infrastructure/tenant-role.entity";

export function useSuperAdmin() {
    const {session} = useAuthForm();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [tenants, setTenants] = useState<TenantEntity[]>([]);
    const [tenantRoles, setTenantRoles] = useState<TenantRoleEntity[]>([]);
    const [email, setEmail] = useState<string>('');
    const [tenantName, setTenantName] = useState<string>('');
    const [roleName, setRoleName] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {fetchTenants, createTenant, deleteUser, createTenantRole} = SuperAdminApi;

  useEffect(() => {
    const loadTenants = async () => {
      try {
        setLoading(true);
        const data = await fetchTenants(session);
        setTenants(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch tenants");
      } finally {
        setLoading(false); 
      }
    };
    loadTenants();
  }, []);

  const handleCreateTenant = async (
    tenantName: string,
    roles: {
      roleName: string;
      permissions: {};
      is_default: boolean;
      is_system_role: boolean;
      roleDescription?: string;
    }[],
    tenantDescription?: string,
    logo_url?: string
  ) => {
    setSuccessMessage(null);
    setError(null);
  
    try {
      const createdTenant = await createTenant(session, tenantName, tenantDescription, logo_url);
  
      const createdRoles = await Promise.all(
        roles.map((role) =>
          createTenantRole(
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
  
      if (createdTenant && createdRoles.length > 0) {
        setTenants((prev) => [...prev, createdTenant]);
        setTenantRoles((prev) => [...prev, ...createdRoles]);
        setSuccessMessage(
          `Created tenant "${tenantName}" with ${createdRoles.length} role(s).`
        );
      } else {
        setError("Tenant already exists");
      }
    } catch (err) {
      const message = normalizeError(err);
      setError(message);
    }
  };
  

  return {setSuccessMessage, setIsSubmitting, setEmail, setUsers, setTenants, setTenantName, setRoleName, setError, deleteUser, handleCreateTenant, isSubmitting, email, tenantName, tenantRoles, roleName, successMessage, users, tenants, loading, error};
}
