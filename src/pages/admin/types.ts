
import { SubscriptionTier } from "@/contexts/auth/types";

// Interface for user data in the subscription approval list
export interface UserSubscriptionData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  subscription_tier: SubscriptionTier;
  user_id: string;
}

export interface SubscriptionUpdateParams {
  id: string;
  tier: SubscriptionTier;
}
