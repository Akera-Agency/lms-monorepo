import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../shadcn/dialog';
import { Drawer, DrawerContent, DrawerHeader } from '../shadcn/drawer';
import { useMediaQuery } from '../../hooks/use-media-query';
import { Separator } from '../shadcn/separator';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

type TResponsiveDialogProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  isOpen?: boolean;
  onClose?: () => void;
  separator?: boolean;
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  icon?: React.ReactNode;
  showHeader?: boolean;
  dismissible?: boolean;
};

const ResponsiveDialog = ({
  children,
  title,
  description,
  isOpen = true,
  onClose,
  separator,
  className,
  headerClassName,
  titleClassName,
  descriptionClassName,
  icon,
  dismissible = true,
}: TResponsiveDialogProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleOpenChange = (open: boolean) => {
    if (!open && dismissible && onClose) {
      onClose();
    }
  };

  const renderHeader = () => (
    <div className={cn('relative z-20 flex items-center gap-2', icon && 'flex-row')}>
      {icon && <span className="flex items-center justify-center rounded-[10px]">{icon}</span>}
      <div className="flex w-full flex-col gap-0.5">
        <div className="flex justify-between">
          <DialogTitle className={cn('text-lg font-semibold', titleClassName)}>{title}</DialogTitle>
          {dismissible && (
            <X
              className="text-muted-100 h-5 w-5 cursor-pointer hover:text-neutral-800"
              onClick={onClose}
            />
          )}
        </div>
        <DialogDescription
          className={cn('text-secondary-text text-sm font-medium', descriptionClassName)}
        >
          {description}
        </DialogDescription>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className={cn('w-full px-0 sm:max-w-[45rem]', className)}>
          <DialogHeader className={headerClassName}>{renderHeader()}</DialogHeader>
          {separator && <Separator />}
          <div>{children}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className={cn('px-0 pb-5', className)}>
        <DrawerHeader className="text-left">{renderHeader()}</DrawerHeader>
        {separator && <Separator />}
        <div>{children}</div>
      </DrawerContent>
    </Drawer>
  );
};

export default ResponsiveDialog;
