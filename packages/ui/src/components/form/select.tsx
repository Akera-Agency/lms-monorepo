import Label from '../label/label';
import { cn } from '../../lib/utils';
import { TriangleAlert } from 'lucide-react';
import type { UseFormRegisterReturn } from 'react-hook-form';

import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Select as ShadSelect,
} from '../shadcn/select';

export type SelectItemType = {
  label: string;
  value: string;
  group?: string;
  icon?: React.ReactNode;
};

interface ISelectFieldProps {
  label?: string;
  error?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  className?: string;
  contentStyle?: string;
  triggerClassName?: string;
  items: SelectItemType[];
  disabled?: boolean;

  onChange?: (value: string) => void;
  register?: UseFormRegisterReturn;
  required?: boolean;
}

const Select = ({
  label,
  placeholder,
  defaultValue,
  value,
  items,
  className,
  contentStyle,
  // triggerClassName,
  disabled,
  onChange,
  register,
  required = false,
  ...props
}: ISelectFieldProps) => {
  const hasError = props.error !== undefined;

  const handleValueChange = (value: string) => {
    onChange?.(value);
    register?.onChange?.({ target: { value } });
  };

  const groupedItems = items.reduce(
    (acc, item) => {
      const group = item.group || 'Ungrouped';
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    },
    {} as Record<string, SelectItemType[]>,
  );

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && <Label label={label} required={required} />}
      <ShadSelect
        disabled={disabled}
        {...register}
        value={value}
        onValueChange={handleValueChange}
        defaultValue={defaultValue}
      >
        <SelectTrigger
          aria-label="select"
          className={cn(
            'border p-4 text-sm ring-0 ring-offset-background placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            className,
            hasError && 'border-destructive',
            disabled && 'bg-neutral-100',
          )}
        >
          <SelectValue
            placeholder={placeholder}
            className={cn('text-sm', !defaultValue && 'text-zinc-400')}
          />
        </SelectTrigger>
        <SelectContent className={contentStyle}>
          {Object.entries(groupedItems).map(([group, groupItems]) => (
            <SelectGroup key={group}>
              {group !== 'Ungrouped' && <SelectLabel>{group}</SelectLabel>}
              {groupItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.icon}
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </ShadSelect>
      {hasError && (
        <p className="flex items-center gap-1 text-sm font-normal text-destructive">
          <TriangleAlert className="h-4 w-4" />
          {props.error}
        </p>
      )}
    </div>
  );
};

Select.displayName = 'Select';

export { Select };
