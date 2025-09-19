import { useState } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Button } from "../../../../packages/ui/src/components/shadcn/button";
import ResponsiveDialog from "../../../../packages/ui/src/components/dialog/dialog";
import { SuperAdminQueries } from "@/queries/super-tenant-queries";
import { type UserData } from "../../../../packages/features/src/validation/tenantValidation";
import { useTenantContext } from "../../../../packages/features/src/providers/tenant-provider";
import EditUser from "../../../../packages/features/src/components/edit-user";

type UserDialogProps = {
  id: string;
  closeText: string;
  confirmText: string;
};

export const UserDialog = NiceModal.create((props: UserDialogProps) => {

  const { roleId } = useTenantContext();
  const { id, closeText, confirmText } = props;
  const modal = useModal();
  const { handleAssignUserTotenant } = SuperAdminQueries();
  const { loading } = SuperAdminQueries().tenants();
  const { tenantRoles } = SuperAdminQueries().tenantRoles(id ?? "");

  const [localUserData, setLocalUserData] = useState<UserData>({
    email:""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisabled = isSubmitting || loading;

  const handleInvite = async () => {
    // const validationErrors = validateTenantForm({ tenantData, roles });
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   return;
    // }

    setIsSubmitting(true);
    try {
      await handleAssignUserTotenant({
        email: localUserData.email,
        tenantId: id ?? "",
        roleId: roleId ?? ""
      });

      setLocalUserData({
        email:""
      });

      modal.hide();
    } catch (err) {
      console.error("Error inviting user:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    modal.hide();
  };

  return (
    <ResponsiveDialog
      title="Invite user"
      isOpen={modal.visible}
      onClose={handleClose}
      className="gap-0 md:max-w-2xl text-white px-3"
    >
      <div className="px-6 py-4">
        <EditUser
          isDisabled={isDisabled}
          userData={localUserData}
          setUserData={setLocalUserData}
          roles={tenantRoles}
          usage="edit"
        />
      </div>

      <div className="flex justify-between gap-3 pt-4">
        <Button
          disabled={isDisabled}
          onClick={handleClose}
          className="border-neutral-700 bg-neutral-800 hover:bg-neutral-800/80 w-1/2 cursor-pointer rounded-sm py-1"
        >
          {closeText}
        </Button>
        <Button
          disabled={isDisabled}
          variant="destructive"
          className="w-1/2 cursor-pointer text-white rounded-sm py-1"
          onClick={handleInvite}
        >
          {confirmText}
        </Button>
      </div>
    </ResponsiveDialog>
  );
});

export default UserDialog;