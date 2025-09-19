import { Button } from "../../../ui/src/components/button/button";
import Input from "../../../../packages/ui/src/components/form/input";
import Switch from "../../../../packages/ui/src/components/switch/switch";
import Radio from "../../../../packages/ui/src/components/checkbox/radio";
import {
  PermissionOption,
  permissionOptions,
  type Resource,
  resourceList,
  type RoleData,
} from "../validation/tenantValidation";
import { Trash2, ChevronDown, Settings, TriangleAlert } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/src/components/shadcn/dropdown-menu";
import { useTenantContext } from "../providers/tenant-provider";

interface EditRoleProps {
  index?: number;
  isDisabled: boolean;
  role?: RoleData | undefined;
  usage: 'create' | 'edit';
  localRoles?: RoleData[];
  setLocalRoles?: (roles: RoleData[]) => void;
  localSelectedResource?: { [key: number]: Resource };
  setLocalSelectedResource?: (resources: { [key: number]: Resource }) => void;
  localErrors?: any;
  handleRemove?: (id: string) => void 
}

export default function EditRole({
  index,
  isDisabled,
  role,
  usage,
  localRoles,
  setLocalRoles,
  localSelectedResource,
  setLocalSelectedResource,
  localErrors,
  handleRemove
}: EditRoleProps) {

  const context = useTenantContext();
  
  const errors = localErrors || context.errors;
  const selectedResource = localSelectedResource || context.selectedResource;
  const setSelectedResource = setLocalSelectedResource || context.setSelectedResource;
  const roles = localRoles || context.roles;
  const setRoles = setLocalRoles || context.setRoles;

  const handleRoleChange = (
    roleIndex: number,
    field: keyof RoleData,
    value: any
  ) => {
    const updated = [...roles];
    updated[roleIndex] = { ...updated[roleIndex], [field]: value };
    setRoles(updated);
  };

  const togglePermission = (
    roleIndex: number,
    resource: Resource,
    perm: PermissionOption
  ) => {
    const updated = [...roles];
    const current = updated[roleIndex].permissions[resource];
    updated[roleIndex].permissions[resource] = current.includes(perm)
      ? current.filter((p) => p !== perm)
      : [...current, perm];
    setRoles(updated);
  };

  const removeRole = (roleIndex: number, roleId: string) => {
    usage === 'create' ?
    setRoles(roles.filter((_, i) => i !== roleIndex)) :
    handleRemove ? handleRemove(roleId) : null
  };
  

  if (index === undefined || !role) {
    return null; 
  }

  return (
    <div
      key={index}
      className="border border-neutral-700 rounded-md p- space-y-4 relative group hover:border-neutral-500 transition-colors duration-200"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">
          {usage === 'create' ? `Role ${index + 1}` : role.name}
        </h3>

        {(roles.length > 1 || usage === 'edit' )&&(
          <Button
            type="button"
            onClick={() => removeRole(index, role.id ?? "")}
            disabled={isDisabled}
            className="bg-red-600/50 hover:bg-red-600 text-white/50 hover:text-white p-2 rounded-md transition-all duration-200 "
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Input
          id={`name_${index}`}
          label="Role Name"
          placeholder="Enter role name..."
          labelClassName="text-white font-medium"
          className="border-neutral-700 text-white"
          value={role.name}
          error={errors.roles?.[index]?.name || errors.roles?.[index]?.role_name}
          onChange={(e) => {
            const value = (e.target as HTMLInputElement).value;
            handleRoleChange(index, "name", value);
          }}
          disabled={isDisabled}
        />

        <Input
          id={`description_${index}`}
          label="Role Description"
          placeholder="Enter role description..."
          labelClassName="text-white font-medium"
          className="border-neutral-700 text-white"
          value={role.description ?? ""}
          error={errors.roles?.[index]?.description || errors.roles?.[index]?.role_description}
          onChange={(e) => {
            const value = (e.target as HTMLInputElement).value;
            handleRoleChange(index, "description", value);
          }}
          disabled={isDisabled}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between sm:flex-row flex-col gap-4">
          <h4 className="text-white font-semibold">Permissions</h4>
          <DropdownMenu key={`resource_${index}`}>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                disabled={isDisabled}
                className="bg-neutral-700 hover:bg-neutral-600 text-white border border-neutral-600 px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                {(selectedResource[index] || resourceList[0])
                  .replace("_", " ")
                  .replace(/^\w/, (c) => c.toUpperCase())}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-neutral-800 border-neutral-700 text-white min-w-48">
              {resourceList.map((resource) => (
                <DropdownMenuItem
                  key={resource}
                  onClick={() =>
                  { setSelectedResource({
                      ...selectedResource,
                      [index]: resource,
                    });
                    }
                  }
                  className={`hover:bg-neutral-700 cursor-pointer ${
                    (selectedResource[index] || resourceList[0]) === resource
                      ? "bg-neutral-700"
                      : ""
                  }`}
                >
                  {resource.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())}
                  {(selectedResource[index] || resourceList[0]) === resource && (
                    <span className="ml-auto text-primaryOrange">●</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {errors.roles?.[index]?.permissions && (
          <p className="flex items-center gap-1 text-sm font-semibold text-destructive">
            <TriangleAlert className="h-4 w-4" />
            {errors.roles[index].permissions}
          </p>
        )}

        <div className="border border-neutral-600 rounded-lg p-4 space-y-3 bg-neutral-800/30">
          <h5 className="text-white font-medium capitalize">
            {(selectedResource[index] || resourceList?.[0] || "").replace(
              "_",
              " "
            )}{" "}
            Permissions
          </h5>

          <div className="flex flex-wrap gap-3">
            {permissionOptions.map((perm) => {
              const inputId = `role_${index}_${selectedResource[index]}_${perm}`;
              return (
                <label
                  htmlFor={inputId}
                  key={perm}
                  onClick={() =>
                    selectedResource[index] &&
                    togglePermission(index, selectedResource[index] as Resource, perm)
                  }
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-all duration-200 ${
                    selectedResource[index] &&
                    role.permissions[selectedResource[index] as Resource]?.includes(
                      perm
                    )
                      ? "bg-neutral-900 border-neutral-500 text-neutral-300"
                      : "border-neutral-700 text-gray-300 hover:border-gray-500"
                  }`}
                >
                  <Radio
                    id={inputId}
                    title=""
                    checked={
                      selectedResource[index]
                        ? role.permissions[selectedResource[index] as Resource]?.includes(
                            perm
                          ) || false
                        : false
                    }
                    disabled={isDisabled || !selectedResource[index]}
                  />
                  <span className="text-sm font-medium">{perm}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 pt-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <Switch
            id={`is_default_${index}`}
            label=""
            checked={role.is_default}
            onCheckedChange={(checked) =>
              handleRoleChange(index, "is_default", checked)
            }
            className="sr-only"
          />
          <div
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              role.is_default ? "bg-primaryOrange" : "bg-neutral-600"
            } ${isDisabled ? "opacity-50" : ""}`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                role.is_default ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
          <span className="text-gray-300 text-sm font-medium">Default Role</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <Switch
            id={`is_system_role_${index}`}
            label=""
            checked={role.is_system_role}
            onCheckedChange={(checked) =>
              handleRoleChange(index, "is_system_role", checked)
            }
            className="sr-only"
          />
          <div
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              role.is_system_role ? "bg-primaryOrange" : "bg-neutral-600"
            } ${isDisabled ? "opacity-50" : ""}`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                role.is_system_role ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
          <span className="text-gray-300 text-sm font-medium">System Role</span>
        </label>
      </div>
    </div>
  );
}