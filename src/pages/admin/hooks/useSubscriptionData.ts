
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/auth';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { SubscriptionData } from '../types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionTier } from '@/contexts/auth/types';

export const useSubscriptionData = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [userToUpdate, setUserToUpdate] = useState<{ id: string; tier: SubscriptionTier } | null>(null);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  
  const { toast } = useToast();
  const { updateUserSubscription } = useFeatureAccess();

  // Calculate filtered users based on search query and tier filter
  const filteredUsers = useMemo(() => {
    return subscriptions.filter(user => {
      const matchesSearch = searchQuery === '' || 
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTier = tierFilter === 'all' || user.subscription_tier === tierFilter;
      
      return matchesSearch && matchesTier;
    });
  }, [subscriptions, searchQuery, tierFilter]);

  // Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const users = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Function to update a user's subscription tier
  const updateSubscription = async (email: string, tier: SubscriptionTier) => {
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

  // Function to handle the update of a subscription
  const handleUpdateSubscription = async (userId: string, tier: SubscriptionTier) => {
    setIsUpdating(true);
    // Find the user email from the subscriptions array
    const user = subscriptions.find(user => user.id === userId);
    if (user) {
      await updateSubscription(user.email, tier);
    }
    setIsUpdating(false);
    setDialogOpen(false);
    setUserToUpdate(null);
  };

  // Function to confirm updating a subscription
  const confirmUpdateSubscription = (userId: string, tier: SubscriptionTier) => {
    setUserToUpdate({ id: userId, tier });
    setDialogOpen(true);
  };

  // Function to delete a user
  const handleDeleteUser = async () => {
    setIsDeleting(true);
    // Implementation for deleting a user would go here
    // This is a placeholder as the actual delete functionality isn't implemented
    setTimeout(() => {
      toast({
        title: 'Not implemented',
        description: 'User deletion functionality is not yet implemented.',
      });
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }, 1000);
  };

  // Function to confirm deleting a user
  const confirmDeleteUser = (userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
    setDeleteDialogOpen(true);
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
  const approveSubscription = async (email: string, tier: SubscriptionTier) => {
    return updateSubscription(email, tier);
  };

  // Function to reject a subscription request
  const rejectSubscription = async (email: string) => {
    return updateSubscription(email, 'free');
  };

  // Fetch subscriptions on mount
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return {
    subscriptions,
    users,
    filteredUsers,
    loading,
    isLoading: loading,
    updateSubscription,
    fetchSubscriptions,
    approveSubscription,
    rejectSubscription,
    searchQuery,
    setSearchQuery,
    tierFilter,
    setTierFilter,
    currentPage,
    setCurrentPage,
    dialogOpen,
    setDialogOpen,
    userToUpdate,
    isUpdating,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    confirmUpdateSubscription,
    handleUpdateSubscription,
    deleteDialogOpen,
    setDeleteDialogOpen,
    userToDelete,
    isDeleting,
    confirmDeleteUser,
    handleDeleteUser
  };
};
