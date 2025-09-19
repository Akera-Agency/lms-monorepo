import { useState } from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from '../../../../packages/ui/src/components/shadcn/button';
import ResponsiveDialog from '../../../../packages/ui/src/components/dialog/dialog';
import EditRole from '../../../../packages/features/src/components/edit-role';
import { SuperAdminQueries } from '@/queries/super-tenant-queries';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/components/shadcn/dropdown-menu';
import { ChevronDown, Shield } from 'lucide-react';
import {
  type Resource,
  resourceList,
  type FormErrors,
} from '../../../../packages/features/src/validation/tenantValidation';

type RolesDialogProps = {
  tenant_id: string;
  closeText: string;
  confirmText: string;
};

export const RolesDialog = NiceModal.create((props: RolesDialogProps) => {
  const { tenant_id, closeText, confirmText } = props;
  const { updateTenantRole, deleteTenantRole } = SuperAdminQueries();
  const { tenantRoles, loading } = SuperAdminQueries().tenantRoles(tenant_id);
  const modal = useModal();

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedResource, setSelectedResource] = useState<{ [key: number]: Resource }>({
    0: resourceList[0],
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const selectedRole = selectedRoleId
    ? tenantRoles.find((role) => role.id === selectedRoleId) || null
    : null;
  const selectedRoleIndex = selectedRoleId
    ? tenantRoles.findIndex((role) => role.id === selectedRoleId)
    : -1;
  const isDisabled = isSubmitting || loading;

  const handleConfirm = async () => {
    if (!selectedRole) return;
    setIsSubmitting(true);
    try {
      await updateTenantRole({
        tenant_id,
        id: selectedRole.id ?? '',
        name: selectedRole.name,
        description: selectedRole.description ?? '',
        permissions: selectedRole.permissions,
        is_default: selectedRole.is_default,
        is_system_role: selectedRole.is_system_role,
      });
      modal.hide();
      setSelectedRoleId(null);
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    modal.hide();
    setSelectedRoleId(null);
  };

  const handleRemoveRole = async () => {
    if (!selectedRole?.tenant_id || !selectedRole?.id) {
      console.error('Cannot delete role: missing required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await deleteTenantRole({ tenant_id: selectedRole.tenant_id, id: selectedRole.id });
      modal.hide();
      setSelectedRoleId(null);
    } catch (error) {
      console.error('Failed to delete role:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ResponsiveDialog
      title="Edit Roles"
      isOpen={modal.visible}
      onClose={handleClose}
      className="gap-0 md:max-w-2xl text-white px-3"
    >
      <div className="flex justify-end mb-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              className="bg-neutral-700 hover:bg-neutral-600 text-white border border-neutral-600 px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              {selectedRole
                ? selectedRole.name.replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase())
                : 'Select Role'}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-neutral-800 border-neutral-700 text-white min-w-48">
            {tenantRoles.map((role) => (
              <DropdownMenuItem
                key={role.id}
                onClick={() => setSelectedRoleId(role.id || null)}
                className={`hover:bg-neutral-700 cursor-pointer ${
                  selectedRoleId === role.id ? 'bg-neutral-700' : ''
                }`}
              >
                {role.name.replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase())}
                {selectedRoleId === role.id && (
                  <span className="ml-auto text-primaryOrange">●</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedRole && selectedRoleIndex !== -1 && (
        <EditRole
          usage="edit"
          index={selectedRoleIndex}
          role={selectedRole}
          isDisabled={isDisabled}
          localSelectedResource={selectedResource}
          setLocalSelectedResource={setSelectedResource}
          localErrors={errors}
          handleRemove={handleRemoveRole}
        />
      )}

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

export default RolesDialog;
