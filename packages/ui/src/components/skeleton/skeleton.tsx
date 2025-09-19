import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'background' | 'foreground';
}

function Skeleton({ className, variant = 'background', ...props }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-md', className)} {...props} />;
}

export { Skeleton };
