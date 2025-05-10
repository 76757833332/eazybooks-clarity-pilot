
import { useAuth } from "@/contexts/auth";
import { SubscriptionTier } from "@/contexts/auth/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
      // First, find the user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
      
      if (userError || !userData) {
        toast.error(`User not found with email: ${email}`);
        return false;
      }
      
      // Update the user's subscription tier
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ subscription_tier: newTier })
        .eq('id', userData.id);
      
      if (updateError) {
        toast.error(`Failed to update subscription: ${updateError.message}`);
        return false;
      }
      
      toast.success(`Subscription updated to ${newTier} for ${email}`);
      return true;
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
