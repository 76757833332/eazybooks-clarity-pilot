
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubscriptionTier } from "@/contexts/auth/types";

// Interface for user data in the subscription approval list
interface UserSubscriptionData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  subscription_tier: SubscriptionTier;
  user_id: string;
}

const SubscriptionApprovals = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserSubscriptionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          // Add current user to the list for demonstration purposes
          {
            id: user?.id || "current-user",
            email: user?.email || "current@example.com",
            first_name: "Current",
            last_name: "User",
            subscription_tier: "free",
            user_id: user?.id || "current-user"
          }
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const handleUpdateSubscription = async (userId: string, tier: SubscriptionTier) => {
    try {
      // In a real app, you would update the user's subscription in the database
      // For now, we'll just update the local state
      
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
    }
  };

  const getSubscriptionBadgeColor = (tier: SubscriptionTier) => {
    switch (tier) {
      case "premium":
        return "bg-amber-500";
      case "enterprise":
        return "bg-purple-600";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <AppLayout title="Subscription Approvals">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Subscription Approvals</h1>
        <p className="text-muted-foreground">
          Manage subscription tiers for users in your organization
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center">
                <p>Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <p className="text-center py-4">No users found</p>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-md"
                  >
                    <div>
                      <div className="font-medium">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getSubscriptionBadgeColor(user.subscription_tier)}>
                        {user.subscription_tier.charAt(0).toUpperCase() +
                          user.subscription_tier.slice(1)}
                      </Badge>
                      <Select
                        defaultValue={user.subscription_tier}
                        onValueChange={(value) =>
                          handleUpdateSubscription(
                            user.id,
                            value as SubscriptionTier
                          )
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleUpdateSubscription(user.id, user.subscription_tier)
                        }
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SubscriptionApprovals;
