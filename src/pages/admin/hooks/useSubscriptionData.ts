
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { UserSubscriptionData } from '../types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { SubscriptionTier } from '@/contexts/auth/types';

const useSubscriptionData = () => {
  const [users, setUsers] = useState<UserSubscriptionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<{ id: string; tier: SubscriptionTier } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const itemsPerPage = 10;

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching users:', error);
          if (error.message === "JWT expired") {
            toast.error("Session expired, please login again");
            signOut();
            navigate('/login');
          }
        } else if (data) {
          const userData: UserSubscriptionData[] = data.map(profile => ({
            id: profile.id,
            user_id: profile.id,
            email: profile.email || '',
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            subscription_tier: profile.subscription_tier || 'free',
            created_at: profile.created_at || new Date().toISOString(),
            updated_at: profile.updated_at || new Date().toISOString()
          }));
          setUsers(userData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [signOut, navigate]);

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchQuery === "" || 
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTier = tierFilter === "all" || user.subscription_tier === tierFilter;
      
      return matchesSearch && matchesTier;
    });
  }, [users, searchQuery, tierFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Subscription update functions
  const confirmUpdateSubscription = (userId: string, tier: SubscriptionTier) => {
    setUserToUpdate({ id: userId, tier });
    setDialogOpen(true);
  };

  const handleUpdateSubscription = async (userId: string, tier: SubscriptionTier) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_tier: tier })
        .eq('id', userId);

      if (error) {
        console.error('Error updating subscription:', error);
        toast.error('Failed to update subscription');
      } else {
        toast.success('Subscription updated successfully');
        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId 
              ? { ...user, subscription_tier: tier }
              : user
          )
        );
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Failed to update subscription');
    } finally {
      setIsUpdating(false);
      setDialogOpen(false);
      setUserToUpdate(null);
    }
  };

  // Delete user functions
  const confirmDeleteUser = (userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
    setDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      // Note: In a real application, you'd want to use a proper admin API
      // For now, we'll just remove from profiles table
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id);

      if (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      } else {
        toast.success('User deleted successfully');
        // Update local state
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return {
    users: currentUsers,
    filteredUsers,
    isLoading: loading,
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

export default useSubscriptionData;
