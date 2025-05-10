
export interface PricingFeature {
  name: string;
  included: boolean;
}

export interface PricingPlan {
  name: string;
  price: string;
  interval: string;
  description: string;
  features: PricingFeature[];
  buttonText: string;
  popular?: boolean;
  checkoutUrl?: string;
}
