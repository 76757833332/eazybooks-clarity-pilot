
import React, { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { SubscriptionTier } from "@/contexts/auth/types";
import { UserSubscriptionData } from "../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
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
import { toast } from "sonner";

interface SubscriptionTableProps {
  users: UserSubscriptionData[];
  isLoading: boolean;
  isUpdating: boolean;
  userToUpdate: { id: string; tier: SubscriptionTier } | null;
  onConfirmUpdate: (userId: string, tier: SubscriptionTier) => void;
  onDeleteClick: (userId: string, userName: string) => void;
}

const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  users,
  isLoading,
  isUpdating,
  userToUpdate,
  onConfirmUpdate,
  onDeleteClick,
}) => {
  const [selectedTiers, setSelectedTiers] = useState<Record<string, SubscriptionTier>>({});

  const handleTierChange = (userId: string, tier: string) => {
    setSelectedTiers(prev => ({
      ...prev,
      [userId]: tier as SubscriptionTier
    }));
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
        {users.map((user) => (
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
              <Badge className={getSubscriptionBadgeColor(user.subscription_tier as SubscriptionTier)}>
                {user.subscription_tier.charAt(0).toUpperCase() +
                  user.subscription_tier.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Select
                  defaultValue={user.subscription_tier}
                  disabled={user.email === "richndumbu@gmail.com" || isUpdating}
                  onValueChange={(value) => handleTierChange(user.id, value)}
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
                  onClick={() => onConfirmUpdate(user.id, selectedTiers[user.id] || user.subscription_tier as SubscriptionTier)}
                  disabled={user.email === "richndumbu@gmail.com" || isUpdating}
                >
                  {isUpdating && userToUpdate?.id === user.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Apply
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteClick(user.id, `${user.first_name} ${user.last_name}`)}
                  disabled={user.email === "richndumbu@gmail.com" || isUpdating}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SubscriptionTable;
