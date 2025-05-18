
import React from "react";
import { Badge } from "@/components/ui/badge";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/contexts/auth/types";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";

interface WelcomeHeaderProps {
  user: User | null;
  profile: Profile | null;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ user, profile }) => {
  const { currentTier } = useFeatureAccess();
  const displayName = profile?.first_name || user?.email?.split('@')[0] || 'User';
  
  // Function to get badge color based on subscription tier
  const getSubscriptionBadgeColor = () => {
    switch (currentTier) {
      case 'premium':
        return 'bg-amber-500';
      case 'enterprise':
        return 'bg-purple-600';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="mb-6 flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">
          Welcome back, {displayName}
        </h1>
        <Badge className={getSubscriptionBadgeColor()}>
          {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
        </Badge>
      </div>
      <p className="text-muted-foreground">
        Client Dashboard
      </p>
    </div>
  );
};

export default WelcomeHeader;
