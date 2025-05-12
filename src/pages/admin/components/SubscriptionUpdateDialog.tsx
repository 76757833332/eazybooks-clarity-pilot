
import React from "react";
import { Loader2 } from "lucide-react";
import { SubscriptionTier } from "@/contexts/auth/types";
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

interface SubscriptionUpdateDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  userToUpdate: { id: string; tier: SubscriptionTier } | null;
  isUpdating: boolean;
  onUpdateSubscription: (userId: string, tier: SubscriptionTier) => void;
}

const SubscriptionUpdateDialog: React.FC<SubscriptionUpdateDialogProps> = ({
  dialogOpen,
  setDialogOpen,
  userToUpdate,
  isUpdating,
  onUpdateSubscription,
}) => {
  return (
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
                onUpdateSubscription(userToUpdate.id, userToUpdate.tier);
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
  );
};

export default SubscriptionUpdateDialog;
