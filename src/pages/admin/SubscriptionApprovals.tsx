
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SubscriptionTier } from "@/contexts/auth/types";
import { useAuth } from "@/contexts/auth";

interface UserWithProfile {
  id: string;
  email: string;
  created_at: string;
  first_name: string;
  last_name: string;
  subscription_tier?: SubscriptionTier;
}

const SubscriptionApprovals: React.FC = () => {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Since we don't have a direct profiles table, we'll get users from auth
        // and simulate a profiles list based on what's in the context
        
        const mockUsers: UserWithProfile[] = [
          {
            id: '1',
            email: 'user1@example.com',
            created_at: new Date().toISOString(),
            first_name: 'John',
            last_name: 'Doe',
            subscription_tier: 'free'
          },
          {
            id: '2',
            email: 'user2@example.com',
            created_at: new Date().toISOString(),
            first_name: 'Jane',
            last_name: 'Smith',
            subscription_tier: 'premium'
          },
          {
            id: '3',
            email: 'user3@example.com',
            created_at: new Date().toISOString(),
            first_name: 'Alex',
            last_name: 'Brown',
            subscription_tier: 'free'
          }
        ];
        
        // If the current user is logged in, add them to the list
        if (user) {
          // Get user metadata
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (!userError && userData.user) {
            const currentUser: UserWithProfile = {
              id: userData.user.id,
              email: userData.user.email || 'No email available',
              created_at: userData.user.created_at || new Date().toISOString(),
              first_name: userData.user.user_metadata?.first_name || 'Current',
              last_name: userData.user.user_metadata?.last_name || 'User',
              subscription_tier: userData.user.user_metadata?.subscription_tier || 'free'
            };
            
            // Add current user to the start of the list
            mockUsers.unshift(currentUser);
          }
        }
        
        setUsers(mockUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [user]);
  
  const updateSubscriptionTier = async (userId: string, tier: SubscriptionTier) => {
    setUpdatingUserId(userId);
    try {
      // In a real implementation, we would update the user's metadata
      // For now, we'll just update the local state
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, subscription_tier: tier } : user
      ));
      
      toast.success(`User subscription updated to ${tier}`);
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update subscription");
    } finally {
      setUpdatingUserId(null);
    }
  };
  
  const getTierBadgeColor = (tier?: SubscriptionTier) => {
    switch (tier) {
      case 'premium':
        return 'bg-amber-500';
      case 'enterprise':
        return 'bg-purple-600';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <AppLayout title="Subscription Approvals">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Subscription Approvals</h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-8 w-8 text-eazybooks-purple" />
            <span className="ml-2">Loading users...</span>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableCaption>List of users and their subscription status</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Current Tier</TableHead>
                  <TableHead>Update Subscription</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No users found</TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getTierBadgeColor(user.subscription_tier)}>
                          {user.subscription_tier || "free"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Select 
                            defaultValue={user.subscription_tier || "free"}
                            onValueChange={(value) => updateSubscriptionTier(user.id, value as SubscriptionTier)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Select tier" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {updatingUserId === user.id && (
                            <Spinner className="h-4 w-4 text-eazybooks-purple" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SubscriptionApprovals;
