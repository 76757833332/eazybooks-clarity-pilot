
import { useAuth } from "@/contexts/auth";

export const useFeatureAccess = () => {
  const { profile } = useAuth();
  
  // Get current subscription tier
  const currentTier = profile?.subscription_tier || 'free';

  // Premium features are available for premium and enterprise tiers
  const hasPremiumAccess = 
    currentTier === 'premium' || 
    currentTier === 'enterprise';

  // Enterprise features are available only for enterprise tier
  const hasEnterpriseAccess = 
    currentTier === 'enterprise';
    
  // Function to check if a feature is available based on subscription
  const isFeatureAvailable = (requiredTier: 'free' | 'premium' | 'enterprise') => {
    const tierHierarchy = { 'free': 0, 'premium': 1, 'enterprise': 2 };
    const userTier = profile?.subscription_tier || 'free';
    
    return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
  };

  return {
    currentTier,
    hasPremiumAccess,
    hasEnterpriseAccess,
    isFeatureAvailable
  };
};
