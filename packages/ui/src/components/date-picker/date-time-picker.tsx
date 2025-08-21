import React from "react";
import { format } from "date-fns";
import { type UseFormRegisterReturn } from "react-hook-form";
import Label from "../label/label";
import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "../shadcn/button";
import Input from "../form/input";
import DatePicker from "./date-picker";

type DateTimePickerProps = {
  label?: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time?: Date;
  setTime: (time: Date | undefined) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  dateFormat?: string;
  timeFormat?: string;
  register?: UseFormRegisterReturn;
  icon?: boolean;
  align?: "start" | "end" | "center" | undefined;
  contentStyle?: string;
  placeholder?: string;
  labelRequired?: boolean;
};

const DateTimePicker = ({
  label,
  date,
  setDate,
  time,
  setTime,
  error,
  icon = false,
  align = "start",
  disabled = false,
  className,
  contentStyle,
  dateFormat = "dd/MM/yyyy",
  timeFormat = "HH:mm",
  placeholder = "Pick a date",
  register,
  labelRequired = false,
}: DateTimePickerProps) => {
  const hasError = error !== undefined;

  const handleChangeTime = (
    e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLLabelElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    if (value) {
      const [hours, minutes] = value.split(":");
      const newTime = new Date();
      newTime.setHours(parseInt(hours, 10));
      newTime.setMinutes(parseInt(minutes, 10));
      setTime(newTime);
    } else {
      setTime(undefined);
    }
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <Label
          label={label}
          required={labelRequired}
          className={cn(
            "text-heading-color text-sm font-semibold",
            hasError && "text-destructive"
          )}
        />
      )}
      <Popover>
        <PopoverTrigger
          className={cn(disabled && "pointer-events-none")}
          asChild
        >
          <div className="relative w-full cursor-pointer">
            {icon && (
              <div
                className={cn(
                  "absolute inset-y-0 left-0 flex items-center pl-3",
                  disabled && "opacity-50"
                )}
              >
                <CalendarIcon className="h-4 w-4" />
              </div>
            )}
            <Button
              type="button"
              variant={"outline"}
              disabled={disabled}
              className={cn(
                "h-[2.5rem] w-full items-center justify-between border-neutral-300 text-left text-sm font-medium shadow-none",
                !date && "text-muted-foreground",
                hasError && "border-red-500",
                icon && "pl-8",
                className
              )}
            >
              {date && time ? (
                format(date, dateFormat) + "  " + format(time, timeFormat)
              ) : (
                <span>{placeholder}</span>
              )}
              {/* <div className={triggerStyle}>
                <ChevronDown />
              </div> */}
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "dark:bg-dark-primary w-96 px-3 py-2 shadow-lg dark:border-0",
            contentStyle
          )}
          align={align}
        >
          <Label
            label="Select Date and Time"
            className="text-primary-text mb-2 text-sm font-medium"
          />
          <div className="grid gap-2">
            <DatePicker date={date} setDate={setDate} className="w-full" />
            <div className="relative">
              <Input
                placeholder="Time (Optional)"
                value={time ? format(time, timeFormat) : ""}
                register={register}
                onChange={handleChangeTime}
                type="time"
              />
              {/* <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" /> */}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateTimePicker;
