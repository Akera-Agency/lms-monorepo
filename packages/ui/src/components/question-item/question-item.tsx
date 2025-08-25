import { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const questionItemVariants = cva(
  "flex items-center justify-between w-full p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-muted/50 hover:border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
  {
    variants: {
      variant: {
        default: "bg-background border-border",
        completed: "bg-success/5 border-success/20",
        active: "bg-primary/5 border-primary/20",
      },
      size: {
        sm: "p-3 text-sm",
        default: "p-4",
        lg: "p-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface QuestionItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof questionItemVariants> {
  title: string;
  description?: string;
  isCompleted?: boolean;
  isActive?: boolean;
  onItemClick?: () => void;
  rightContent?: React.ReactNode;
}

const QuestionItem = forwardRef<HTMLDivElement, QuestionItemProps>(
  (
    {
      className,
      variant,
      size,
      title,
      description,
      isCompleted = false,
      isActive = false,
      onItemClick,
      rightContent,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      // Call the custom click handler if provided
      onItemClick?.();
      // Call the original onClick if provided
      onClick?.(e);
    };

    // Determine variant based on state
    const currentVariant = isCompleted
      ? "completed"
      : isActive
      ? "active"
      : variant;

    return (
      <div
        ref={ref}
        className={cn(questionItemVariants({ variant: currentVariant, size }), className)}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick(e as any);
          }
        }}
        {...props}
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-primary-text truncate">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-secondary-text mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        {rightContent && (
          <div className="ml-4 flex-shrink-0">
            {rightContent}
          </div>
        )}
      </div>
    );
  }
);

QuestionItem.displayName = "QuestionItem";

export { QuestionItem, questionItemVariants };
export type { QuestionItemProps };