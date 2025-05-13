
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/theme";

type SidebarLinkProps = {
  to: string;
  isActive: boolean;
  icon: React.ElementType;
  label: string;
  badge?: string;
  onClick?: () => void;
};

const SidebarLink = ({ to, isActive, icon: Icon, label, badge, onClick }: SidebarLinkProps) => {
  const { resolvedTheme } = useTheme();
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        resolvedTheme === 'light' 
          ? isActive
            ? "bg-eazybooks-purple/10 text-eazybooks-purple font-medium" 
            : "text-gray-600 hover:bg-gray-100"
          : isActive
            ? "bg-eazybooks-purple/20 text-eazybooks-purple font-medium"
            : "text-muted-foreground hover:bg-eazybooks-purple/10"
      )}
      onClick={onClick}
    >
      <Icon size={18} />
      <span>{label}</span>
      {label === "Upgrade" && badge && (
        <span className="ml-auto bg-eazybooks-purple text-white text-xs px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
};

export default SidebarLink;
