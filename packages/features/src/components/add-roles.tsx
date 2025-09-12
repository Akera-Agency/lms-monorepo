
import React from 'react'
import { Plus, Shield } from 'lucide-react';
import EditRole  from "./edit-role"
import { Button } from '../../../ui/src/components/button/button';
import { createEmptyPermissions, resourceList } from '../validation/tenantValidation';
import { useTenantContext } from '../providers/tenant-provider';

interface AddTenantProps {
    isDisabled: boolean
}

export default function AddRoles({
    isDisabled
}: AddTenantProps) {

const {roles, setRoles, setSelectedResource} = useTenantContext();

  const addRole = () => {
    setRoles((prev) => [
      ...prev,
      {
        role_name: "",
        role_description: "",
        permissions: createEmptyPermissions(),
        is_default: false,
        is_system_role: false,
      },
    ]);
    setSelectedResource((prev) => ({
      ...prev,
      [roles.length]: resourceList[0],
    }));
  };

return (
        <div className="backdrop-blur-sm border border-neutral-700 rounded-xl p-6 space-y-6 bg-neutral-800/20">
            <div className="flex items-center justify-between sm:flex-row flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-500/20 rounded-md">
                  <Shield className="h-5 w-5 text-neutral-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Roles & Permissions</h2>
              </div>
              
              <Button
                type="button"
                onClick={addRole}
                disabled={isDisabled}
                className={`sm:w-40 w-full px-12 py-4 text-base font-semibold rounded-md transition-all duration-300 ${
                  isDisabled
                    ? 'bg-neutral-500 cursor-not-allowed opacity-50 '
                    : 'bg-gradient-to-r from-primaryOrange to-[#e94e26] hover:from-transparent hover:to-transparent border-2 border-transparent hover:border-primaryOrange hover:text-primaryOrange shadow-lg hover:shadow-primaryOrange/25 active:scale-95'
                }`}
              >
                <Plus className="h-4 w-4" />
                Add Role
              </Button>
              
            </div>

            <div className="space-y-6">
              {roles.map((role, index) => (
                <div
                key={index}
                >
                <EditRole
                    role={role}
                    isDisabled={isDisabled}
                    showRemoveButton={true}
                    index={index}
                />
              </div>
              ))}
            </div>
          </div>
)}
