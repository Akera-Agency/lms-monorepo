import NiceModal from "@ebay/nice-modal-react";
import {UserDialog} from "@/components/user-dialog"

export const showUserDialog = (id: string) => {
    NiceModal.show(UserDialog, {
        id, 
        closeText: "Cancel",
        confirmText: "Invite",
    });
};
