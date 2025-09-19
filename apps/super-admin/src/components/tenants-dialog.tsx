import { useEffect, useState } from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from '../../../../packages/ui/src/components/shadcn/button';
import ResponsiveDialog from '../../../../packages/ui/src/components/dialog/dialog';
import { SuperAdminQueries } from '@/queries/super-tenant-queries';
import { type TenantData } from '../../../../packages/features/src/validation/tenantValidation';
import EditTenant from '../../../../packages/features/src/components/edit-tenant';

type TenantsDialogProps = {
  id: string;
  closeText: string;
  confirmText: string;
};

export const TenantsDialog = NiceModal.create((props: TenantsDialogProps) => {
  const { id, closeText, confirmText } = props;
  const modal = useModal();
  const { tenant, loading } = SuperAdminQueries().tenantById(id);
  const { updateTenant } = SuperAdminQueries();

  const [localTenantData, setLocalTenantData] = useState<TenantData>({
    name: '',
    description: '',
    logo_url: '',
    is_public: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisabled = isSubmitting || loading;

  useEffect(() => {
    if (tenant) {
      setLocalTenantData({
        id: tenant.id,
        name: tenant.name || '',
        description: tenant.description || '',
        logo_url: tenant.logo_url || '',
        is_public: tenant.is_public ?? true,
        deleted_at: tenant.deleted_at,
        created_at: tenant.created_at,
        updated_at: tenant.updated_at,
      });
      console.log(tenant);
    }
  }, [tenant]);

  const handleConfirm = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updateTenant({
        id: id,
        name: localTenantData.name,
        description: localTenantData.description ?? '',
        is_public: localTenantData.is_public,
        logo_url: localTenantData.logo_url ?? '',
      });
      modal.hide();
    } catch (error) {
      console.error('Failed to update tenant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    modal.hide();
  };

  return (
    <ResponsiveDialog
      title="Edit Tenant"
      isOpen={modal.visible}
      onClose={handleClose}
      className="gap-0 md:max-w-2xl text-white px-3"
    >
      <div className="px-6 py-4">
        <EditTenant
          isDisabled={isDisabled}
          tenantData={localTenantData}
          setTenantData={setLocalTenantData}
        />
      </div>

      <div className="flex justify-between gap-3 pt-4">
        <Button
          onClick={handleClose}
          className="border-neutral-700 bg-neutral-800 hover:bg-neutral-800/80 w-1/2 cursor-pointer rounded-sm py-1"
        >
          {closeText}
        </Button>
        <Button
          variant="destructive"
          className="w-1/2 cursor-pointer text-white rounded-sm py-1"
          onClick={handleConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </ResponsiveDialog>
  );
});

export default TenantsDialog;
