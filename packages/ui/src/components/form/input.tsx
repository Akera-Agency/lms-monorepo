import { useRef, useState } from 'react';
import type { InputProps as ShadInputProps } from '../shadcn/input';
import { Input as ShadInput } from '../shadcn/input';
import type { LabelProps } from '../label/label';
import Label from '../label/label';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { cn } from '../../lib/utils';
import {
  ChevronDown,
  ChevronUp,
  TriangleAlert,
  Eye,
  EyeOff,
} from 'lucide-react';

interface InputComponentProps {
  error?: string;
  inputIcon?: React.ReactNode;
  register?: UseFormRegisterReturn;
  labelClassName?: string;
  min?: number;
  max?: number;
  step?: number;
}

type InputProps = InputComponentProps & ShadInputProps & LabelProps;

const Input: React.FC<InputProps> = ({
  label,
  className,
  error,
  inputIcon,
  register,
  wrapperClassName,
  helperText,
  required,
  icon,
  badge,
  badgeVariant,
  labelClassName,
  min,
  max,
  step = 1,
  type,
  ...props
}) => {
  const hasError = !!error;
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === 'password' ? (showPassword ? 'text' : 'password') : type;
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleIncrement = () => {
    if (inputRef.current) {
      const currentValue = parseFloat(inputRef.current.value) || 0;
      const newValue = Math.min(max ?? Infinity, currentValue + step);
      inputRef.current.value = newValue.toString();
      inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  const handleDecrement = () => {
    if (inputRef.current) {
      const currentValue = parseFloat(inputRef.current.value) || 0;
      const newValue = Math.max(min ?? -Infinity, currentValue - step);
      inputRef.current.value = newValue.toString();
      inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  const labelProps: LabelProps = {
    label,
    helperText,
    required,
    icon,
    badge,
    badgeVariant,
    className: labelClassName,
  };

  const inputProps: ShadInputProps = {
    ...props,
    type: inputType,
    className: cn(
      'bg-input-background w-full border border-input-border p-4  text-sm placeholder-input-placeholder placeholder:text-sm placeholder:font-normal disabled:opacity-50 dark:disabled:bg-input-background',
      type === 'number' && 'pr-16',
      type === 'password' && 'pr-12',
      className,
      hasError && 'border-destructive',
      inputIcon && 'pl-9'
    ),
    ...(register ? { ...register } : {}),
  };

  return (
    <div className={cn('flex w-full flex-col gap-2', wrapperClassName)}>
      {label && <Label {...labelProps} />}
      <div className="relative">
        <ShadInput ref={inputRef} type={type} {...inputProps} />
        {inputIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-input-placeholder">
            {inputIcon}
          </div>
        )}
        {type === 'number' && (
          <div className="absolute inset-y-0 right-5 flex flex-col">
            <button
              type="button"
              className="flex h-[50%] w-5 items-end justify-center text-secondary-text hover:text-neutral-800"
              onClick={handleIncrement}
            >
              <ChevronUp className="-mb-1 h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-[50%] w-5 items-start justify-center text-secondary-text hover:text-neutral-800"
              onClick={handleDecrement}
            >
              <ChevronDown className="-mt-1 h-4 w-4" />
            </button>
          </div>
        )}
        {type === 'password' && (
          <div className="absolute inset-y-0 right-5 flex items-center">
            <button
              type="button"
              className="text-secondary-text hover:text-neutral-800 cursor-pointer"
              onClick={togglePassword}
            >
              {showPassword ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </div>
      {hasError && (
        <p className="flex items-center gap-1 text-sm font-semibold text-destructive">
          <TriangleAlert className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
