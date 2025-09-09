import { useSuperAdmin } from "@/hooks/use.super-tenant";
import { Button } from "@ui/components/button/button";
import { useState } from "react";
import Input from "../../../../packages/ui/src/components/form/input";
import Switch from "../../../../packages/ui/src/components/switch/switch";
import Radio from "../../../../packages/ui/src/components/checkbox/radio";
import { validateTenantForm } from "@/utils/validation/tenantValidation";
import { useToastNotifications } from "@/hooks/use.toast-notification";
import { Plus, Trash2, Users, Shield } from 'lucide-react';

export default function CreateTenant() {
  const { successMessage, error, handleCreateTenant, loading } = useSuperAdmin();
  const [tenantData, setTenantData] = useState({
    tenant_name: "",
    tenant_description: "",
    logo_url: "",
    is_public: true
  });

  const [roles, setRoles] = useState([
    {
      role_name: "",
      role_description: "",
      permissions: [] as string[],
      is_default: true,
      is_system_role: false,
    },
  ]);

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useToastNotifications({ successMessage, error });

  const permissionOptions = ["Create", "Read", "Update", "Delete"];

  const handleRoleChange = (index: number, field: keyof typeof roles[0], value: any) => {
    const updated = [...roles];
    updated[index] = { ...updated[index], [field]: value };
    setRoles(updated);
  };

  const togglePermission = (index: number, permission: string) => {
    const updated = [...roles];
    const exists = updated[index].permissions.includes(permission);
    updated[index].permissions = exists
      ? updated[index].permissions.filter((p) => p !== permission)
      : [...updated[index].permissions, permission];
    setRoles(updated);
  };

  const addRole = () => {
    setRoles((prev) => [
      ...prev,
      {
        role_name: "",
        role_description: "",
        permissions: [],
        is_default: false,
        is_system_role: false,
      },
    ]);
  };

  const removeRole = (index: number) => {
    setRoles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const validationErrors = validateTenantForm({ ...tenantData, roles });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await handleCreateTenant(
        tenantData.tenant_name.trim(),
        tenantData.is_public,
        roles.map((r) => ({
          roleName: r.role_name.trim(),
          permissions: r.permissions,
          is_default: r.is_default,
          is_system_role: r.is_system_role,
          role_description: r.role_description?.trim(),
        })),
        tenantData.tenant_description.trim(),
        tenantData.logo_url?.trim()
      );

      setTenantData({ tenant_name: "", tenant_description: "", logo_url: "", is_public: true});
      setRoles([
        {
          role_name: "",
          role_description: "",
          permissions: [],
          is_default: true,
          is_system_role: false,
        },
      ]);
      setErrors({});
    } catch (err) {
      console.error("Error creating tenant:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || loading;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen py-8 px-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Tenant</h1>
          <p className="text-gray-400 text-base">
            Enter the tenant details and assign one or many roles
          </p>
        </div>

        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          noValidate
        >
          <div className="backdrop-blur-sm border border-neutral-700 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-neutral-500/20 rounded-md">
                <Users className="h-5 w-5 text-neutral-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Tenant Information</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                id="tenant_name"
                label="Tenant Name"
                placeholder="Enter tenant name..."
                labelClassName="text-white font-medium"
                className=" border-neutral-700 text-white"
                value={tenantData.tenant_name}
                error={errors.tenant_name}
                onChange={(e) => {
                  const value = (e.target as HTMLInputElement).value;
                  setTenantData({ ...tenantData, tenant_name: value });
                }}
                disabled={isDisabled}
              />
              <Input
                id="tenant_description"
                label="Tenant Description"
                placeholder="Enter tenant description..."
                labelClassName="text-white font-medium"
                className="border-neutral-600 text-white "
                value={tenantData.tenant_description}
                error={errors.tenant_description}
                onChange={(e) => {
                  const value = (e.target as HTMLInputElement).value;
                  setTenantData({ ...tenantData, tenant_description: value });
                }}
                disabled={isDisabled}
              />
            </div>
          </div>

          <div className="backdrop-blur-sm border border-neutral-700 rounded-xl p-6 space-y-6">
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
                    : 'bg-gradient-to-r from-[#F3562E] to-[#e94e26] hover:from-transparent hover:to-transparent border-2 border-transparent hover:border-[#F3562E] hover:text-[#F3562E] shadow-lg hover:shadow-[#F3562E]/25 active:scale-95'
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
                  className="border border-neutral-700 rounded-md p-5 space-y-4 relative group hover:border-neutral-500 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white">
                      Role {index + 1}
                    </h3>
                    
                    {roles.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeRole(index)}
                        disabled={isDisabled}
                        className="bg-red-600/50 hover:bg-red-600 text-white/50 hover:text-white p-2 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Input
                      id={`role_name_${index}`}
                      label="Role Name"
                      placeholder="Enter role name..."
                      labelClassName="text-white font-medium"
                      className="border-neutral-700 text-white"
                      value={role.role_name}
                      error={errors[`role_name_${index}`]}
                      onChange={(e) =>{
                        const value = (e.target as HTMLInputElement).value;
                        handleRoleChange(index, "role_name", value)
                      }}
                      disabled={isDisabled}
                    />
                    
                    <Input
                      id={`role_description_${index}`}
                      label="Role Description"
                      placeholder="Enter role description..."
                      labelClassName="text-white font-medium"
                      className="border-neutral-700 text-white"
                      value={role.role_description}
                      error={errors[`role_description_${index}`]}
                      onChange={(e) =>{
                        const value = (e.target as HTMLInputElement).value; 
                        handleRoleChange(index, "role_description", value)}}
                      disabled={isDisabled}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-white font-medium text-sm">Permissions</label>
                    <div className="flex flex-wrap gap-3">
                      {permissionOptions.map((perm) => (
                        <label
                          key={perm}
                          onClick={() => togglePermission(index, perm)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-all duration-200 ${
                            role.permissions.includes(perm)
                              ? 'bg-neutral-900 border-neutral-500 text-neutral-300'
                              : ' border-neutral-700 text-gray-300 hover:border-gray-500'
                          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Radio
                            title=""
                            checked={role.permissions.includes(perm)}
                            disabled={isDisabled}
                          />
                          <span className="text-sm font-medium">{perm}</span>
                        </label>
                      ))}
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
                      <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                        role.is_default ? 'bg-[#F3562E]' : 'bg-neutral-600'
                      } ${isDisabled ? 'opacity-50' : ''}`}>
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                          role.is_default ? 'translate-x-6' : 'translate-x-0'
                        }`} />
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
                      <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                        role.is_system_role ? 'bg-[#F3562E]' : 'bg-neutral-600'
                      } ${isDisabled ? 'opacity-50' : ''}`}>
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                          role.is_system_role ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </div>
                      <span className="text-gray-300 text-sm font-medium">System Role</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={isDisabled}
              className={`px-12 py-4 text-base font-semibold rounded-md transition-all duration-300 ${
                isDisabled
                  ? 'bg-neutral-500 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-[#F3562E] to-[#e94e26] hover:from-transparent hover:to-transparent border-2 border-transparent hover:border-[#F3562E] hover:text-[#F3562E] shadow-lg hover:shadow-[#F3562E]/25 active:scale-95'
              }`}
            >
              {isSubmitting || loading ? (
                <span className="flex items-center gap-3">
                  <svg 
                    className="animate-spin h-5 w-5" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Tenant...
                </span>
              ) : (
                'Create Tenant'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}