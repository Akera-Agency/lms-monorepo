import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { Badge } from "../badge/badge";

type ExpandableProps = {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  isCompleted?: boolean;
  triggerStyle?: string;
  id?: number;
  onToggleExpanded?: (id: number, isExpanded: boolean) => void;
};

const Expandable = ({
  title,
  children,
  isOpen,
  isCompleted,
  triggerStyle = "",
  id,
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
          "flex cursor-pointer items-center justify-start gap-3 px-1 py-3 hover:bg-muted/50 hover:no-underline",
          triggerStyle,
        )}
        onClick={handleToggle}
      >
        <div className="flex items-center gap-4">
          <motion.button
            onClick={handleToggle}
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            type="button"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <h3 className="text-base font-semibold text-primary-text">
              {title}{" "}
              {isCompleted && (
                <Badge variant="success" className="mr-4 rounded-full">
                  Completed
                </Badge>
              )}
            </h3>
          </div>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="30"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden p-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Expandable;