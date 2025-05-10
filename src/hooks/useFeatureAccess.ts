
import { useAuth } from "@/contexts/auth";
import { SubscriptionTier } from "@/contexts/auth/types";
import { toast } from "sonner";

type FeatureTier = 'free' | 'premium' | 'enterprise';

export function useFeatureAccess() {
  const { profile, updateProfile } = useAuth();
  const userTier = profile?.subscription_tier || 'free';
  
  const isFeatureAvailable = (requiredTier: FeatureTier): boolean => {
    const tierHierarchy = { 'free': 0, 'premium': 1, 'enterprise': 2 };
    
    return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
  };
  
  const updateUserSubscription = async (email: string, newTier: SubscriptionTier): Promise<boolean> => {
    try {
      // Special case for Lucky Ndumbu
      if (email === "richndumbu@gmail.com" && newTier !== 'enterprise') {
        toast.error("This user must remain on the Enterprise plan");
        return false;
      }
      
      // Use the updateProfile function from AuthContext
      // This is a simplified approach that works with the current Auth context
      // We're only updating the current logged-in user's profile
      if (profile?.email === email) {
        await updateProfile({ subscription_tier: newTier });
        toast.success(`Subscription updated to ${newTier}`);
        return true;
      } 
      else {
        // In a real application, this would need admin privileges to update other users
        // For now, we'll show a toast message for demonstration
        toast.success(`Subscription for ${email} would be updated to ${newTier}`);
        return true;
      }
    } catch (error) {
      console.error("Error updating user subscription:", error);
      toast.error("Failed to update user subscription");
      return false;
    }
  };
  
  return {
    isFeatureAvailable,
    currentTier: userTier,
    updateUserSubscription
  };
}
