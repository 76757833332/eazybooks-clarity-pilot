
import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PlanFeature from "./PlanFeature";
import { PricingPlan } from "../types";

interface PricingCardProps {
  plan: PricingPlan;
  loadingPlan: string | null;
  onUpgrade: (plan: PricingPlan) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, loadingPlan, onUpgrade }) => {
  return (
    <Card 
      className={`flex flex-col ${
        plan.popular 
          ? "border-eazybooks-purple shadow-lg shadow-eazybooks-purple/20" 
          : "border-border"
      }`}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{plan.name}</CardTitle>
          {plan.popular && (
            <Badge className="bg-eazybooks-purple text-white">Popular</Badge>
          )}
        </div>
        <div className="mt-2">
          <span className="text-3xl font-bold">{plan.price}</span>
          <span className="text-muted-foreground ml-1">{plan.interval}</span>
        </div>
        <CardDescription className="mt-2">{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <PlanFeature key={index} feature={feature} />
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className={`w-full ${
            plan.name === "Free"
              ? "bg-secondary text-foreground hover:bg-secondary/80"
              : "bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
          }`}
          onClick={() => onUpgrade(plan)}
          disabled={plan.name === "Free" || loadingPlan !== null}
        >
          {loadingPlan === plan.name ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            plan.buttonText
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
