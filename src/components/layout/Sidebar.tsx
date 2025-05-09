
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/auth";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarSearch from "./sidebar/SidebarSearch";
import SidebarPromo from "./sidebar/SidebarPromo";
import SidebarUserProfile from "./sidebar/SidebarUserProfile";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "/payroll": true, // Default expanded state
  });

  const toggleExpand = (path: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-black/80 backdrop-blur-md overflow-hidden">
      <div className="flex items-center gap-2 p-6">
        <Logo size="md" />
      </div>

      <SidebarSearch />
      <SidebarNavigation expandedItems={expandedItems} toggleExpand={toggleExpand} />
      <SidebarPromo />
      <SidebarUserProfile />
    </div>
  );
};

export default Sidebar;
