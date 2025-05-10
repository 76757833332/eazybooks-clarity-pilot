
import React from "react";
import { Badge } from "@/components/ui/badge";
import { User, Profile } from "@/contexts/auth/types";

interface WelcomeHeaderProps {
  user: User | null;
  profile: Profile | null;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ user, profile }) => {
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

  return (
    <div className="mb-6 flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">
          Welcome back, {profile?.first_name || user?.email}
        </h1>
        {profile?.subscription_tier && (
          <Badge className={getSubscriptionBadgeColor()}>
            {profile.subscription_tier.charAt(0).toUpperCase() + profile.subscription_tier.slice(1)}
          </Badge>
        )}
      </div>
      <p className="text-muted-foreground">
        Client Dashboard
      </p>
    </div>
  );
};

export default WelcomeHeader;
