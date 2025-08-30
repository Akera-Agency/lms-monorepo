import * as React from 'react';
import { Input } from '../shadcn/input';
import { Button } from '../button/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../shadcn/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface TimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onTimeChange?: (time: string, period: 'AM' | 'PM') => void;
}

const TimeInput = ({
  className,
  onTimeChange,
  disabled,
  ...props
}: TimeInputProps) => {
  const [time, setTime] = React.useState(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  });

  const [period, setPeriod] = React.useState<'AM' | 'PM'>(() =>
    new Date().getHours() >= 12 ? 'PM' : 'AM'
  );

  const formatTime = React.useCallback((input: string): string => {
    const [hours, minutes] = input.split(':');
    return `${hours?.padStart(2, '0') || '00'}:${
      minutes?.padStart(2, '0') || '00'
    }`;
  }, []);

  const handleTimeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setTime(newValue);
      onTimeChange?.(newValue, period);
    },
    [onTimeChange, period]
  );

  const handlePeriodChange = React.useCallback(
    (newPeriod: 'AM' | 'PM') => {
      setPeriod(newPeriod);
      onTimeChange?.(time, newPeriod);
    },
    [onTimeChange, time]
  );

  const handleBlur = React.useCallback(() => {
    const formattedTime = formatTime(time);
    setTime(formattedTime);
    onTimeChange?.(formattedTime, period);
  }, [formatTime, onTimeChange, period, time]);

  React.useEffect(() => {
    onTimeChange?.(time, period);
  }, [time, period, onTimeChange]);

  return (
    <div className="relative flex w-full max-w-[8.375rem] lg:max-w-[7.5rem]">
      <Input
        value={time}
        onChange={handleTimeChange}
        onBlur={handleBlur}
        className={`pr-16 ${className}`}
        disabled={disabled}
        {...props}
      />
      <DropdownMenu>
        <DropdownMenuTrigger disabled={disabled} asChild>
          <Button
            type="button"
            variant="ghost"
            className="absolute right-0 top-0 h-full rounded-l-none border border-l-0 px-1 py-2 text-neutral-800"
          >
            {period} <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handlePeriodChange('AM')}>
            AM
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePeriodChange('PM')}>
            PM
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TimeInput;
