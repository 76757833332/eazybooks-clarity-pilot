
import React from "react";
import { useLocation } from "react-router-dom";
import SidebarLink from "./SidebarLink";
import SidebarCollapsibleItem from "./SidebarCollapsibleItem";
import SidebarSubmenu from "./SidebarSubmenu";
import { sidebarLinks } from "./navigationData";

type SidebarNavigationProps = {
  expandedItems: Record<string, boolean>;
  toggleExpand: (path: string) => void;
};

const SidebarNavigation = ({ expandedItems, toggleExpand }: SidebarNavigationProps) => {
  const location = useLocation();
  
  return (
    <nav className="flex-1 space-y-1 px-3 py-3 overflow-y-auto">
      {sidebarLinks.map((link) => {
        const isActive = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);
        const hasSubItems = link.subItems && link.subItems.length > 0;
        const isExpanded = expandedItems[link.path];
        const showSubItems = hasSubItems && isExpanded;
        
        return (
          <div key={link.path}>
            {hasSubItems ? (
              <SidebarCollapsibleItem
                label={link.label}
                icon={link.icon}
                isActive={isActive}
                isExpanded={isExpanded}
                toggleExpand={() => toggleExpand(link.path)}
              />
            ) : (
              <SidebarLink
                to={link.path}
                isActive={isActive}
                icon={link.icon}
                label={link.label}
                badge={link.label === "Upgrade" ? "New" : undefined}
              />
            )}
            
            {showSubItems && link.subItems && (
              <SidebarSubmenu
                subItems={link.subItems}
                showSubItems={showSubItems}
                currentPath={location.pathname}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default SidebarNavigation;
