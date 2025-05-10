
import React from "react";
import { Check } from "lucide-react";
import { PricingFeature } from "../types";

interface PlanFeatureProps {
  feature: PricingFeature;
}

const PlanFeature: React.FC<PlanFeatureProps> = ({ feature }) => {
  return (
    <li className="flex items-start gap-2">
      {feature.included ? (
        <Check className="h-5 w-5 text-eazybooks-purple shrink-0 mt-0.5" />
      ) : (
        <Check className="h-5 w-5 text-muted-foreground opacity-30 shrink-0 mt-0.5" />
      )}
      <span className={!feature.included ? "text-muted-foreground" : ""}>
        {feature.name}
      </span>
    </li>
  );
};

export default PlanFeature;
