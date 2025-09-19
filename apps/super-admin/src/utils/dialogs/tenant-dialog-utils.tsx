import NiceModal from "@ebay/nice-modal-react";
import {TenantsDialog} from "@/components/tenant-dialog"

export const showTenantsDialog = (id: string) => {
  NiceModal.show(TenantsDialog, {
    id, 
    closeText: "Cancel",
    confirmText: "Change",
  });
};
