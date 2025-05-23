
import React from "react";
import { useLocation } from "react-router-dom";
import SidebarLink from "./SidebarLink";
import SidebarCollapsibleItem from "./SidebarCollapsibleItem";
import SidebarSubmenu from "./SidebarSubmenu";
import { sidebarLinks } from "./navigationData";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";

type SidebarNavigationProps = {
  expandedItems: Record<string, boolean>;
  toggleExpand: (path: string) => void;
};

// Feature-to-path mapping to determine which navigation links should be visible
const navigationFeatureMap: Record<string, string> = {
  '/dashboard': 'basic_dashboard',
  '/customers': 'customer_management',
  '/invoices': 'limited_invoices',
  '/bank': 'bank_integration',
  '/projects': 'project_management',
  '/income': 'basic_reporting',
  '/expenses': 'basic_reporting',
  '/reports': 'basic_reporting',
  '/taxes': 'tax_management',
  '/payroll': 'payroll_management',
  '/admin': 'admin_capabilities',
};

const SidebarNavigation = ({ expandedItems, toggleExpand }: SidebarNavigationProps) => {
  const location = useLocation();
  const { hasFeature } = useFeatureAccess();
  
  // Filter sidebar links based on the user's subscription features
  const filteredLinks = sidebarLinks.filter(link => {
    // Always show Upgrade and Settings links
    if (link.path === '/upgrade' || link.path === '/settings') {
      return true;
    }
    
    // Show links only if the user has the required feature
    const requiredFeature = navigationFeatureMap[link.path];
    if (!requiredFeature) return true; // If no feature requirement is defined, show by default
    
    return hasFeature(requiredFeature);
  });
  
  return (
    <nav className="flex-1 space-y-1 px-3 py-3 overflow-y-auto">
      {filteredLinks.map((link) => {
        const isActive = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);
        const hasSubItems = link.subItems && link.subItems.length > 0;
        const isExpanded = expandedItems[link.path];
        const showSubItems = hasSubItems && isExpanded;
        
        return (
          <React.Fragment key={link.path}>
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
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default SidebarNavigation;
