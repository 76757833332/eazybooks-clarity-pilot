
import React from "react";
import { Badge } from "@/components/ui/badge";
import { IncomeStatus, IncomeSource } from "@/types/income";

interface StatusBadgeProps {
  status: IncomeStatus;
  className?: string;
}

interface SourceBadgeProps {
  source: IncomeSource;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusColor = (status: string) => {
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
    <Badge className={`${getStatusColor(status)} ${className || ""}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, className }) => {
  const getSourceColor = (source: string) => {
    switch (source) {
      case "sales":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "services":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "consulting":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400";
      case "investment":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400";
      case "other":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Badge className={`${getSourceColor(source)} ${className || ""}`}>
      {source.charAt(0).toUpperCase() + source.slice(1)}
    </Badge>
  );
};
