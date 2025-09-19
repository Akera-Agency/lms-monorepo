import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '../shadcn/popover';
import { Button } from '../button/button';
import { cn } from '../../lib/utils';
import { Calendar } from '../shadcn/calendar';
import { type UseFormRegisterReturn } from 'react-hook-form';
import Label from '../label/label';
import { Calendar as CalendarIcon } from 'lucide-react';

type DatePickerProps = {
  label?: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  dateFormat?: string;
  register?: UseFormRegisterReturn;
  icon?: boolean;
  align?: 'start' | 'end' | 'center' | undefined;
  contentStyle?: string;
};

const DatePicker = ({
  label,
  date,
  setDate,
  error,
  icon = false,
  align = 'start',
  disabled = false,
  className,
  contentStyle,
  dateFormat = 'dd/MM/yyyy',
}: DatePickerProps) => {
  const hasError = error !== undefined;

  const formatDate = (date: Date | undefined) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return null;
    }
    return format(date, dateFormat);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <Label
          label={label}
          className={cn('text-heading-color text-sm font-semibold', hasError && 'text-destructive')}
        />
      )}
      <Popover>
        <PopoverTrigger className={cn(disabled && 'pointer-events-none')} asChild>
          <div className="relative cursor-pointer">
            {icon && (
              <div
                className={cn(
                  'absolute inset-y-0 left-0 flex items-center pl-3',
                  disabled && 'opacity-50',
                )}
              >
                <CalendarIcon className="h-4 w-4" />
              </div>
            )}
            <Button
              type="button"
              variant={'outline'}
              disabled={disabled}
              className={cn(
                'h-[2.5rem] w-[8.375rem] items-center justify-between border-neutral-300 text-left text-sm font-medium shadow-none',
                !date && 'text-muted-foreground',
                hasError && 'border-red-500',
                icon && 'pl-8',
                className,
              )}
            >
              {formatDate(date) ? formatDate(date) : <span>Pick a date</span>}
              {/* <div className={triggerStyle}>
                <ChevronDown />
              </div> */}
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className={cn('dark:bg-dark-primary w-auto p-0 shadow-lg dark:border-0', contentStyle)}
          align={align}
        >
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>
      {hasError && <p className="text-sm font-semibold text-destructive">{error}</p>}
    </div>
  );
};

export default DatePicker;
