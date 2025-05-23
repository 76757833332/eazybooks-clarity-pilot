
import React from 'react';
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureGuardProps {
  feature: string;
  requiredTier: 'free' | 'premium' | 'enterprise';
  children: React.ReactNode;
  fallbackMessage?: string;
  showUpgradeButton?: boolean;
}

const FeatureGuard: React.FC<FeatureGuardProps> = ({ 
  feature,
  requiredTier,
  children,
  fallbackMessage,
  showUpgradeButton = true
}) => {
  const { isFeatureAvailable, currentTier } = useFeatureAccess();
  
  const canAccessFeature = isFeatureAvailable(feature);
  
  if (canAccessFeature) {
    return <>{children}</>;
  }
  
  return (
    <Card className="border-amber-500/30 bg-amber-50/10">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lock size={18} className="text-amber-500" />
          <span className="text-amber-700">{requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} Feature</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          {fallbackMessage || `This feature requires a ${requiredTier} subscription. Your current plan is ${currentTier}.`}
        </p>
        
        {showUpgradeButton && (
          <Button 
            className="mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            asChild
          >
            <Link to="/upgrade">
              Upgrade Now
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default FeatureGuard;
