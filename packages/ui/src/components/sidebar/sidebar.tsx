import {
  Sidebar as ShadSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarRail,
} from '../shadcn/sidebar';

import { ChevronRight, PanelRightClose } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../shadcn/collapsible';
import { useState, useRef, useEffect } from 'react';
import CustomSidebarTrigger from './custom-sidebar-trigger';
import { groupLinksByLabel } from '../../helpers/group-links';
import { type NavigationLink } from '../../types/navigation';
import { cn } from '../../lib/utils';
// import { getFirstSegment } from "../../helpers/get-first-segment";
import HoverPopup from './collapsible-hover';
import { useTheme } from 'next-themes';

type SidebarProps = {
  navigationLinks: NavigationLink[];
  className?: string;
};

const Sidebar = ({ navigationLinks, className }: SidebarProps) => {
  const currentPath = window.location.pathname;
  const searchParams = window.location.search;
  const groupedLinks = groupLinksByLabel(navigationLinks);
  // const currentSegment = getFirstSegment(currentPath, 1);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [popupHovered, setPopupHovered] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const triggerRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [currentHash, setCurrentHash] = useState<string>('');

  const shouldShowPopup = (linkTitle: string) => {
    return hoveredItem === linkTitle || popupHovered === linkTitle;
  };

  const isLinkActive = (url: string) => {
    if (!url) return false;

    // For hash-based URLs, check if the current hash matches
    if (url.includes('#')) {
      return currentHash && url.endsWith(currentHash);
    }

    // For regular URLs, check if the current path matches
    const urlWithoutHash = url.split('#')[0];
    const currentPathWithoutHash = currentPath.split('#')[0];
    return currentPathWithoutHash && urlWithoutHash === currentPathWithoutHash;
  };

  // Update hash when it changes
  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(window.location.hash);
    };

    // Initial hash
    updateHash();

    // Listen for hash changes
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  // Update hash when pathname or search params change
  useEffect(() => {
    setCurrentHash(window.location.hash);
  }, [currentPath, searchParams]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-state'
        ) {
          const target = mutation.target as HTMLElement;
          setIsSidebarCollapsed(
            target.getAttribute('data-state') === 'collapsed'
          );
        }
      });
    });

    if (sidebarRef.current) {
      observer.observe(sidebarRef.current, {
        attributes: true,
        attributeFilter: ['data-state'],
      });
    }

    return () => observer.disconnect();
  }, []);

  const { theme } = useTheme();

  return (
    <ShadSidebar
      ref={sidebarRef}
      className={cn('group', className)}
      collapsible="icon"
    >
      <SidebarHeader className="flex flex-row items-center justify-between p-4 group-data-[state=collapsed]:px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <a href={'/'} className="flex gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <img
                  src={
                    theme === 'dark'
                      ? '/images/akera-dark.png'
                      : '/images/akera.png'
                  }
                  alt="Akera UI"
                  className="h-8 w-8"
                />
              </div>
              <h1 className="mt-1 truncate text-xl font-semibold group-data-[state=collapsed]:hidden">
                Akera UI
              </h1>
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
        <CustomSidebarTrigger className="group-data-[state=collapsed]:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <CustomSidebarTrigger
          icon={<PanelRightClose className="h-10 w-10" />}
          className="border-sidebar-separator hidden h-10 w-full rounded-none border-b border-t group-data-[state=collapsed]:flex"
        />

        {Object.entries(groupedLinks).map(([label, links]) => (
          <SidebarGroup
            key={label}
            className="border-sidebar-separator group-data-[state=collapsed]:border-b group-data-[state=collapsed]:pb-7"
          >
            <SidebarGroupLabel className="uppercase group-data-[state=collapsed]:hidden">
              {label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* @typescript-eslint/no-explicit-any */}
                {links.map((link: any) =>
                  link.items ? (
                    <Collapsible
                      key={link.title}
                      defaultOpen
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <div
                          className="group/hover relative"
                          onMouseEnter={() =>
                            link.title && setHoveredItem(link.title)
                          }
                          onMouseLeave={() => setHoveredItem(null)}
                          ref={(el) => {
                            if (link.title) {
                              triggerRefs.current[link.title] = el;
                            }
                          }}
                        >
                          <a
                            href={link.url}
                            className={cn(
                              'hover:bg-sidebar-hover relative w-full hover:text-neutral-800',
                              isLinkActive(link.url)
                                ? 'bg-sidebar-active-item'
                                : ''
                            )}
                            //@ts-ignore
                            params={link.params}
                            //@ts-ignore
                            search={link.searchParams}
                          >
                            <HoverPopup
                              items={link.items}
                              isVisible={
                                link.title ? shouldShowPopup(link.title) : false
                              }
                              triggerRef={{
                                current: link.title,
                              }}
                              isSidebarCollapsed={isSidebarCollapsed}
                              onPopupHover={(isHovering) => {
                                if (link.title) {
                                  if (isHovering) {
                                    setPopupHovered(link.title);
                                  } else {
                                    setPopupHovered(null);
                                  }
                                }
                              }}
                            />
                            <CollapsibleTrigger className="" asChild>
                              <SidebarMenuButton
                                className={cn(
                                  'hover:bg-sidebar-hover group px-2 py-5',
                                  isLinkActive(link.url)
                                    ? 'bg-sidebar-active-item'
                                    : ''
                                )}
                              >
                                <span
                                  className={cn(
                                    'flex items-center justify-center group-data-[state=collapsed]:-ml-0.5',
                                    isLinkActive(link.url)
                                      ? 'text-primary-base'
                                      : ''
                                  )}
                                >
                                  {link.icon}
                                </span>
                                {link.title}
                                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                          </a>
                        </div>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {/* @typescript-eslint/no-explicit-any */}
                            {link.items.map((subItem: any) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <a
                                  href={subItem.url}
                                  //@ts-ignore
                                  params={subItem.params}
                                  //@ts-ignore
                                  search={subItem.searchParams}
                                >
                                  <SidebarMenuButton
                                    className={cn(
                                      'hover:bg-sidebar-hover',
                                      isLinkActive(subItem.url)
                                        ? 'bg-sidebar-active-item text-neutral-800'
                                        : 'text-secondary-text'
                                    )}
                                  >
                                    {subItem.title}
                                  </SidebarMenuButton>
                                </a>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={link.title}>
                      <a
                        href={link.url}
                        //@ts-ignore
                        params={link.params}
                        //@ts-ignore
                        search={link.searchParams}
                      >
                        <SidebarMenuButton
                          className={cn(
                            'hover:bg-sidebar-hover group px-2 py-5 hover:text-neutral-800',
                            isLinkActive(link.url)
                              ? 'bg-sidebar-active-item text-primary-base'
                              : 'text-secondary-text'
                          )}
                        >
                          <span
                            className={cn(
                              'flex items-center justify-center group-data-[state=collapsed]:-ml-0.5',
                              isLinkActive(link.url) ? 'text-primary-base' : ''
                            )}
                          >
                            {link.icon}
                          </span>
                          <p
                            className={cn(
                              'font-medium',
                              isLinkActive(link.url) ? 'text-primary-base' : ''
                            )}
                          >
                            {link.title}
                          </p>
                        </SidebarMenuButton>
                      </a>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </ShadSidebar>
  );
};

export default Sidebar;
