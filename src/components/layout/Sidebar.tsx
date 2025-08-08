import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/auth";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarSearch from "./sidebar/SidebarSearch";
import SidebarPromo from "./sidebar/SidebarPromo";
import SidebarUserProfile from "./sidebar/SidebarUserProfile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useTheme } from "@/contexts/theme";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, signOut, business } = useAuth();
  const { resolvedTheme } = useTheme();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "/payroll": true, // Default expanded state
  });

  const toggleExpand = (path: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const getInitials = () => {
    if (!user?.email) return "?";
    const email = user.email;
    return email.substring(0, 2).toUpperCase();
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to log out");
    }
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <div className={`flex h-screen w-64 flex-col border-r border-border overflow-hidden ${
      resolvedTheme === 'light' 
        ? 'bg-white' 
        : 'bg-black/80 backdrop-blur-md'
    }`}>
      {/* Profile section at the top */}
      <div className={`flex items-center justify-between p-4 border-b border-border ${
        resolvedTheme === 'light' ? 'bg-white' : ''
      }`}>
        <Logo size="md" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer hover:opacity-80 transition-opacity bg-eazybooks-gray-dark">
              {business?.logo_url ? (
                <img 
                  src={business.logo_url} 
                  alt={`${business?.name || 'Business'} logo`}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <AvatarFallback className="text-xs text-white font-medium">
                  {getInitials()}
                </AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className={`w-56 ${resolvedTheme === 'light' ? 'bg-white border-gray-200' : 'bg-black/90 border-gray-700'} text-foreground`}>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium">{business?.name || user?.email || 'User'}</p>
              <p className="text-xs text-muted-foreground">Business account</p>
            </div>
            <DropdownMenuSeparator className={resolvedTheme === 'light' ? 'bg-gray-200' : 'bg-gray-700'} />
            <DropdownMenuItem onClick={handleSettingsClick} className={`cursor-pointer ${resolvedTheme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-800'}`}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut} className={`cursor-pointer text-red-500 ${resolvedTheme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-800'}`}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SidebarSearch />
      <SidebarNavigation expandedItems={expandedItems} toggleExpand={toggleExpand} />
      <SidebarPromo />
      {/* User profile moved to top, so we can remove it from bottom */}
    </div>
  );
};

export default Sidebar;