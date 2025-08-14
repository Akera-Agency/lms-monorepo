import { cn } from "../../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "background" | "foreground";
}

function Skeleton({
  className,
  variant = "background",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-skeleton-background animate-pulse rounded-md",
        className,
        {
          "bg-skeleton-background": variant === "background",
          "bg-skeleton-foreground": variant === "foreground",
        },
      )}
      {...props}
    />
  );
}

export { Skeleton };
