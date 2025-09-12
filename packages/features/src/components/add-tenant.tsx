
import React from 'react'
import Input from "../../../../packages/ui/src/components/form/input";
import Switch from "../../../../packages/ui/src/components/switch/switch";
import { University } from 'lucide-react';
import { useTenantContext } from '../providers/tenant-provider';

interface AddTenantProps {
  isDisabled: boolean
}

export default function AddTenant({
  isDisabled
}: AddTenantProps) {

const {errors, tenantData, setTenantData} = useTenantContext();

return (
  <div className="backdrop-blur-sm border border-neutral-700 rounded-xl p-6 space-y-6 bg-neutral-800/20">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-neutral-500/20 rounded-md">
        <University className="h-5 w-5 text-neutral-400" />
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

        <label className="flex items-center gap-3 cursor-pointer">
          <Switch
            id="is_public"
            label=""
            checked={tenantData.is_public}
            onCheckedChange={(checked) =>
              setTenantData({ ...tenantData, is_public: checked })
            }
            className="sr-only"
          />
          <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
            tenantData.is_public ? 'bg-[#F3562E]' : 'bg-neutral-600'
          } ${isDisabled ? 'opacity-50' : ''}`}>
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
              tenantData.is_public ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </div>
          <span className="text-gray-300 text-sm font-medium">Public tenant</span>
        </label>
      </div>
  </div>
)}
