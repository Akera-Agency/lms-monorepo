import {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
  } from "../../../../packages/ui/src/components/shadcn/dialog";
  import {DropdownMenu} from '../../../../packages/ui/src/components/dropdown/dropdown-menu';
import { cn } from "@ui/lib/utils";
import { ChevronDown } from "lucide-react";
import { useTenant } from "@/hooks/use.tenant";
  
  export function RolesDialog({
    trigger,
    user_role,
    user_name,
    closeText,
    confirmText,
    onConfirm,
  }: {
    trigger: React.ReactNode;
    user_role: string;
    user_name: string;
    closeText: string;
    confirmText: string;
    onConfirm: (role: string) => Promise<void>;
  }) {
    const {roles} = useTenant();
  
    return (
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <DialogContent className="bg-neutral-950 border border-neutral-800 text-white max-w-md rounded-md">
            <DialogHeader>
              <DialogTitle>
                Change role for{" "}
                <span className="font-bold text-[#F3562E]">{user_name}</span>
              </DialogTitle>
            </DialogHeader>
  
            <div className="text-neutral-400 mt-3">
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
                className="w-full bg-neutral-950 text-white border-white" 
              >
                <div
                  className={cn(
                  'w-full rounded-md border-white border px-3 py-2 text-white placeholder:text-neutral-500 cursor-pointer',
                  'flex items-center justify-between min-h-[40px]' 
                  )}
                >
                  {user_role || 'Select a role'}
                  <ChevronDown className="ml-2 size-4" />
                </div>
              </DropdownMenu>
            </div>
  
            <DialogFooter className="flex gap-2 mt-6">
              <DialogClose asChild>
                <button className="border-neutral-700 bg-neutral-800 hover:bg-neutral-900 w-1/2 cursor-pointer rounded-sm py-1">
                  {closeText}
                </button>
              </DialogClose>
  
              <DialogClose asChild>
                <button
                  onClick={() => onConfirm(user_role)}
                  className="w-1/2 cursor-pointer bg-red-700 hover:bg-red-800 rounded-sm py-1"
                >
                  {confirmText}
                </button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );
  }
  