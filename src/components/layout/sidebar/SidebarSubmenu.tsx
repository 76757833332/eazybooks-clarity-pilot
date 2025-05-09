
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type SidebarSubmenuProps = {
  subItems: {
    label: string;
    path: string;
    icon?: React.ElementType;
  }[];
  showSubItems: boolean;
  currentPath: string;
};

const SidebarSubmenu = ({ subItems, showSubItems, currentPath }: SidebarSubmenuProps) => {
  if (!showSubItems) return null;
  
  return (
    <div className="ml-7 mt-1 space-y-1 border-l border-border pl-3">
      {subItems.map((subItem) => {
        const isSubActive = currentPath === subItem.path || currentPath.startsWith(`${subItem.path}/`);
        
        return (
          <Link
            key={subItem.path}
            to={subItem.path}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all hover:bg-eazybooks-purple/10",
              isSubActive
                ? "bg-eazybooks-purple/10 text-eazybooks-purple font-medium"
                : "text-muted-foreground"
            )}
          >
            {subItem.icon && <subItem.icon size={16} />}
            <span>{subItem.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default SidebarSubmenu;
