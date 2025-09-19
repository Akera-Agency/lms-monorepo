import { SuperAdminQueries } from '@/queries/super-tenant-queries';
import { Button } from '@ui/components/button/button';
import {
  validateTenantForm,
  createEmptyPermissions,
} from '../../../../packages/features/src/validation/tenantValidation';
import { useToastNotifications } from '../../../../packages/features/src/hooks/use.toast-notification';
import AddTenant from '../../../../packages/features/src/components/add-tenant';
import AddRoles from '../../../../packages/features/src/components/add-roles';
import { useTenantContext } from '../../../../packages/features/src/providers/tenant-provider';

export default function CreateTenant() {
  const { setErrors, tenantData, setTenantData, roles, setRoles, isSubmitting, setIsSubmitting } =
    useTenantContext();

  const { successMessage, handleCreateTenant } = SuperAdminQueries();
  const { error, loading } = SuperAdminQueries().tenants();

  useToastNotifications({ successMessage, error });

  const isDisabled = isSubmitting || loading;

  const handleSubmit = async () => {
    const validationErrors = validateTenantForm({ tenantData, roles });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await handleCreateTenant({
        tenantName: tenantData.name.trim(),
        is_public: tenantData.is_public,
        roles: roles.map((r) => ({
          roleName: r.name.trim(),
          permissions: r.permissions,
          is_default: r.is_default,
          is_system_role: r.is_system_role,
          roleDescription: r.description?.trim(),
        })),
        tenantDescription: tenantData.description?.trim(),
      });

      setTenantData({ name: '', description: '', logo_url: '', is_public: true });
      setRoles([
        {
          name: '',
          description: '',
          permissions: createEmptyPermissions(),
          is_default: true,
          is_system_role: false,
        },
      ]);
      setErrors({});
    } catch (err) {
      console.error('Error creating tenant:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <AddTenant isDisabled={isDisabled} />

          <AddRoles isDisabled={isDisabled} />
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={isDisabled}
              className={`px-12 py-4 text-base font-semibold rounded-md transition-all duration-300 ${
                isDisabled
                  ? 'bg-neutral-500 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-primaryOrange to-[#e94e26] hover:from-transparent hover:to-transparent border-2 border-transparent hover:border-primaryOrange hover:text-primaryOrange shadow-lg hover:shadow-primaryOrange/25 active:scale-95'
              }`}
            >
              {isSubmitting || loading ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
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
