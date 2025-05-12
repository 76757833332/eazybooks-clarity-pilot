
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
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Search, Filter, Loader2 } from "lucide-react";

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

        {/* Filters and search */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tiers</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="sr-only">Loading users...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No users found matching your filters</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    setTierFilter("all");
                    setSearchQuery("");
                  }}
                >
                  Reset filters
                </Button>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="font-medium">
                            {user.first_name} {user.last_name}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge className={getSubscriptionBadgeColor(user.subscription_tier)}>
                            {user.subscription_tier.charAt(0).toUpperCase() +
                              user.subscription_tier.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Select
                              defaultValue={user.subscription_tier}
                              disabled={user.email === "richndumbu@gmail.com" || isUpdating}
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
                              onClick={() => confirmUpdateSubscription(user.id, user.subscription_tier)}
                              disabled={user.email === "richndumbu@gmail.com" || isUpdating}
                            >
                              {isUpdating && userToUpdate?.id === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : null}
                              Apply
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            isActive={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
                
                <div className="text-xs text-muted-foreground text-center mt-2">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm subscription change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {userToUpdate?.tier === "free" ? "downgrade" : "update"} this user's subscription to {userToUpdate?.tier}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (userToUpdate) {
                  handleUpdateSubscription(userToUpdate.id, userToUpdate.tier);
                }
              }}
              disabled={isUpdating}
              className={isUpdating ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default SubscriptionApprovals;
