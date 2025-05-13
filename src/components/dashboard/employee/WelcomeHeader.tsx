
import React from "react";
import { Badge } from "@/components/ui/badge";
import { getSubscriptionBadgeColor } from "./dashboardUtils";

interface WelcomeHeaderProps {
  firstName?: string;
  email?: string;
  subscriptionTier?: string;
}

const WelcomeHeader = ({ firstName, email, subscriptionTier }: WelcomeHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">
          Welcome back, {firstName || email}
        </h1>
        {subscriptionTier && (
          <Badge className={getSubscriptionBadgeColor(subscriptionTier)}>
            {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
          </Badge>
        )}
      </div>
      <p className="text-muted-foreground">
        Employee Dashboard
      </p>
    </div>
  );
};

export default WelcomeHeader;
