import { useRef } from "react";
import { cn } from "../../lib/utils";
import { Input, type InputProps } from "../shadcn/input";

interface LinkInputProps extends Omit<InputProps, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

const LinkInput = ({
  value,
  onChange,
  className,
  ...props
}: LinkInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const prefix = "http://";

  const cleanUrl = (url: string) => url.replace(/^(https?:\/\/)/, "");

  const displayValue = cleanUrl(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const fullValue = `${prefix}${cleanUrl(newValue)}`;
    onChange(fullValue);
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r pl-3 pr-2">
        <span className="text-sm text-secondary-text">{prefix}</span>
      </div>
      <Input
        {...props}
        ref={inputRef}
        value={displayValue}
        onChange={handleChange}
        className={cn("pl-[4.5rem]", className)}
      />
    </div>
  );
};

export default LinkInput;
