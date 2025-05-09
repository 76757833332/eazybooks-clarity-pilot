
import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/auth";

const SidebarPromo = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  // Check if user has premium subscription (this would need to be updated based on your subscription model)
  const isPremium = profile?.subscription_tier === "premium" || profile?.subscription_tier === "enterprise";
  
  if (isPremium) return null; // Don't show promo to premium users
  
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
        onClick={() => navigate('/upgrade')}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-eazybooks-purple px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-eazybooks-purple-secondary">
        Upgrade now
      </button>
    </div>
  );
};

export default SidebarPromo;
