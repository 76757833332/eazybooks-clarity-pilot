
import React from "react";
import { cn } from "@/lib/utils";

type SidebarCollapsibleItemProps = {
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  isExpanded: boolean;
  toggleExpand: () => void;
};

const SidebarCollapsibleItem = ({ 
  label, 
  icon: Icon, 
  isActive, 
  isExpanded,
  toggleExpand 
}: SidebarCollapsibleItemProps) => {
  return (
    <button
      className={cn(
        "w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-eazybooks-purple/10",
        isActive
          ? "bg-eazybooks-purple/20 text-eazybooks-purple font-medium"
          : "text-muted-foreground"
      )}
      onClick={toggleExpand}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} />
        <span>{label}</span>
      </div>
      <span className="text-xs">{isExpanded ? "▼" : "▶"}</span>
    </button>
  );
};

export default SidebarCollapsibleItem;
