
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { UserSubscriptionData } from '../types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UseSubscriptionDataProps {
  userId?: string;
}

const useSubscriptionData = ({ userId }: UseSubscriptionDataProps = {}) => {
  const [subscriptionData, setSubscriptionData] = useState<UserSubscriptionData | null>(null);
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchSubscriptionData = async () => {
      setLoading(true);
      try {
        // Query the profiles table instead of user_subscriptions
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching subscription data:', error);
          if (error.message === "JWT expired") {
            toast.error("Session expired, please login again");
            signOut();
            navigate('/login');
          }
        } else if (data) {
          // Transform profile data to match UserSubscriptionData structure
          const userData: UserSubscriptionData = {
            id: data.id,
            user_id: data.id,
            email: data.email || '',
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            subscription_tier: data.subscription_tier || 'free',
            created_at: data.created_at || new Date().toISOString(),
            updated_at: data.updated_at || new Date().toISOString()
          };
          setSubscriptionData(userData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [userId, signOut, navigate]);

  return { subscriptionData, loading };
};

export default useSubscriptionData;
