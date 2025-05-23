import { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { SubscriptionData } from '../types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useSubscriptionData = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { updateUserSubscription } = useFeatureAccess();

  // Function to update a user's subscription tier
  const updateSubscription = async (email: string, tier: 'free' | 'premium' | 'enterprise') => {
    // Call the updateUserSubscription function from useFeatureAccess
    const success = await updateUserSubscription(email, tier);
    
    if (success) {
      toast({
        title: 'Subscription updated',
        description: `User ${email} has been upgraded to ${tier} tier.`,
      });
      
      // Update the local state to reflect the change
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.email === email ? { ...sub, subscription_tier: tier } : sub
        )
      );
      
      return true;
    } else {
      toast({
        title: 'Error updating subscription',
        description: 'Could not update the subscription. Please try again.',
        variant: 'destructive',
      });
      
      return false;
    }
  };

  // Function to fetch all subscription data
  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, subscription_tier, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: 'Error fetching data',
        description: 'Could not load subscription data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to approve a pending subscription
  const approveSubscription = async (email: string, tier: 'free' | 'premium' | 'enterprise') => {
    return updateSubscription(email, tier);
  };

  // Function to reject a subscription request
  const rejectSubscription = async (email: string) => {
    return updateSubscription(email, 'free');
  };

  return {
    subscriptions,
    loading,
    updateSubscription,
    fetchSubscriptions,
    approveSubscription,
    rejectSubscription
  };
};
