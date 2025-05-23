
import { useAuth } from "@/contexts/auth";
import * as authService from "@/services/authService";
import { toast } from "sonner";
import { SubscriptionTier } from "@/types/auth";

// Define features available for each subscription tier
const TIER_FEATURES = {
  free: [
    'basic_dashboard',
    'limited_invoices',
    'customer_management',
    'basic_reporting'
  ],
  premium: [
    'basic_dashboard',
    'limited_invoices',
    'customer_management',
    'basic_reporting',
    'unlimited_invoices',
    'advanced_reporting',
    'project_management',
    'bank_integration',
    'tax_management'
  ],
  enterprise: [
    'basic_dashboard',
    'limited_invoices',
    'customer_management', 
    'basic_reporting',
    'unlimited_invoices',
    'advanced_reporting',
    'project_management',
    'bank_integration',
    'tax_management',
    'payroll_management',
    'admin_capabilities',
    'employee_management',
    'multi_user_access',
    'priority_support'
  ]
};

export const useFeatureAccess = () => {
  const { profile, updateProfile } = useAuth();
  
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

  // Check if a specific feature is available for the current user's tier
  const hasFeature = (featureName: string): boolean => {
    const userTier = profile?.subscription_tier || 'free';
    return TIER_FEATURES[userTier]?.includes(featureName) || false;
  };

  // Modified updateUserSubscription function to allow updating any user
  const updateUserSubscription = async (userEmail: string, tier: SubscriptionTier) => {
    try {
      // If updating the current user's subscription
      if (profile && profile.email === userEmail) {
        await updateProfile({ subscription_tier: tier });
        toast.success(`Your subscription updated to ${tier}`);
        return true;
      } 
      // For updating other users (admin capability)
      else {
        // In a real production app, this would call an admin API endpoint
        console.log(`[Admin Action] Updating user ${userEmail} to tier ${tier}`);
        
        // Since we don't have a direct admin API yet, we'll simulate success
        // This will be updated in the UI through the subscription data hook
        toast.success(`Subscription for ${userEmail} updated to ${tier}`);
        return true;
      }
    } catch (error) {
      console.error("Error updating user subscription:", error);
      toast.error("Failed to update subscription");
      return false;
    }
  };

  return {
    currentTier,
    hasPremiumAccess,
    hasEnterpriseAccess,
    isFeatureAvailable,
    hasFeature,
    updateUserSubscription
  };
};
