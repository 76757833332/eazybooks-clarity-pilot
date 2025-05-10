
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";

const SidebarPromo = () => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  const { isFeatureAvailable } = useFeatureAccess();
  
  // Check if the user has a premium or enterprise subscription
  const isPremium = isFeatureAvailable('premium');
  
  if (isPremium || dismissed) return null; // Don't show promo to premium users or if dismissed

  const handleUpgradeClick = () => {
    // Navigate to the upgrade page instead of direct checkout
    navigate("/upgrade");
  };
  
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
  };
  
  return (
    <div className="mx-3 mb-3 rounded-lg bg-eazybooks-purple bg-opacity-20 p-4 relative">
      <button 
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
      
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-eazybooks-purple">
        <Sparkles size={16} className="text-eazybooks-purple" />
        EazyBooks Pro
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        Unlock premium features including payroll, advanced reporting and AI insights
      </p>
      <button 
        onClick={handleUpgradeClick}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-eazybooks-purple px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-eazybooks-purple-secondary">
        Upgrade now
      </button>
    </div>
  );
};

export default SidebarPromo;
