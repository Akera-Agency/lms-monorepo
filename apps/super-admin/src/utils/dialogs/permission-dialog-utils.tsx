import NiceModal from "@ebay/nice-modal-react";
import RolesDialog from "@/components/permissions-dialog";

export const showRolessDialog = (tenant_id: string) => {
  NiceModal.show(RolesDialog, {
    tenant_id, 
    closeText: "Cancel",
    confirmText: "Change",
    onConfirm: async (updatedRole, selected) => {
      console.log("Changed role:", updatedRole, "with permissions:", selected);
    },
  });
};
