import { useState } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Button } from "../../../../packages/ui/src/components/shadcn/button";
import ResponsiveDialog from "../../../../packages/ui/src/components/dialog/dialog";
import Switch from "../../../../packages/ui/src/components/switch/switch";

type PermissionsDialogProps = {
  role_permissions: string[];
  permissions: string[];
  role_name: string;
  closeText: string;
  confirmText: string;
  onConfirm: (role: string, selected: string[]) => Promise<void>;
};

export const PermissionsDialog = NiceModal.create(
  ({
    role_permissions,
    permissions,
    role_name,
    closeText,
    confirmText,
    onConfirm,
  }: PermissionsDialogProps) => {
    const modal = useModal();
    const [selected, setSelected] = useState<string[]>(role_permissions);

    const togglePermission = (permission: string, checked: boolean) => {
      setSelected((prev) =>
        checked ? [...prev, permission] : prev.filter((p) => p !== permission)
      );
    };

    const handleConfirm = async () => {
      await onConfirm(role_name, selected);
      modal.hide();
    };

    return (
      <ResponsiveDialog
        title={`Change permissions for ${role_name}`}
        isOpen={modal.visible}
        onClose={() => modal.hide()}
        className="gap-0 md:max-w-md"
      >
        <div className="flex flex-col gap-3 px-6">
          {permissions.map((permission) => (
            <div
              key={permission}
              className="text-neutral-400 flex flex-row justify-between items-center"
            >
              <p className="mb-2">{permission}</p>
              <Switch
                checked={selected.includes(permission)}
                onCheckedChange={(checked) =>
                  togglePermission(permission, checked)
                }
                className="data-[state=checked]:bg-[#F3562E] bg-neutral-800"
                thumbClassName="data-[state=checked]:bg-white"
              />
            </div>
          ))}

          <div className="flex justify-between gap-3 pt-4">
            <Button variant="outline" onClick={() => modal.hide()}>
              {closeText}
            </Button>
            <Button
              variant="destructive"
              className="w-1/2"
              onClick={handleConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </ResponsiveDialog>
    );
  }
);

export default PermissionsDialog;
