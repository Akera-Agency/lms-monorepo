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
import { useState } from "react";

interface EditUserProps {
    isDisabled: boolean;
    userData?: UserData;
    setUserData?: (data: UserData) => void;
    tenants: TenantData[];
    roles: RoleData[];
    errors?: any;
  }

  export default function EditUser({
    isDisabled,
    userData: propUserData,
    setUserData: propSetUserData,
    errors: propErrors,
    tenants,
    roles,
  }: EditUserProps) {
    const context = useTenantContext();

  const userData = propUserData || context.userData;
  const setUserData = propSetUserData || context.setUserData;
  const errors = propErrors || context.errors;

  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<TenantData | null>(null);

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

      <div className="gap-2 flex flex-col h-30">
        <span className="text-white">Tenant</span>
        <DropdownMenu key="tenant">
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              disabled={isDisabled}
              className="bg-neutral-700 hover:bg-neutral-600 text-white border border-neutral-600 px-4 py-2 rounded-md flex items-center gap-2 justify-between"
            >
              <University className="h-4 w-4" />
              {selectedTenant?.name ||
                "Select a tenant"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-neutral-800 border-neutral-700 text-white min-w-48">
            {tenants.map((tenant, index) => (
              <DropdownMenuItem
                key={tenant.id}
                onClick={() =>
                { context.setTenantId(tenant.id), setSelectedTenant(tenant) }
                }
                className={`hover:bg-neutral-700 cursor-pointer ${
                  (selectedTenant) === tenant
                    ? "bg-neutral-700"
                    : ""
                }`}
              >
                {tenant.name}
                {(selectedTenant) === tenant && (
                  <span className="ml-auto text-primaryOrange">●</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="gap-2 flex flex-col h-30">
        <span className="text-white">Role</span>
        <DropdownMenu key="role">
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              disabled={isDisabled || !selectedTenant}
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
                  onClick={() =>{ setSelectedRole(role), context.setRoleId(role.id) }}
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
