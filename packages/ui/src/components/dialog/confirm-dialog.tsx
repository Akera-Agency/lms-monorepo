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
  DialogDescription,
} from '../shadcn/dialog';

export function ConfirmDeleteDialog({
  trigger,
  title,
  description,
  closeText,
  confirmText,
  onConfirm,
}: {
  trigger: React.ReactNode;
  title: string;
  description: string;
  closeText: string;
  confirmText: string;
  onConfirm: () => Promise<void>;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <DialogContent className="bg-neutral-950 border border-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="text-neutral-400">{description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose className="border-neutral-700 bg-neutral-800 hover:bg-neutral-900 w-1/2 cursor-pointer rounded-sm py-1">
              {closeText}
            </DialogClose>
            <DialogClose
              onClick={onConfirm}
              className="w-1/2 cursor-pointer bg-red-700 hover:bg-red-800 rounded-sm py-1"
            >
              {confirmText}
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
