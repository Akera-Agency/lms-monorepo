import { useToast } from '../../hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';
import { CircleAlert, CircleCheck, OctagonAlert, TriangleAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

const iconMap = {
  default: CircleAlert,
  destructive: TriangleAlert,
  success: CircleCheck,
  warning: OctagonAlert,
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const Icon = iconMap[props.variant || 'default'];

        return (
          <Toast className={cn(!description && 'py-3')} key={id} {...props}>
            <div className={cn('flex gap-2', !description && 'items-center')}>
              <span className={cn('mt-0.5 flex h-10 w-fit', !description && 'mt-0 items-center')}>
                <Icon className="h-5 w-5" />
              </span>
              <div className={cn(description && 'grid gap-1')}>
                {title && <ToastTitle className="text-base">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-sm">{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
