
import { useAuth } from "@/contexts/auth";
import { SubscriptionTier } from "@/contexts/auth/types";

type FeatureTier = 'free' | 'premium' | 'enterprise';

export function useFeatureAccess() {
  const { profile } = useAuth();
  const userTier = profile?.subscription_tier || 'free';
  
  const isFeatureAvailable = (requiredTier: FeatureTier): boolean => {
    const tierHierarchy = { 'free': 0, 'premium': 1, 'enterprise': 2 };
    
    return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
  };
  
  return {
    isFeatureAvailable,
    currentTier: userTier
  };
}
