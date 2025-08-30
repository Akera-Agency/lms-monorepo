import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  total: number;
  progress: number;
  color?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  total,
  progress,
  color = 'bg-primary',
  className = '',
}) => {
  const percentage = Number(
    Math.min(Math.max((progress / total) * 100, 0), 100).toFixed(1)
  );

  return (
    <div className="flex w-full items-center gap-2">
      <div className={cn('flex h-2 w-full rounded-full bg-white', className)}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={cn(
            'h-2 w-full rounded-full transition-all duration-300',
            color,
            className
          )}
        />
      </div>
      <h3 className="text-sm text-primary-text">{percentage}%</h3>
    </div>
  );
};

export default ProgressBar;
