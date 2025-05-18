
import { useAuth } from "@/contexts/auth";
import * as authService from "@/services/authService";
import { toast } from "sonner";
import { SubscriptionTier } from "@/types/auth";

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

  // Add the missing updateUserSubscription function
  const updateUserSubscription = async (userEmail: string, tier: SubscriptionTier) => {
    try {
      // Find the user profile by email (in a real app, we would use an admin API)
      // For now, we'll only allow updating the current user's subscription
      if (profile && profile.email === userEmail) {
        await updateProfile({ subscription_tier: tier });
        toast.success(`Subscription updated to ${tier}`);
        return true;
      } else {
        // In a real app with admin capabilities, you would call an admin API
        console.log(`[Admin Action] Would update user ${userEmail} to tier ${tier}`);
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
    updateUserSubscription
  };
};
