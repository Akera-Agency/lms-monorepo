import Input from "../../../../packages/ui/src/components/form/input";
import Switch from "../../../../packages/ui/src/components/switch/switch";
import { useTenantContext } from '../providers/tenant-provider';
import { TenantData } from '../validation/tenantValidation';

interface EditTenantProps {
    isDisabled: boolean;
    tenantData?: TenantData;
    setTenantData?: (data: TenantData) => void;
    errors?: any;
}

export default function EditTenant({
    isDisabled,
    tenantData: propTenantData,
    setTenantData: propSetTenantData,
    errors: propErrors
}: EditTenantProps) {

    const context = useTenantContext();
    
    const tenantData = propTenantData || context.tenantData;
    const setTenantData = propSetTenantData || context.setTenantData;
    const errors = propErrors || context.errors;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
                id="tenant_name"
                label="Tenant Name"
                placeholder="Enter tenant name..."
                labelClassName="text-white font-medium"
                className=" border-neutral-700 text-white"
                value={tenantData.name} 
                error={errors.name || errors.tenant_name}
                onChange={(e) => {
                    const value = (e.target as HTMLInputElement).value;
                    setTenantData({ ...tenantData, name: value });
                }}
                disabled={isDisabled}
            />
            <Input
                id="tenant_description"
                label="Tenant Description"
                placeholder="Enter tenant description..."
                labelClassName="text-white font-medium"
                className="border-neutral-600 text-white "
                value={tenantData.description ?? ""} 
                error={errors.description || errors.tenant_description} 
                onChange={(e) => {
                    const value = (e.target as HTMLInputElement).value;
                    setTenantData({ ...tenantData, description: value });
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
    )
}