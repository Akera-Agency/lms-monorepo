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
}: TResponsiveDialogProps) => {
  const isDesktop = useMediaQuery('(min-width: 834px)');

  const renderHeader = () => (
    <div className={cn('relative z-20 flex gap-2', icon && 'flex-row')}>
      {icon && (
        <span className="flex h-12 w-14 items-center justify-center rounded-[10px] border">
          {icon}
        </span>
      )}
      <div className="flex w-full flex-col gap-0.5">
        <div className="flex justify-between">
          <DialogTitle className={cn('text-lg font-semibold', titleClassName)}>
            {title}
          </DialogTitle>
          <X
            className="h-5 w-5 cursor-pointer text-muted-100 hover:text-neutral-800"
            onClick={onClose}
          />
        </div>
        <DialogDescription
          className={cn(
            'text-sm font-medium text-secondary-text',
            descriptionClassName
          )}
        >
          {description}
        </DialogDescription>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        {/* <DialogContent className={cn("px-0 sm:max-w-[38.75rem]", className)}> */}
        <DialogContent
          className={cn('w-full px-0 sm:max-w-[45rem]', className)}
        >
          <DialogHeader className={cn('px-5 pb-3', headerClassName)}>
            {renderHeader()}
          </DialogHeader>
          {separator && <Separator />}
          <div className="px-5">{children}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className={cn('px-0 pb-5', className)}>
        <DrawerHeader className="px-5 text-left">{renderHeader()}</DrawerHeader>
        {separator && <Separator />}
        <div className="px-5">{children}</div>
      </DrawerContent>
    </Drawer>
  );
};

export default ResponsiveDialog;
