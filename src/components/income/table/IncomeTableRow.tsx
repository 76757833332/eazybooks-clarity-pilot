
import React from "react";
import { useNavigate } from "react-router-dom";
import { TableRow, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Income } from "@/types/income";
import IncomeSourceBadge from "./IncomeSourceBadge";
import IncomeStatusBadge from "./IncomeStatusBadge";

interface IncomeTableRowProps {
  income: Income;
}

const IncomeTableRow: React.FC<IncomeTableRowProps> = ({ income }) => {
  const navigate = useNavigate();
  
  return (
    <TableRow 
      key={income.id}
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => navigate(`/income/${income.id}`)}
    >
      <TableCell className="font-medium">{income.description}</TableCell>
      <TableCell>
        <IncomeSourceBadge source={income.source} />
      </TableCell>
      <TableCell>
        {new Date(income.income_date).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(income.amount)}
      </TableCell>
      <TableCell>
        <IncomeStatusBadge status={income.status} />
      </TableCell>
    </TableRow>
  );
};

export default IncomeTableRow;
