
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/auth";
import { pricingPlans } from "./data/pricingPlans";
import PricingCard from "./components/PricingCard";
import ContactSales from "./components/ContactSales";
import UpgradeFAQ from "./components/UpgradeFAQ";
import { PricingPlan } from "./types";

const UpgradePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleUpgrade = async (plan: PricingPlan) => {
    if (plan.name === "Free") return;
    
    try {
      setLoadingPlan(plan.name);
      
      if (!plan.checkoutUrl) {
        console.error("No checkout URL available for this plan");
        return;
      }
      
      // Redirect to direct Lemon Squeezy checkout URL
      window.location.href = plan.checkoutUrl;
      
    } catch (error) {
      console.error("Error navigating to checkout:", error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <AppLayout title="Upgrade Your Plan">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Choose the Right Plan for Your Business</h1>
          <p className="text-muted-foreground mt-2">
            Scale your financial management as your business grows
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <PricingCard 
              key={plan.name} 
              plan={plan} 
              loadingPlan={loadingPlan} 
              onUpgrade={handleUpgrade} 
            />
          ))}
        </div>

        <ContactSales />
        <UpgradeFAQ />
      </div>
    </AppLayout>
  );
};

export default UpgradePage;
