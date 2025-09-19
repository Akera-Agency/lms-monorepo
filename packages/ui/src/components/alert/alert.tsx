import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronRight, CircleAlert, OctagonAlert, CircleCheck, TriangleAlert } from 'lucide-react';

const variants = {
  default: ' bg-background ',
  success:
    'border-alert-success/50 bg-alert-bg-success text-alert-success dark:border-alert-success [&>svg]:text-alert-success',
  warning:
    'border-alert-border-warning bg-alert-bg-warning text-alert-warning [&>svg]:text-alert-warning',
  destructive:
    'bg-alert-bg-destructive border-alert-border-destructive text-alert-destructive  [&>svg]:text-alert-destructive',
};
const alertVariants = cva('rounded-md border ps-5 p-4', {
  variants: {
    variant: variants,
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title: string;
  description: string;
  redirectTo?: string;
  redirectText?: string;
  onClose?: () => void;
  dismissable?: boolean;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({
    className,
    variant,
    title,
    description,
    redirectTo,
    redirectText,
    onClose,
    dismissable = true,
    ...props
  }) => {
    return (
      <div className={cn(alertVariants({ variant }), className)} {...props}>
        <div className={cn('flex gap-2', !description && 'items-center')}>
          <span className={cn('mt-0.5 flex h-10 w-fit', !description && 'mt-0 items-center')}>
            {variant == 'default' && <CircleAlert className="h-5 w-5" />}
            {variant == 'warning' && <OctagonAlert className="h-5 w-5" />}
            {variant == 'success' && <CircleCheck className="h-5 w-5" />}
            {variant == 'destructive' && <TriangleAlert className="h-5 w-5" />}
          </span>
          <div className={cn(description && '', 'w-full')}>
            <div className="flex w-full justify-between">
              <div className="primary-text text-base" style={{ fontSize: '500' }}>
                {title}
              </div>
              {dismissable && (
                <div
                  className="mt-2 cursor-pointer font-semibold text-secondary-foreground"
                  onClick={onClose}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M15 5L5 15M5 5L15 15"
                      stroke="#737373"
                      //stroke-width
                      // stroke-linejoin="round"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>{' '}
                </div>
              )}
            </div>
            {description && <div className="text-sm text-neutral-500">{description}</div>}
            {redirectTo && (
              <a
                href={redirectTo}
                className="inline-flex h-5 items-center justify-center gap-1 overflow-hidden rounded-md text-sm font-medium leading-tight text-primary"
              >
                {redirectText}
                <ChevronRight />
              </a>
            )}
          </div>
        </div>
        <div />
      </div>
    );
  },
);

Alert.displayName = 'Alert';

export { Alert, alertVariants, variants };
