import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { UserSubscriptionData } from '../types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UseSubscriptionDataProps {
  userId: string | undefined;
}

const useSubscriptionData = ({ userId }: UseSubscriptionDataProps) => {
  const [subscriptionData, setSubscriptionData] = useState<UserSubscriptionData | null>(null);
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();
	const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchSubscriptionData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error('Error fetching subscription data:', error);
					if (error.message === "JWT expired" ) {
						toast.error("Session expired, please login again")
						signOut()
						navigate('/login')
					}
          // Handle error appropriately, maybe set an error state
        } else {
          setSubscriptionData(data as UserSubscriptionData);
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
