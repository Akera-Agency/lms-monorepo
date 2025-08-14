import { cn } from "../../lib/utils";

type RadioListOption = {
  title: string;
  value: string | number | boolean;
  description: string;
  disabled?: boolean;
};

type RadioListProps = {
  options: RadioListOption[];
  selectedOption: string | number | boolean | undefined;
  handleOptionChange: (value: string | number | boolean) => void;
};

const RadioList = ({
  options,
  selectedOption,
  handleOptionChange,
}: RadioListProps) => {
  return (
    <div>
      {options.map((option) => (
        <div
          key={option.title}
          onClick={() => handleOptionChange(option.value)}
          className={cn(
            "relative flex cursor-pointer select-none items-start space-x-2 py-2",
            option.disabled && "pointer-events-none opacity-50",
          )}
        >
          <span
            className={cn(
              "relative mt-1.5 flex h-4 min-h-4 w-4 min-w-4 items-center justify-center rounded-full border-2 transition-all",
              selectedOption === option.value
                ? "border border-secondary-foreground bg-primary"
                : "bg-white",
            )}
          >
            {selectedOption === option.value && (
              <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
            )}
          </span>
          <div>
            <span className="text-sm font-semibold">{option.title}</span>
            <p className="text-secondary-text text-sm">{option.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RadioList;
