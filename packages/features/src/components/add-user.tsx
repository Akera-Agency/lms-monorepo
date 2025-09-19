import React from 'react';
import { User } from 'lucide-react';
import EditUser from './edit-user';
import { RoleData, TenantData } from '../validation/tenantValidation';

interface AddTenantProps {
  isDisabled: boolean;
  tenants: TenantData[];
  // index: number;
  roles: RoleData[];
  fetchTenantRoles: (tenantId: string) => Promise<void>;
}

export default function AddUser({
  isDisabled,
  tenants,
  // index,
  roles,
  fetchTenantRoles,
}: AddTenantProps) {
  return (
    <div className="backdrop-blur-sm border border-neutral-700 rounded-xl p-6 space-y-6 bg-neutral-800/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-neutral-500/20 rounded-md">
          <User className="h-5 w-5 text-neutral-400" />
        </div>
        <h2 className="text-xl font-semibold text-white">User Information</h2>
      </div>
      <EditUser
        isDisabled={isDisabled}
        // index={index}
        tenants={tenants}
        roles={roles}
        fetchTenantRoles={fetchTenantRoles}
      />
    </div>
  );
}
