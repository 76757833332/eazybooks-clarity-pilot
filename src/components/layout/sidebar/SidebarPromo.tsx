
import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/auth";

const SidebarPromo = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  // Since subscription_tier doesn't exist in the Profile type, let's check if the user has premium status
  // For now, we'll assume non-premium until the subscription feature is fully implemented
  const isPremium = false; // This will be replaced with actual subscription logic later
  
  if (isPremium) return null; // Don't show promo to premium users

  const handleUpgradeClick = () => {
    // Direct link to Professional plan checkout
    window.location.href = "https://eazybooks.lemonsqueezy.com/buy/0e97cccf-68b2-4e16-8af9-92ddb21c904f";
  };
  
  return (
    <div className="mx-3 mb-3 rounded-lg bg-eazybooks-purple bg-opacity-20 p-4">
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
