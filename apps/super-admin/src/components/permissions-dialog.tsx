import { useState } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Button } from "../../../../packages/ui/src/components/shadcn/button";
import ResponsiveDialog from "../../../../packages/ui/src/components/dialog/dialog";
import EditRole from "../../../../packages/features/src/components/edit-role";
import type { RoleData } from "../../../../packages/features/src/validation/tenantValidation";
import { SuperAdminQueries } from "@/queries/super-tenant-queries";

type RolesDialogProps = {
  tenant_id: string,
  closeText: string;
  confirmText: string;
  onConfirm: (role: RoleData, selected: string[]) => Promise<void>;
};


export const RolesDialog = NiceModal.create((props: RolesDialogProps) => {
  const { tenant_id, closeText, confirmText, onConfirm } = props;
  const modal = useModal();
  const { tenantRoles } = SuperAdminQueries().tenantRoles(tenant_id);

  const [selected, setSelected] = useState<string[]>([]);
  
  const handleConfirm = async () => {
    await onConfirm(
      {
        role_name: role_name,
        role_description: role_description,
        permissions,
        is_default,
        is_system_role,
      },
      selected
    );
    modal.hide();
  };

  return (
    <ResponsiveDialog
  title="Change permissions"
  isOpen={modal.visible}
  onClose={() => modal.hide()}
  className="gap-0 md:max-w-2xl text-white px-3"
>
  {tenantRoles.map((role, index) => (
    <EditRole
      key={role.id}
      index={index}
      role={{
        role_name: role.name,
        role_description: role.description ?? "",
        permissions: role.permissions,
        is_default: role.is_default,
        is_system_role: role.is_system_role,
      }}
      showRemoveButton={false}
      isDisabled={false}
    />
  ))}

  <div className="flex justify-between gap-3 pt-4">
    <Button
      onClick={() => modal.hide()}
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
