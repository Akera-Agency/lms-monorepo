import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import Counter from '../text/count';

type DonutChartProps = {
  size?: number;
  progress: number;
  total: number;
  trackClassName?: string;
  progressClassName?: string;
  circleWidth?: number;
  progressWidth?: number;
  rounded?: boolean;
  className?: string;
  children: React.ReactNode;
};

export default function DonutChart({
  size = 120,
  progress,
  total,
  progressClassName = 'text-track-color',
  trackClassName = 'text-track-color dark:text-white/10',
  circleWidth = 10,
  progressWidth = 10,
  rounded = true,
  className,
  children,
}: DonutChartProps) {
  const [shouldUseValue, setShouldUseValue] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShouldUseValue(true); // force the animation to run for the first time
    }, 250);
    return () => clearTimeout(timeout);
  }, []);

  const radius = size / 2 - Math.max(progressWidth, circleWidth) / 2;
  const circumference = Math.PI * radius * 2;
  const percentage = shouldUseValue ? circumference * ((total - progress) / total) : circumference;

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
        {/* define a gradient for the fading effect */}
        <defs>
          <linearGradient id="lightGradient">
            <stop offset="0%" stopColor="hsl(var(--light-doughnut-start))" />
            <stop offset="100%" stopColor="var(--light-doughnut-end)" />
          </linearGradient>
          <linearGradient id="darkGradient">
            <stop offset="0%" stopColor="var(--dark-doughnut-start)" />
            <stop offset="100%" stopColor="var(--dark-doughnut-end)" />
          </linearGradient>
        </defs>

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

        {/* progress circle */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className={cn(
            'duration-500',
            progressClassName,
            'stroke-[url(#lightGradient)] dark:stroke-[url(#darkGradient)]',
          )}
          strokeWidth={`${progressWidth}px`}
          strokeLinecap={rounded ? 'round' : 'butt'}
          fill="transparent"
          strokeDasharray={`${circumference}px`}
          strokeDashoffset={`${percentage}px`}
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center text-center text-[32px] font-medium text-neutral-800 dark:text-white">
        {children}
      </div>
    </div>
  );
}

export const ProgressiveDonutChart = ({ total, ...props }: Omit<DonutChartProps, 'children'>) => {
  return (
    <DonutChart total={total} {...props} className="text-primary" trackClassName="text-track-color">
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
    </DonutChart>
  );
};

export const PercentageDonutChart = ({ ...props }: Omit<DonutChartProps, 'children'>) => {
  return (
    <DonutChart {...props} className='"text-custom-primary' trackClassName="text-track-color ">
      <div className="flex items-center">
        <Counter
          targetValue={props.progress}
          className="font-medium text-purple-500 text-md dark:text-white"
        />
        <span className="text-[1.75rem] font-medium text-purple-500 dark:text-zinc-400">%</span>
      </div>
    </DonutChart>
  );
};

