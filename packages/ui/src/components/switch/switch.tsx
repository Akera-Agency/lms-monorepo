import { Switch as ShadSwitch } from "../shadcn/switch";
import Label from "../label/label";
import { cn } from "../../lib/utils";
import { type UseFormRegisterReturn } from "react-hook-form";

type SwitchProps = {
  id?: string;
  label?: string;
  className?: string;
  thumbClassName?: string;
  register?: UseFormRegisterReturn;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

const Switch = ({
  id,
  label,
  className,
  thumbClassName,
  register,
  checked,
  onCheckedChange,
}: SwitchProps) => {
  return (
    <div className="flex items-center gap-2">
      <ShadSwitch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={cn("", className)}
        about={thumbClassName}
        id={id}
        {...register}
      />
      {label && (
        <Label className="text-base font-medium" label={label} htmlFor={id} />
      )}
    </div>
  );
};

export default Switch;
