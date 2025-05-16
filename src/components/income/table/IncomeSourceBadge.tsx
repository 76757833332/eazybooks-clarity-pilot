
import React from "react";
import { Badge } from "@/components/ui/badge";
import { IncomeSource } from "@/types/income";

interface IncomeSourceBadgeProps {
  source: IncomeSource;
}

const IncomeSourceBadge: React.FC<IncomeSourceBadgeProps> = ({ source }) => {
  const getSourceColor = (source: IncomeSource) => {
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
    <Badge className={getSourceColor(source)}>
      {source}
    </Badge>
  );
};

export default IncomeSourceBadge;
