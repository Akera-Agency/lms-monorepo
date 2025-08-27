import { Checkbox as ShadCheckbox } from '../shadcn/checkbox';

import useUniqueId from '../../hooks/use-unique-id';
import { cn } from '../../lib/utils';

type CheckboxProps = {
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  checked?: boolean;
  labelStyle?: string;
  onCheckedChange?: (checked: boolean) => void;
};

const Checkbox = ({
  label,
  description,
  disabled,
  className,
  checked,
  labelStyle,
  onCheckedChange,
}: CheckboxProps) => {
  const checkboxId = useUniqueId();
  return (
    <div className="flex items-start justify-start gap-2">
      <ShadCheckbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        id={checkboxId[0]}
        className={cn(
          'mt-0.5 h-4 w-4 rounded-sm border border-border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
          className
        )}
      />
      {label && (
        <div
          className={cn(
            'flex flex-col items-end gap-1',
            disabled && 'text-zinc-400'
          )}
        >
          <label
            htmlFor={checkboxId[0]}
            className={cn('text-sm font-medium', labelStyle)}
          >
            {label}
          </label>
          <p
            className={cn(
              'text-sm font-normal text-secondary-text',
              disabled && 'text-zinc-400'
            )}
          >
            {description}
          </p>
        </div>
      )}
    </div>
  );
};

export default Checkbox;
