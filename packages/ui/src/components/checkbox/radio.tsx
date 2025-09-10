import { cn } from '../../lib/utils';

type RadioProps = {
  id?: string;
  title?: string;
  description?: string;
  disabled?: boolean;
  checked?: boolean;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
};

const Radio = ({
  id,
  title,
  description,
  className,
  disabled = false,
  checked = false,
  onCheckedChange,
}: RadioProps) => {
  const handleCheck = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <div
      id={id}
      onClick={handleCheck}
      className={cn(
        'relative flex select-none items-start',

        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      )}
    >
      <span
        className={cn(
          'relative mt-1 flex h-4 min-h-4 w-4 min-w-4 items-center justify-center rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className,
          checked && !disabled
            ? 'bg-[#F3562E] border-[#F3562E]'
            : 'border-neutral-300 bg-primary-foreground ',
          disabled && 'border-neutral-200 bg-neutral-100'
        )}
      >
        {checked && !disabled && (
          <span className="h-2 w-2 rounded-full bg-primary-foreground"></span>
        )}
      </span>
      <div>
        <span className="font-medium">{title}</span>
        <p className="text-sm text-secondary-text">{description}</p>
      </div>
    </div>
  );
};

export default Radio;
