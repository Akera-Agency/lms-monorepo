import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

type ExpandableProps = {
  id: number;
  title: string;
  description?: string;
  children: React.ReactNode;
  isOpen?: boolean;
  triggerStyle?: string;
  keysProgress?: string;
  showCheck?: boolean;
  onToggleExpanded?: (id: number, status: boolean) => void;
};

const Expandable = ({
  id,
  title,
  description,
  children,
  isOpen,
  triggerStyle = '',
  keysProgress,
  showCheck,
  onToggleExpanded,
}: ExpandableProps) => {
  const [isExpanded, setIsExpanded] = useState(isOpen ?? false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (onToggleExpanded && id !== undefined) {
      onToggleExpanded(id, !isExpanded);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-lg">
      <div
        className={cn(
          'h-13 bg-custom-gray-blue/10 flex w-full cursor-pointer items-start justify-between p-4',
          triggerStyle
        )}
        onClick={handleToggle}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <h3 className="text-primary-text text-base font-semibold">
              {title}
            </h3>{' '}
            {keysProgress ? (
              <div className="flex items-center justify-items-start gap-2">
                {showCheck && (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0A9C55] text-white">
                    <Check size={10} strokeWidth={3} />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-secondary-text text-sm font-normal leading-[19px]">
                    Progress :
                  </span>

                  <span className="text-sm font-normal leading-[19px]">
                    {keysProgress}
                  </span>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
          {/* {isFather && (
            <div className="flex gap-3 items-center">
              <div className="flex gap-1 items-center">
                <div className="flex h-4 w-4 items-center justify-center gap-2.5 rounded-full bg-green-600 p-1">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div className="text-sm font-normal text-custom-gray-blue">
                  Completed:
                </div>
                <div className="text-sm font-normal text-primary-text">
                  11/20 lessons
                </div>
              </div>
              <div className="h-full w-[1px] bg-custom-gray-blue"></div>
              <div className="">
                <div className="flex gap-1 items-center">
                  <courseIcons.Key className="w-4 h-4" />
                  <div className="text-sm font-normal text-custom-gray-blue">
                    Keys earned:
                  </div>
                  <div className="text-sm font-normal text-neutral-800">
                    8/10
                  </div>
                </div>
              </div>
            </div>
          )} */}
        </div>
        <div className="flex items-center gap-4">
          <motion.button
            onClick={handleToggle}
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            type="button"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="30"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden p-2"
          >
            {description && (
              <div className="text-custom-gray-blue p-4 text-sm font-normal">
                {description}
              </div>
            )}
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Expandable;
