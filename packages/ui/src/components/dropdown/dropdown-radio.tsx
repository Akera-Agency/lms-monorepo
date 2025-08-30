import { cn } from '../../lib/utils';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { motion } from 'framer-motion';
import * as React from 'react';

type DropdownRadioOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type IDropdownRadioProps = {
  children: React.ReactNode;
  options: DropdownRadioOption[];
  onValueChange?: (value: string) => void;
  className?: string;
  label?: string;
  defaultValue?: string;
  align?: 'start' | 'end';
};

const DropdownRadio = ({
  children,
  options,
  onValueChange,
  className,
  label,
  defaultValue,
  align = 'start',
}: IDropdownRadioProps) => {
  const [value, setValue] = React.useState(defaultValue);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        {children}
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <DropdownMenuPrimitive.Content
            className={cn(
              'z-50 min-w-[8rem] rounded-md border bg-white px-2 py-1 text-popover-foreground shadow-lg',
              className
            )}
            sideOffset={4}
            align={align}
          >
            {label && (
              <DropdownMenuPrimitive.Label className="px-2 py-1.5 text-sm font-medium">
                {label}
              </DropdownMenuPrimitive.Label>
            )}
            <DropdownMenuPrimitive.RadioGroup
              value={value}
              onValueChange={handleChange}
            >
              {options.map((option) => (
                <DropdownMenuPrimitive.RadioItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    'relative flex cursor-default select-none items-center rounded-sm py-1.5 text-sm font-medium outline-none transition-colors focus:bg-accent',
                    option.disabled && 'pointer-events-none opacity-50'
                  )}
                >
                  <span
                    className={cn(
                      'relative flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all',
                      value === option.value
                        ? 'border-secondary-foreground bg-primary'
                        : 'bg-white'
                    )}
                  >
                    {value === option.value && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                    )}
                  </span>
                  <span className="ml-2">{option.label}</span>
                </DropdownMenuPrimitive.RadioItem>
              ))}
            </DropdownMenuPrimitive.RadioGroup>
          </DropdownMenuPrimitive.Content>
        </motion.div>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};

DropdownRadio.displayName = 'DropdownRadio';

export { DropdownRadio };
