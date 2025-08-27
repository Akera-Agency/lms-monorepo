import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import Counter from '../text/count'; // Ensure this component exists

type RadialChartProps = {
  size?: number;
  progress: number;
  total: number;
  trackClassName?: string;
  progressClassName?: string;
  circleWidth?: number;
  progressWidth?: number;
  rounded?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export function RadialChart({
  size = 120,
  progress,
  total,
  progressClassName = 'stroke-[#5C42FB]',
  trackClassName = 'text-track-color dark:text-white/10',
  circleWidth = 10,
  progressWidth = 10,
  rounded = true,
  className,
  children,
}: RadialChartProps) {
  const [shouldUseValue, setShouldUseValue] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShouldUseValue(true); // force the animation to run for the first time
    }, 250);
    return () => clearTimeout(timeout);
  }, []);

  const radius = size / 2 - Math.max(progressWidth, circleWidth) / 2;
  const circumference = Math.PI * radius * 2;
  const percentage = shouldUseValue
    ? circumference * ((total - progress) / total)
    : circumference;

  return (
    <div
      className={cn('flex relative justify-center items-center', className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* background circle */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={`${circleWidth}px`}
          strokeDasharray={'10px 0'}
          strokeDashoffset="0px"
          className={cn('duration-500', trackClassName)}
        />

        {/* progress circle - solid indigo color */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className={cn('duration-500', progressClassName)}
          strokeWidth={`${progressWidth}px`}
          strokeLinecap={rounded ? 'round' : 'butt'}
          fill="transparent"
          strokeDasharray={`${circumference}px`}
          strokeDashoffset={`${percentage}px`}
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center text-center text-[32px] font-medium text-neutral-800 dark:text-white">
        {children} {/* Should show the passed children here */}
      </div>
    </div>
  );
}

export const ProgressiveRadialChart = ({
  total,
  ...props
}: Omit<RadialChartProps, 'children'>) => {
  return (
    <RadialChart
      total={total}
      {...props}
      className="text-primary"
      trackClassName="text-track-color"
    >
      <Counter
        targetValue={props.progress || 1}
        className="text-center text-[32px] font-medium dark:text-white"
      />
      <span className="text-sm font-normal text-neutral-500 dark:text-zinc-400">
        of{' '}
        <Counter
          targetValue={total}
          className="text-sm font-normal text-neutral-500 dark:text-zinc-400"
        />
      </span>
    </RadialChart>
  );
};

export const PercentageRadialChart = ({
  progress,
  total,
  showCounter = true,
  ...props
}: Omit<RadialChartProps, 'children'> & { showCounter?: boolean }) => {
  const percentage = total > 0 ? Math.ceil((progress * 100) / total) : 0;
  console.log('Percentage:', percentage);

  return (
    <RadialChart
      progress={progress}
      total={total}
      {...props}
      className="text-custom-primary"
      trackClassName="text-track-color"
    >
      {showCounter && (
        <Counter
          isPercentage={true}
          targetValue={percentage}
          className="text-sm font-medium text-gray-600"
        />
      )}
    </RadialChart>
  );
};
