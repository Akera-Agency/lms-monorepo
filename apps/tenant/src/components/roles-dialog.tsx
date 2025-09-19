import { useState } from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from '../../../../packages/ui/src/components/shadcn/button';
import ResponsiveDialog from '../../../../packages/ui/src/components/dialog/dialog';
import { DropdownMenu } from '../../../../packages/ui/src/components/dropdown/dropdown-menu';
import { cn } from '@ui/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useTenant } from '@/hooks/use.tenant';

type RolesDialogProps = {
  user_role: string;
  user_name: string;
  closeText: string;
  confirmText: string;
  onConfirm: (role: string) => Promise<void>;
};

export const RolesDialog = NiceModal.create(
  ({ user_role, user_name, closeText, confirmText, onConfirm }: RolesDialogProps) => {
    const modal = useModal();
    const { roles } = useTenant();
    const [selectedRole, setSelectedRole] = useState<string>(user_role);

    const handleConfirm = async () => {
      await onConfirm(selectedRole);
      modal.hide();
    };

    return (
      <ResponsiveDialog
        title={`Change role for ${user_name}`}
        isOpen={modal.visible}
        onClose={() => modal.hide()}
        className="gap-0 md:max-w-md text-white"
      >
        <div className="flex flex-col gap-3 px-6">
          <div className="text-neutral-400">
            <p className="mb-2">Select a role</p>
            <DropdownMenu
              options={
                roles.length === 0
                  ? [{ label: 'No roles', value: '' }]
                  : roles.map((role) => ({
                      label: role.name,
                      value: role.name,
                    }))
              }
              onSelect={(value) => setSelectedRole(value)}
              className="w-full bg-neutral-950 text-white border-white"
            >
              <div
                className={cn(
                  'w-full rounded-md border-white border px-3 py-2 text-white placeholder:text-neutral-500 cursor-pointer',
                  'flex items-center justify-between min-h-[40px]',
                )}
              >
                {selectedRole || 'Select a role'}
                <ChevronDown className="ml-2 size-4" />
              </div>
            </DropdownMenu>
          </div>

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
              disabled={!selectedRole}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </ResponsiveDialog>
    );
  },
);

export default RolesDialog;
