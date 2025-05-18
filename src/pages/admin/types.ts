
export interface UserSubscriptionData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  subscription_tier: string;
  user_id: string;
}

export type SubscriptionTier = 'free' | 'premium' | 'enterprise';
