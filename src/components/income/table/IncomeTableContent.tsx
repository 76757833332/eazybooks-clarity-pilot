
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Income } from "@/types/income";
import IncomeTableRow from "./IncomeTableRow";
import EmptyIncomeState from "./EmptyIncomeState";

interface IncomeTableContentProps {
  incomes: Income[];
  isLoading: boolean;
  error: Error | null;
}

const IncomeTableContent: React.FC<IncomeTableContentProps> = ({ 
  incomes, 
  isLoading, 
  error 
}) => {
  if (isLoading) {
    return <div className="text-center py-4">Loading income data...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Error loading income data
      </div>
    );
  }

  if (incomes?.length === 0) {
    return <EmptyIncomeState />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {incomes.map((income) => (
          <IncomeTableRow key={income.id} income={income} />
        ))}
      </TableBody>
    </Table>
  );
};

export default IncomeTableContent;
