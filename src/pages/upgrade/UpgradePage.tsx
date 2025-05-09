
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth";
import { createCheckout } from "@/services/paymentService";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PricingFeature {
  name: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  interval: string;
  description: string;
  features: PricingFeature[];
  buttonText: string;
  popular?: boolean;
  productId: string;
  variantId: string;
}

const UpgradePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const pricingPlans: PricingPlan[] = [
    {
      name: "Free",
      price: "$0",
      interval: "forever",
      description: "Perfect for individuals and small businesses just starting out",
      features: [
        { name: "Single user access", included: true },
        { name: "Income & expense tracking", included: true },
        { name: "Basic invoice management", included: true },
        { name: "Up to 10 customers", included: true },
        { name: "Basic reporting", included: true },
        { name: "Bank integration", included: false },
        { name: "Payroll management", included: false },
        { name: "Project management", included: false },
        { name: "Team management", included: false },
      ],
      buttonText: "Current Plan",
      productId: "",
      variantId: "",
    },
    {
      name: "Professional",
      price: "$19",
      interval: "per month",
      description: "For growing businesses and teams",
      features: [
        { name: "Up to 5 team members", included: true },
        { name: "Income & expense tracking", included: true },
        { name: "Full invoice management", included: true },
        { name: "Unlimited customers", included: true },
        { name: "Advanced reporting", included: true },
        { name: "Bank integration", included: true },
        { name: "Payroll management", included: true },
        { name: "Project management", included: false },
        { name: "Team management", included: false },
      ],
      buttonText: "Upgrade Now",
      popular: true,
      productId: "510706", // Updated with real LemonSqueezy product ID
      variantId: "795950", // Updated with real LemonSqueezy variant ID
    },
    {
      name: "Enterprise",
      price: "$49",
      interval: "per month",
      description: "Complete solution for businesses of all sizes",
      features: [
        { name: "Unlimited team members", included: true },
        { name: "Income & expense tracking", included: true },
        { name: "Full invoice management", included: true },
        { name: "Unlimited customers", included: true },
        { name: "Advanced reporting with AI insights", included: true },
        { name: "Bank integration", included: true },
        { name: "Payroll management", included: true },
        { name: "Project management", included: true },
        { name: "Team management", included: true },
      ],
      buttonText: "Upgrade Now",
      productId: "510704", // Updated with real LemonSqueezy product ID
      variantId: "795952", // Updated with real LemonSqueezy variant ID
    },
  ];

  const handleUpgrade = async (plan: PricingPlan) => {
    if (plan.name === "Free") return;
    
    setCheckoutError(null);
    
    try {
      setLoadingPlan(plan.name);
      
      if (!user?.email) {
        toast.error("You need to be logged in with an email to upgrade.");
        return;
      }
      
      console.log(`Starting checkout for plan: ${plan.name}, product: ${plan.productId}, variant: ${plan.variantId}`);
      
      const result = await createCheckout(
        plan.productId, 
        plan.variantId,
        plan.name,
        user.email
      );
      
      if (result.success && result.url) {
        console.log(`Redirecting to checkout URL: ${result.url}`);
        // Redirect to LemonSqueezy checkout
        window.location.href = result.url;
      } else {
        console.error("Checkout failed:", result.error);
        setCheckoutError(`${result.error || "Unknown error"}`);
        toast.error(`Checkout failed: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
      toast.error("Failed to create checkout. Please try again.");
      setCheckoutError(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
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

        {checkoutError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Checkout Error</AlertTitle>
            <AlertDescription>
              {checkoutError}. Please try again or contact support if the issue persists.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.name}
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
                    <li key={index} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-eazybooks-purple shrink-0 mt-0.5" />
                      ) : (
                        <Check className="h-5 w-5 text-muted-foreground opacity-30 shrink-0 mt-0.5" />
                      )}
                      <span className={!feature.included ? "text-muted-foreground" : ""}>
                        {feature.name}
                      </span>
                    </li>
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
                  onClick={() => handleUpgrade(plan)}
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
          ))}
        </div>

        <div className="text-center mt-10">
          <h2 className="text-xl font-semibold mb-2">Need a custom solution?</h2>
          <p className="text-muted-foreground mb-4">
            Contact our sales team for a tailored package that fits your specific business needs.
          </p>
          <Button variant="outline" className="border-eazybooks-purple text-eazybooks-purple">
            Contact Sales
          </Button>
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-1">Can I upgrade or downgrade at any time?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, you can change your subscription at any time. Changes will be effective at the start of your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">How does billing work?</h3>
              <p className="text-muted-foreground text-sm">
                We bill monthly or annually based on your preference. You'll be charged automatically on the same date each month/year through LemonSqueezy, our secure payment processor.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">What payment methods do you accept?</h3>
              <p className="text-muted-foreground text-sm">
                We accept all major credit cards, PayPal, and bank transfers for annual plans through our payment provider.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Is there a refund policy?</h3>
              <p className="text-muted-foreground text-sm">
                We offer a 30-day money-back guarantee for all new subscriptions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default UpgradePage;
