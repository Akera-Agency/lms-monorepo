import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { SidebarMenuButton } from '../shadcn/sidebar';
import { cn } from '../../lib/utils';

const HoverPopup = ({
  items,
  isVisible,
  triggerRef,
  isSidebarCollapsed,
  onPopupHover,
}: {
  items: {
    title: string;
    url: string;
    params?: Record<string, string>;
    searchParams?: Record<string, string>;
  }[];
  isVisible: boolean;
  triggerRef: React.RefObject<HTMLElement>;
  isSidebarCollapsed: boolean;
  onPopupHover: (isHovering: boolean) => void;
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const pathname = window.location.pathname;

  useEffect(() => {
    if (isVisible && triggerRef.current && isSidebarCollapsed) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top,
        left: rect.right,
      });
    }
  }, [isVisible, triggerRef, isSidebarCollapsed]);

  if (!isVisible || !isSidebarCollapsed) return null;

  return createPortal(
    <div
      className="shadow-lg fixed z-[9999] flex w-fit min-w-48 flex-col gap-1 whitespace-nowrap rounded-lg border border-gray-200 bg-white p-2 transition-all duration-200"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onMouseEnter={() => onPopupHover(true)}
      onMouseLeave={() => onPopupHover(false)}
    >
      {items.map((subItem) => {
        const isActive = pathname === subItem.url;
        return (
          <div key={subItem.title} className="w-full">
            <a href={subItem.url} className="w-full">
              <SidebarMenuButton
                className={cn(
                  'w-full justify-start hover:bg-sidebar-hover',
                  isActive ? 'bg-sidebar-active-item text-neutral-800' : 'text-secondary-text',
                )}
              >
                {subItem.title}
              </SidebarMenuButton>
            </a>
          </div>
        );
      })}
    </div>,
    document.body,
  );
};

export default HoverPopup;
