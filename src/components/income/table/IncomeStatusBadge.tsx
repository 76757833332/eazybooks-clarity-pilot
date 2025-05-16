
import React from "react";
import { Badge } from "@/components/ui/badge";
import { IncomeStatus } from "@/types/income";

interface IncomeStatusBadgeProps {
  status: IncomeStatus;
}

const IncomeStatusBadge: React.FC<IncomeStatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: IncomeStatus) => {
    switch (status) {
      case "received":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Badge className={getStatusColor(status)}>
      {status}
    </Badge>
  );
};

export default IncomeStatusBadge;
