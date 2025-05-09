
import React from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";

const SidebarUserProfile = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  
  const getInitials = () => {
    if (!user?.email) return "?";
    const email = user.email;
    return email.substring(0, 2).toUpperCase();
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  return (
    <div className="border-t border-border p-3">
      <div className="flex items-center gap-3 rounded-lg px-3 py-2">
        <div className="h-8 w-8 rounded-full bg-eazybooks-gray-dark flex items-center justify-center text-xs text-white font-medium">
          {getInitials()}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user?.email || 'User'}</span>
          <span className="text-xs text-muted-foreground">Business account</span>
        </div>
        <div className="ml-auto flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:bg-secondary hover:text-foreground"
            onClick={() => navigate('/settings')}
          >
            <Settings size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
            onClick={handleSignOut}
          >
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarUserProfile;
