
import React from "react";
import { formatCurrency } from "@/lib/utils";
import { CardTitle } from "@/components/ui/card";
import { Income } from "@/types/income";
import { StatusBadge, SourceBadge } from "./StatusBadge";

interface IncomeHeaderProps {
  income: Income;
}

const IncomeHeader: React.FC<IncomeHeaderProps> = ({ income }) => {
  return (
    <div className="flex flex-row items-start justify-between">
      <div>
        <CardTitle className="text-2xl">{income.description}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <StatusBadge status={income.status} />
          <SourceBadge source={income.source} />
        </div>
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold">{formatCurrency(income.amount)}</div>
        <div className="text-sm text-muted-foreground mt-1">
          {new Date(income.income_date).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default IncomeHeader;
