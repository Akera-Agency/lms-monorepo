import { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { Button as ShadButton } from "../shadcn/button";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:select-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-primary-foreground hover:bg-destructive-hover",
        outline:
          "border text-accent-foreground bg-white hover:bg-accent hover:text-accent-foreground dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        ghost: "text-secondary-foreground bg-transparent hover:bg-accent",
        link: "flex items-center justify-start p-3 hover:bg-transparent hover:opacity-80 text-secondary-foreground bg-transparent",
        student:
          "overflow-hidden rounded-full bg-primary px-6 py-3 shadow-student-button-shadow",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-10 rounded-md px-6 py-3",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ className, children, variant, size, isLoading, ...props }, ref) => {
    return (
      <ShadButton
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-1 h-5 w-5 animate-spin" />}{" "}
        {children}
      </ShadButton>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
