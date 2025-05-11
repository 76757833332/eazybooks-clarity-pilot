
import React from "react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case 'sent':
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case 'draft':
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case 'overdue':
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <Badge className={`${getStatusColor(status)}`}>
      {status.toUpperCase()}
    </Badge>
  );
};
