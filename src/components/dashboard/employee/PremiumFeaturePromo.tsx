
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface PremiumFeaturePromoProps {
  isVisible: boolean;
}

const PremiumFeaturePromo = ({ isVisible }: PremiumFeaturePromoProps) => {
  if (!isVisible) return null;

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
          Ask your manager to upgrade to Premium or Enterprise to unlock:
        </p>
        <ul className="list-disc ml-5 text-sm space-y-1 text-muted-foreground">
          <li>Advanced time tracking</li>
          <li>Project management tools</li>
          <li>Detailed performance metrics</li>
          <li>Automated leave management</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default PremiumFeaturePromo;
