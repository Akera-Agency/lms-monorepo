import { supabaseAdmin } from "../../../../packages/auth/src/utils/supabase";
import { authRoute } from "../../../../packages/auth/src/utils/external-routes";
import type { User, Session } from "@supabase/supabase-js";
import { apiClient } from "../../../../packages/lib/api/client";
import type { TenantEntity } from "elysia-app/src/modules/tenants/infrastructure/tenant.entity";
import { errorMessage } from "@/utils/handlers/error-handlers";
import type { TenantRoleEntity } from "elysia-app/src/modules/tenants/infrastructure/tenant-role.entity";

const cooldownMap = new Map<string, number>();

export const SuperAdminApi = {

  async inviteUser(
    email: string, 
    redirectPath: string = '/forgot-password'
  ): Promise<User | null> {
    const now = Date.now();
    const last = cooldownMap.get(email);
  
    if (last && now - last < 60_000) {
      throw new Error(`Please wait ${Math.ceil((60_000 - (now - last)) / 1000)} seconds before requesting again.`);
    }
  
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${authRoute}${redirectPath}`,
      data: { role: 'user' }
    });
  
    if (error) {
      console.error('Error inviting user:', error.message);
      return null;
    }
  
    cooldownMap.set(email, now);
    console.log('User invited successfully:', data.user);
    return data.user;
  },

  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      console.error('Error deleting user:', error.message);
      throw error;
    }
  },

  async fetchTenants(session: Session | null, 
    page: number = 1, 
    limit: number = 10, 
    search?:string
  ):Promise <TenantEntity[]> {
    
    const { data, error } = await apiClient(session).api.tenants.get({
      query: { page, limit, search }
    });
    
    if (error) {
      throw new Error(errorMessage(error));
    }
    console.log(data)
    return data.data; 
  },

  async createTenant(
    session: Session | null,
    name: string, 
    is_public: boolean,
    description?: string, 
    logo_url?:string,
  ):Promise <TenantEntity> {

    const { data, error } = await apiClient(session).api.tenants.post({
      name,
      description,
      logo_url,
      is_public
    });
    
    if (error) {
      throw new Error(errorMessage(error));
    }
    console.log(data)
    return data; 
  },

  async createTenantRole(session: Session | null, 
    tenant_id: string,
    name: string, 
    permissions: {}, 
    is_default: boolean,
    is_system_role: boolean, 
    description?: string, 
  ):Promise <TenantRoleEntity> {

    const { data, error } = await apiClient(session).api.tenants({id: tenant_id}).roles.post({
      name: name,
      description: description,
      permissions: permissions,
      is_default: is_default,
      is_system_role: is_system_role,
    });
    
    if (error) {
      throw new Error(errorMessage(error));
    }
    console.log(data)
    return data; 
  },

}