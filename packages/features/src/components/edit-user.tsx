import React, { useEffect } from "react";
import Input from "../../../../packages/ui/src/components/form/input";
import { useTenantContext } from "../providers/tenant-provider";
import { TenantData, UserData, RoleData } from "../validation/tenantValidation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../packages/ui/src/components/shadcn/dropdown-menu";
import { Button } from "../../../../packages/ui/src/components/button/button";
import { ChevronDown, University, Shield } from "lucide-react";

interface EditUserProps {
    isDisabled: boolean;
    userData?: UserData;
    setUserData?: (data: UserData) => void;
    tenants: TenantData[];
    roles: RoleData[];
    errors?: any;
    // index: number;
    fetchTenantRoles: (tenantId: string) => Promise<void>;
  }

  export default function EditUser({
    isDisabled,
    userData: propUserData,
    setUserData: propSetUserData,
    errors: propErrors,
    tenants,
    roles,
    // index,
    fetchTenantRoles,
  }: EditUserProps) {
    const context = useTenantContext();

  const userData = propUserData || context.userData;
  const setUserData = propSetUserData || context.setUserData;
  const errors = propErrors || context.errors;

  const { selectedTenant, setSelectedTenant, index, setIndex } = context;

  const [selectedRole, setSelectedRole] = React.useState<RoleData | null>(null);

  useEffect(() => {
    const tenantId = selectedTenant[index]?.id;
    if (tenantId) {
      fetchTenantRoles(tenantId);
    }
  }, [selectedTenant[index]?.id]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Input
        id="user_email"
        label="User Email"
        type="email"
        placeholder="m@example.com"
        labelClassName="text-white font-medium"
        className="border-neutral-700 text-white"
        value={userData.email}
        error={errors.email}
        onChange={(e) => {
          const value = (e.target as HTMLInputElement).value;
          setUserData({ ...userData, email: value });
        }}
        disabled={isDisabled}
      />

      {/* Tenant Dropdown */}
      <div className="gap-2 flex flex-col h-30">
        <span className="text-white">Tenant</span>
        <DropdownMenu key={`tenant_${index}`}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              disabled={isDisabled}
              className="bg-neutral-700 hover:bg-neutral-600 text-white border border-neutral-600 px-4 py-2 rounded-md flex items-center gap-2 justify-between"
            >
              <University className="h-4 w-4" />
              {selectedTenant[index]?.name ||
                tenants[index]?.name ||
                "Select a tenant"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-neutral-800 border-neutral-700 text-white min-w-48">
            {tenants.map((tenant, index) => (
              <DropdownMenuItem
                key={tenant.id}
                onClick={() =>
                {
                  setIndex(index)
                  setSelectedTenant((prev) => ({
                    ...prev,
                    [index]: tenant,
                  }))
                }
                }
                className={`hover:bg-neutral-700 cursor-pointer ${
                  (selectedTenant[index] || tenants[index]) === tenant
                    ? "bg-neutral-700"
                    : ""
                }`}
              >
                {tenant.name}
                {(selectedTenant[index] || tenants[index]) === tenant && (
                  <span className="ml-auto text-primaryOrange">●</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="gap-2 flex flex-col h-30">
        <span className="text-white">Role</span>
        <DropdownMenu key={`role_${index}`}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              disabled={isDisabled || !selectedTenant[index]}
              className="bg-neutral-700 hover:bg-neutral-600 text-white border border-neutral-600 px-4 py-2 rounded-md flex items-center gap-2 justify-between"
            >
              <Shield className="h-4 w-4" />
              {selectedRole?.name || "Select a role"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-neutral-800 border-neutral-700 text-white min-w-48">
            {roles.length > 0 ? (
              roles.map((role) => (
                <DropdownMenuItem
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`hover:bg-neutral-700 cursor-pointer ${
                    selectedRole?.id === role.id ? "bg-neutral-700" : ""
                  }`}
                >
                  {role.name}
                  {selectedRole?.id === role.id && (
                    <span className="ml-auto text-primaryOrange">●</span>
                  )}
                </DropdownMenuItem>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-neutral-400">
                No roles for this tenant
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
