
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Crown, Settings, Lock } from "lucide-react";
import { useAuth } from "@/contexts/auth";

interface BusinessWelcomeHeaderProps {
  onOpenInviteModal: () => void;
}

const BusinessWelcomeHeader: React.FC<BusinessWelcomeHeaderProps> = ({ 
  onOpenInviteModal 
}) => {
  const { user, profile, business } = useAuth();
  
  // Check if user has admin privileges
  const isAdmin = profile?.subscription_tier === 'enterprise' || 
                 profile?.role === 'business_owner';

  // Function to get badge color based on subscription tier
  const getSubscriptionBadgeColor = () => {
    switch (profile?.subscription_tier) {
      case 'premium':
        return 'bg-amber-500';
      case 'enterprise':
        return 'bg-purple-600';
      default:
        return 'bg-gray-500';
    }
  };

  // Function to check if a feature is available based on subscription
  const isFeatureAvailable = (requiredTier: 'free' | 'premium' | 'enterprise') => {
    const tierHierarchy = { 'free': 0, 'premium': 1, 'enterprise': 2 };
    const userTier = profile?.subscription_tier || 'free';
    
    return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
  };

  // Determine business display name based on available info
  const businessDisplayName = business?.name || "Your Business";
  
  // Helper to format incomplete address data
  const formatBusinessAddress = () => {
    if (!business) return null;
    
    const addressParts = [];
    if (business.city) addressParts.push(business.city);
    if (business.state) addressParts.push(business.state);
    if (business.country) addressParts.push(business.country);
    
    return addressParts.length > 0 ? addressParts.join(', ') : null;
  };
  
  const businessAddress = formatBusinessAddress();
  
  return (
    <>
      <div className="mb-6 flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">
            Welcome back, {profile?.first_name || user?.email?.split('@')[0] || 'User'}
          </h1>
          {profile?.subscription_tier && (
            <Badge className={getSubscriptionBadgeColor()}>
              {profile.subscription_tier.charAt(0).toUpperCase() + profile.subscription_tier.slice(1)}
            </Badge>
          )}
        </div>
        <div className="text-muted-foreground flex flex-col">
          <p className="flex items-center gap-1">
            <span className="font-medium">{businessDisplayName}</span>
            {businessAddress && (
              <>
                <span className="mx-1">•</span>
                <span>{businessAddress}</span>
              </>
            )}
          </p>
          <p>Business Owner Dashboard</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-between mb-6">
        <h2 className="text-xl font-semibold">Business Overview</h2>
        <div className="flex gap-2 flex-wrap">
          {isAdmin && (
            <Button
              variant="outline"
              className="flex items-center gap-1 border-eazybooks-purple text-eazybooks-purple"
              asChild
            >
              <Link to="/admin/subscriptions">
                <Crown size={16} />
                Manage Subscriptions
              </Link>
            </Button>
          )}
          <Button
            onClick={onOpenInviteModal}
            variant="outline"
            className="flex items-center gap-1 border-eazybooks-purple text-eazybooks-purple"
          >
            <PlusCircle size={16} />
            Invite User
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-1 border-eazybooks-purple text-eazybooks-purple"
            asChild
          >
            <Link to="/settings/business">
              <Settings size={16} />
              Business Settings
            </Link>
          </Button>
          {!isFeatureAvailable('premium') && (
            <Button
              variant="outline"
              className="flex items-center gap-1 border-amber-500 text-amber-500"
              asChild
            >
              <Link to="/upgrade">
                <Lock size={16} />
                Upgrade Plan
              </Link>
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default BusinessWelcomeHeader;
