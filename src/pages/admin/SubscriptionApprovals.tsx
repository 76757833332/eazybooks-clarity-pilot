
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSubscriptionData } from "./hooks/useSubscriptionData";
import SubscriptionFilters from "./components/SubscriptionFilters";
import SubscriptionTable from "./components/SubscriptionTable";
import SubscriptionPagination from "./components/SubscriptionPagination";
import SubscriptionUpdateDialog from "./components/SubscriptionUpdateDialog";
import DeleteUserDialog from "./components/DeleteUserDialog";

const SubscriptionApprovals = () => {
  const {
    users,
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
    isDeleting,
    confirmDeleteUser,
    handleDeleteUser
  } = useSubscriptionData();

  return (
    <AppLayout title="Subscription Management">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage subscription tiers for users in your organization
          </p>
        </div>

        {/* Filters and search */}
        <SubscriptionFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          tierFilter={tierFilter}
          setTierFilter={setTierFilter}
        />

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
                  className="mt-4"
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
                <SubscriptionTable
                  users={users}
                  isLoading={isLoading}
                  isUpdating={isUpdating}
                  userToUpdate={userToUpdate}
                  onConfirmUpdate={confirmUpdateSubscription}
                  onDeleteClick={confirmDeleteUser}
                />
                
                {/* Pagination */}
                <SubscriptionPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  indexOfFirstItem={indexOfFirstItem}
                  indexOfLastItem={indexOfLastItem}
                  totalItems={filteredUsers.length}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Subscription Update Dialog */}
      <SubscriptionUpdateDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        userToUpdate={userToUpdate}
        isUpdating={isUpdating}
        onUpdateSubscription={handleUpdateSubscription}
      />
      
      {/* Delete User Dialog */}
      <DeleteUserDialog
        isOpen={deleteDialogOpen}
        setIsOpen={setDeleteDialogOpen}
        userToDelete={userToDelete}
        isDeleting={isDeleting}
        onDeleteUser={handleDeleteUser}
      />
    </AppLayout>
  );
};

export default SubscriptionApprovals;
