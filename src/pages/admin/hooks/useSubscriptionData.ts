import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { SubscriptionTier } from "@/contexts/auth/types";
import { UserSubscriptionData } from "../types";
import * as authService from "@/services/authService";

export const useSubscriptionData = () => {
  const { user, profile } = useAuth();
  const { updateUserSubscription } = useFeatureAccess();
  const [users, setUsers] = useState<UserSubscriptionData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserSubscriptionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<{id: string, tier: SubscriptionTier} | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Delete user state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{id: string, name: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const itemsPerPage = 5;
  
  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Filter and search users
  useEffect(() => {
    let result = [...users];
    
    // Apply tier filter
    if (tierFilter !== "all") {
      result = result.filter(user => user.subscription_tier === tierFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.first_name.toLowerCase().includes(query) || 
        user.last_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }
    
    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page on filter change
  }, [users, tierFilter, searchQuery]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Since we don't have a profiles table in the database yet,
        // we'll simulate the data for now
        // In a real app, you would query the profiles table
        
        // Updated mock data: Only include Lucky Ndumbu with enterprise tier
        // Remove any duplicate free accounts
        const mockUsers: UserSubscriptionData[] = [
          // Add Lucky Ndumbu with enterprise tier as the only user
          {
            id: "lucky-admin",
            email: "richndumbu@gmail.com",
            first_name: "Lucky",
            last_name: "Ndumbu",
            subscription_tier: "enterprise",
            user_id: "lucky-admin"
          }
        ];
        
        // Only add current user if it's not Lucky Ndumbu (to avoid duplicates)
        if (user?.email !== "richndumbu@gmail.com") {
          mockUsers.push({
            id: user?.id || "current-user",
            email: user?.email || "current@example.com",
            first_name: profile?.first_name || "Current",
            last_name: profile?.last_name || "User",
            subscription_tier: profile?.subscription_tier || "free",
            user_id: user?.id || "current-user"
          });
        }
        
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [user, profile]);

  // Keep Lucky as enterprise and remove duplicates
  useEffect(() => {
    if (!isLoading && users.length > 0) {
      // Check for Lucky's email 
      const luckyEmail = "richndumbu@gmail.com";
      
      // Find duplicates of Lucky's account
      const luckyAccounts = users.filter(user => user.email === luckyEmail);
      
      // If we have duplicates, keep only the enterprise one
      if (luckyAccounts.length > 1) {
        const updatedUsers = users.filter(user => 
          user.email !== luckyEmail || user.subscription_tier === "enterprise"
        );
        setUsers(updatedUsers);
      }
      
      // If Lucky exists but isn't enterprise, update them
      const lucky = users.find(user => user.email === luckyEmail);
      if (lucky && lucky.subscription_tier !== 'enterprise') {
        handleUpdateSubscription(lucky.id, 'enterprise');
      }
    }
  }, [isLoading, users]);

  const confirmUpdateSubscription = (userId: string, tier: SubscriptionTier) => {
    setUserToUpdate({id: userId, tier});
    setDialogOpen(true);
  };

  const handleUpdateSubscription = async (userId: string, tier: SubscriptionTier) => {
    setIsUpdating(true);
    try {
      // Find the user in our local state
      const userToUpdate = users.find(u => u.id === userId);
      
      if (userToUpdate) {
        // For the specific user we want to ensure is enterprise
        if (userToUpdate.email === "richndumbu@gmail.com" && tier !== "enterprise") {
          toast.error("This user must remain on the Enterprise plan");
          setIsUpdating(false);
          return;
        }
        
        // In a real app, you would update the user's subscription in the database
        // Try to update using our new function first
        if (userToUpdate.email) {
          await updateUserSubscription(userToUpdate.email, tier);
        }
      }
      
      // Update subscription in local state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, subscription_tier: tier } : u
        )
      );
      
      toast.success(`Subscription updated to ${tier}`);
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update subscription");
    } finally {
      setIsUpdating(false);
      setDialogOpen(false);
    }
  };

  // Prepare to delete a user
  const confirmDeleteUser = (userId: string, userName: string) => {
    setUserToDelete({id: userId, name: userName});
    setDeleteDialogOpen(true);
  };

  // Delete a user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      // In a real app, call the API to delete the user
      // For now, we'll simulate deletion by removing from local state
      await authService.deleteUser(userToDelete.id);
      
      // Update local state after successful deletion
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
      toast.success(`User ${userToDelete.name} has been deleted`);
      
      // Close the dialog
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    users: currentItems,
    filteredUsers,
    isLoading,
    searchQuery,
    setSearchQuery,
    tierFilter,
    setTierFilter,
    currentPage,
    setCurrentPage,
    dialogOpen,
    setDialogOpen,
    userToUpdate,
    setUserToUpdate,
    isUpdating,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    confirmUpdateSubscription,
    handleUpdateSubscription,
    // Delete user properties
    deleteDialogOpen,
    setDeleteDialogOpen,
    userToDelete,
    setUserToDelete,
    isDeleting,
    confirmDeleteUser,
    handleDeleteUser
  };
};
