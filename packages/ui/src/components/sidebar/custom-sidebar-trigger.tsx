import { Button } from '../button/button';
import { cn } from '../../lib/utils';
import { useSidebar } from '../shadcn/sidebar';
import { PanelLeftClose } from 'lucide-react';

type CustomSidebarTriggerProps = {
  className?: string;
  icon?: React.ReactNode;
  iconWrapperStyle?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const CustomSidebarTrigger = ({
  className,
  icon = <PanelLeftClose className="h-10 w-10" />,
  iconWrapperStyle,
  onClick,
  ...props
}: CustomSidebarTriggerProps) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn('h-10 w-10 text-accent-foreground', className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <div className={cn('flex h-full w-full items-center justify-center', iconWrapperStyle)}>
        {icon}
      </div>
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

export default CustomSidebarTrigger;