export const StreakDonutChart = ({ ...props }: Omit<DonutChartProps, 'children'>) => {
  return (
    <DonutChart {...props} className='"text-custom-primary' trackClassName="text-track-color ">
      <div className="flex flex-col gap-2 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
        >
          <path
            d="M33.531 18.6103C33.5203 18.6334 33.5096 18.6564 33.4987 18.6794C33.0758 19.5793 31.723 19.222 31.8063 18.2312C31.9586 16.4204 31.7346 14.5486 31.0822 12.7259C28.9643 6.80963 21.8534 0.0731642 15.5566 5.87026e-05C14.8842 -0.00773427 14.4981 0.762063 14.895 1.3049C15.4241 2.02853 15.8537 2.84427 16.158 3.73905C17.1565 6.67626 16.5418 9.80339 14.7836 12.1267C14.0506 13.0953 12.4942 12.6169 12.4686 11.4026L12.4681 11.3762C12.4578 10.7324 12.5634 10.1143 12.766 9.54184C12.8554 9.28943 12.6214 9.04102 12.365 9.11828C8.79531 10.1942 6.08091 15.4471 6.08091 19.1939C6.08091 19.4676 6.09612 19.7376 6.1244 20.0038C6.12799 20.5155 6.21701 21.023 6.3878 21.5054L6.40687 21.559C6.4617 21.7111 6.51931 21.8623 6.57966 22.0124C5.72901 20.9731 5.01226 19.831 4.44624 18.6131C4.18195 18.044 3.34543 18.1569 3.24271 18.776C3.05968 19.8784 2.96387 20.9537 2.96387 21.9759C2.96387 30.8258 10.1381 38 18.9879 38C27.8378 38 35.012 30.8258 35.012 21.9759C35.012 20.9536 34.9162 19.8783 34.7331 18.7757C34.6306 18.1581 33.7946 18.0424 33.531 18.6103Z"
            fill="url(#paint0_linear_4264_15967)"
          />
          <path
            d="M6.08091 19.1938C6.08091 19.4674 6.09612 19.7375 6.1244 20.0037C6.12799 20.5154 6.21702 21.0229 6.3878 21.5053L6.40688 21.5588C6.4617 21.711 6.51931 21.8621 6.57966 22.0122C5.72901 20.9729 5.01226 19.8308 4.44624 18.6129C4.18195 18.0438 3.34543 18.1567 3.24271 18.7758C3.05968 19.8782 2.96387 20.9535 2.96387 21.9757C2.96379 30.8257 10.138 37.9999 18.9878 37.9999C27.8377 37.9999 35.0119 30.8257 35.0119 21.9758C35.0119 20.9535 34.9161 19.8782 34.733 18.7756C34.6304 18.158 33.7944 18.0423 33.5309 18.6102C33.5202 18.6333 33.5094 18.6563 33.4986 18.6793C33.0757 19.5792 31.7228 19.2219 31.8062 18.2311C31.8413 17.8101 31.8558 17.3876 31.8498 16.9651H6.35485C6.17628 17.736 6.08091 18.4913 6.08091 19.1938Z"
            fill="url(#paint1_linear_4264_15967)"
          />
          <path
            d="M27.1059 24.7083C27.0998 24.7212 27.0939 24.734 27.0878 24.7468C26.8518 25.2492 26.0966 25.0497 26.1431 24.4967C26.2281 23.4858 26.1031 22.441 25.7388 21.4236C24.5566 18.121 20.5873 14.3607 17.0724 14.3199C16.697 14.3155 16.4815 14.7452 16.7031 15.0482C17.0057 15.4628 17.2434 15.9209 17.4081 16.407C17.9654 18.0466 17.6223 19.7922 16.6409 21.0891C16.2317 21.6298 15.363 21.3628 15.3486 20.6849L15.3483 20.6701C15.3423 20.3216 15.3986 19.9748 15.5147 19.6462C15.5645 19.5053 15.4339 19.3666 15.2908 19.4097C13.2982 20.0104 11.783 22.9425 11.783 25.034C11.783 25.1867 11.7916 25.3375 11.8073 25.4861C11.8093 25.7717 11.859 26.055 11.9543 26.3242L11.9649 26.3541C11.9955 26.4396 12.028 26.5236 12.0613 26.6072C11.5865 26.0271 11.1864 25.3896 10.8704 24.7097C10.7229 24.392 10.256 24.4552 10.1986 24.8007C10.0964 25.4161 10.043 26.0163 10.043 26.5869C10.043 31.527 14.0477 35.5317 18.9877 35.5317C23.9278 35.5317 27.9325 31.527 27.9325 26.5869C27.9325 26.0162 27.879 25.4159 27.7768 24.8005C27.7197 24.4558 27.253 24.3913 27.1059 24.7083Z"
            fill="url(#paint2_linear_4264_15967)"
          />
          <path
            d="M11.783 25.0339C11.783 25.1867 11.7916 25.3374 11.8073 25.486C11.8093 25.7716 11.859 26.0549 11.9543 26.3241L11.9649 26.3541C11.9955 26.4395 12.028 26.5236 12.0613 26.6071C11.5865 26.027 11.1864 25.3895 10.8704 24.7097C10.7229 24.3919 10.256 24.4551 10.1986 24.8006C10.0964 25.416 10.043 26.0162 10.043 26.5868C10.043 31.5269 14.0477 35.5316 18.9877 35.5316C23.9278 35.5316 27.9325 31.5269 27.9325 26.5868C27.9325 26.0161 27.879 25.4159 27.7768 24.8004C27.7196 24.4557 27.2529 24.3911 27.1058 24.7081C27.0998 24.721 27.0938 24.7339 27.0878 24.7467C26.8517 25.249 26.0966 25.0496 26.143 24.4965C26.1627 24.2625 26.1706 24.0267 26.1674 23.7898H11.936C11.8363 24.2202 11.783 24.6418 11.783 25.0339Z"
            fill="url(#paint3_linear_4264_15967)"
          />
          <path
            d="M4.67697 13.3092C5.84941 13.5497 6.78367 12.3439 6.31565 11.2423C5.96586 10.4191 6.02078 9.44195 6.5484 8.63801L6.551 8.634C6.68437 8.43153 6.57786 8.159 6.34133 8.10571C5.24838 7.85953 4.0692 8.29564 3.41815 9.28757C2.57918 10.5659 2.93536 12.2824 4.2137 13.1214C4.35687 13.2152 4.5131 13.2756 4.67697 13.3092Z"
            fill="url(#paint4_linear_4264_15967)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_4264_15967"
              x1="16.4222"
              y1="20.5833"
              x2="32.2555"
              y2="23.75"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#DCD7FF" />
              <stop offset="1" stopColor="#5C42FB" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_4264_15967"
              x1="22.5583"
              y1="24.5416"
              x2="22.5583"
              y2="36.4166"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#706DFF" stop-opacity="0" />
              <stop offset="0.517" stopColor="#3F03EA" stop-opacity="0.56" />
              <stop offset="1" stopColor="#3A1CF1" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_4264_15967"
              x1="18.7977"
              y1="25.3332"
              x2="25.9227"
              y2="27.7082"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="#FAA500" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_4264_15967"
              x1="19.5894"
              y1="29.2916"
              x2="19.5894"
              y2="35.625"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FAA500" stop-opacity="0" />
              <stop offset="1" stopColor="#FAA500" />
            </linearGradient>
            <linearGradient
              id="paint4_linear_4264_15967"
              x1="4.54657"
              y1="10.2916"
              x2="4.5472"
              y2="12.6666"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#E5E1FF" />
              <stop offset="0.43739" stopColor="#C4BBFF" />
              <stop offset="1" stopColor="#5C42FB" />
            </linearGradient>
          </defs>
        </svg>
        <span className="text-sm font-medium text-purple-500 dark:text-zinc-400">
          {props.progress} Days
        </span>
      </div>
    </DonutChart>
  );
};
