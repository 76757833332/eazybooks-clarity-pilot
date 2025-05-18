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

  useEffect(() => {
    // Check if we need to make Lucky an enterprise user
    const makeLuckyEnterprise = async () => {
      const luckyEmail = "richndumbu@gmail.com";
      
      // Check if Lucky exists in our data
      const luckyExists = users.some(user => user.email === luckyEmail);
      
      // If Lucky exists in our data but isn't enterprise, update them
      if (luckyExists) {
        const lucky = users.find(user => user.email === luckyEmail);
        if (lucky && lucky.subscription_tier !== 'enterprise') {
          await handleUpdateSubscription(lucky.id, 'enterprise');
        }
      } 
      // If Lucky doesn't exist in our data yet, add them with enterprise tier
      else {
        const newLucky: UserSubscriptionData = {
          id: "lucky-admin",
          email: luckyEmail,
          first_name: "Lucky",
          last_name: "Ndumbu",
          subscription_tier: "enterprise",
          user_id: "lucky-admin"
        };
        setUsers(prev => [...prev, newLucky]);
      }
    };
    
    // If the component has loaded users, check for Lucky
    if (!isLoading && users.length > 0) {
      makeLuckyEnterprise();
    }
  }, [isLoading, users]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Since we don't have a profiles table in the database yet,
        // we'll simulate the data for now
        // In a real app, you would query the profiles table
        
        // Mock data for users
        const mockUsers: UserSubscriptionData[] = [
          {
            id: "1",
            email: "user1@example.com",
            first_name: "John",
            last_name: "Doe",
            subscription_tier: "premium",
            user_id: "user-1"
          },
          {
            id: "2",
            email: "user2@example.com",
            first_name: "Jane",
            last_name: "Smith",
            subscription_tier: "free",
            user_id: "user-2"
          },
          // Add Lucky Ndumbu with enterprise tier
          {
            id: "lucky-admin",
            email: "richndumbu@gmail.com",
            first_name: "Lucky",
            last_name: "Ndumbu",
            subscription_tier: "enterprise",
            user_id: "lucky-admin"
          },
          // Add current user to the list for demonstration purposes
          {
            id: user?.id || "current-user",
            email: user?.email || "current@example.com",
            first_name: profile?.first_name || "Current",
            last_name: profile?.last_name || "User",
            subscription_tier: profile?.subscription_tier || "free",
            user_id: user?.id || "current-user"
          },
          // Add more mock users for pagination testing
          {
            id: "3",
            email: "user3@example.com",
            first_name: "Robert",
            last_name: "Johnson",
            subscription_tier: "premium",
            user_id: "user-3"
          },
          {
            id: "4",
            email: "user4@example.com",
            first_name: "Emily",
            last_name: "Williams",
            subscription_tier: "free",
            user_id: "user-4"
          },
          {
            id: "5",
            email: "user5@example.com",
            first_name: "Michael",
            last_name: "Brown",
            subscription_tier: "enterprise",
            user_id: "user-5"
          },
          {
            id: "6",
            email: "user6@example.com",
            first_name: "Sarah",
            last_name: "Miller",
            subscription_tier: "free",
            user_id: "user-6"
          }
        ];
        
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
