import { cn } from '../../lib/utils';
import { type UseFormRegisterReturn } from 'react-hook-form';
import Label from '../label/label';
import { Textarea as ShadTextarea, type TextareaProps } from '../shadcn/textarea';

export interface ITextareaProps extends TextareaProps {
  label?: string;
  error?: string;
  register?: UseFormRegisterReturn;
}

const Textarea = ({ className, ...props }: ITextareaProps) => {
  const hasError = props.error !== undefined;
  return (
    <div className="w-full space-y-1.5">
      {props.label && (
        <Label
          label={props.label}
          className={cn('text-heading-color text-sm font-semibold', hasError && 'text-destructive')}
          required={props.required ?? false}
        />
      )}
      <ShadTextarea
        rows={props.rows}
        placeholder={props.placeholder}
        onChange={props.onChange}
        className={cn(
          'bg-glass-input-bg-color placeholder-light-gray-100 dark:focus:border-custom-primary border p-4 text-sm ring-0 placeholder:text-sm placeholder:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:border-0 dark:border-white/20',

          className,
          hasError && 'resize-none border-destructive focus-visible:ring-offset-0',
        )}
        {...props}
        {...props.register}
      ></ShadTextarea>
      {hasError && (
        <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
          {props.error}
        </p>
      )}
    </div>
  );
};

Textarea.displayName = 'Textarea';

export { Textarea };
