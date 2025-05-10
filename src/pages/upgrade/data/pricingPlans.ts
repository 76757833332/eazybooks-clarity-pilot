
import { PricingPlan } from "../types";

export const pricingPlans: PricingPlan[] = [
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
    buttonText: "Current Plan"
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
    checkoutUrl: "https://eazybooks.lemonsqueezy.com/buy/d58cf4a3-d41c-45df-a983-5ace391c0e24"
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
    checkoutUrl: "https://eazybooks.lemonsqueezy.com/buy/0e97cccf-68b2-4e16-8af9-92ddb21c904f"
  },
];
