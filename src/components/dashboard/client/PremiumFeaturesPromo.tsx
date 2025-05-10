
import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubscriptionTier } from "@/contexts/auth/types";

interface PremiumFeaturesPromoProps {
  subscriptionTier: SubscriptionTier | undefined;
}

const PremiumFeaturesPromo: React.FC<PremiumFeaturesPromoProps> = ({ subscriptionTier }) => {
  // Function to check if a feature is available based on subscription
  const isFeatureAvailable = (requiredTier: 'free' | 'premium' | 'enterprise') => {
    const tierHierarchy = { 'free': 0, 'premium': 1, 'enterprise': 2 };
    const userTier = subscriptionTier || 'free';
    
    return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
  };

  if (isFeatureAvailable('premium')) {
    return null;
  }

  return (
    <Card className="mt-6 border-amber-500/30 bg-amber-50/10">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lock size={18} className="text-amber-500" />
          <span className="text-amber-700">Premium Features Locked</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          Upgrade to Premium or Enterprise to unlock:
        </p>
        <ul className="list-disc ml-5 text-sm space-y-1 text-muted-foreground">
          <li>Unlimited project requests</li>
          <li>Priority project handling</li>
          <li>Custom project templates</li>
          <li>Advanced project reporting</li>
          <li>Dedicated account manager</li>
        </ul>
        <Button 
          className="mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
          asChild
        >
          <Link to="/upgrade">
            Upgrade Now
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PremiumFeaturesPromo;
