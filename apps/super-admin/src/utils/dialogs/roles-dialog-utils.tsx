import NiceModal from '@ebay/nice-modal-react';
import RolesDialog from '@/components/roles-dialog';

export const showRolesDialog = (tenant_id: string) => {
  NiceModal.show(RolesDialog, {
    tenant_id,
    closeText: 'Cancel',
    confirmText: 'Change',
  });
};
