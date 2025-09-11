import NiceModal from "@ebay/nice-modal-react";
import PermissionsDialog from "@/components/permissions-dialog";

export const showPermissionsDialog = (roleName: string, currentPermissions: string[]) => {
  NiceModal.show(PermissionsDialog, {
    role_permissions: currentPermissions,
    closeText: "Cancel",
    confirmText: "Change",
    role_name: roleName,
    permissions: ["Create", "Read", "Update", "Delete"],
    onConfirm: async (role: string, selected: string[]) => {
      console.log("Changed role:", role, "with permissions:", selected);
    },
  });
};