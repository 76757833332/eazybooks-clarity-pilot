import { useAuth } from "@/contexts/auth";
import { useState, useEffect } from "react";

type FeatureTier = 'free' | 'premium' | 'enterprise';

// Define which features are available for each subscription tier
const featureMap: Record<string, FeatureTier[]> = {
  // Basic features available to all tiers
  'basic_reporting': ['free', 'premium', 'enterprise'],
  'invoice_creation': ['free', 'premium', 'enterprise'],
  'customer_management': ['free', 'premium', 'enterprise'],
  
  // Premium features
  'advanced_reporting': ['premium', 'enterprise'],
  'recurring_invoices': ['premium', 'enterprise'],
  'team_members': ['premium', 'enterprise'],
  'api_access': ['premium', 'enterprise'],
  
  // Enterprise features
  'white_labeling': ['enterprise'],
  'dedicated_support': ['enterprise'],
  'custom_integrations': ['enterprise'],
  'multi_business': ['enterprise'],
};

// Add currency-related features
export const currencyFeatures = {
  'custom_currency': ['premium', 'enterprise'],
  'multi_currency': ['enterprise'],
};

export const useFeatureAccess = () => {
  const { profile } = useAuth();
  const [currentTier, setCurrentTier] = useState<FeatureTier>('free');
  
  // Update the current tier when the profile changes
  useEffect(() => {
    if (profile?.subscription_tier) {
      setCurrentTier(profile.subscription_tier as FeatureTier);
    } else {
      setCurrentTier('free');
    }
  }, [profile]);
  
  // Check if a specific feature is available for the current subscription tier
  const isFeatureAvailable = (feature: string): boolean => {
    const allowedTiers = featureMap[feature];
    if (!allowedTiers) {
      console.warn(`Feature "${feature}" is not defined in the feature map`);
      return false;
    }
    return allowedTiers.includes(currentTier);
  };
  
  // Check if the current tier is at least the specified tier
  const isTierAtLeast = (tier: FeatureTier): boolean => {
    const tierValues: Record<FeatureTier, number> = {
      'free': 0,
      'premium': 1,
      'enterprise': 2
    };
    
    return tierValues[currentTier] >= tierValues[tier];
  };
  
  return {
    currentTier,
    isFeatureAvailable,
    isTierAtLeast,
    isPremium: isTierAtLeast('premium'),
    isEnterprise: isTierAtLeast('enterprise')
  };
};
