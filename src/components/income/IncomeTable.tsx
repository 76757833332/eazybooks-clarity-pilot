
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Income } from "@/types/income";
import IncomeTableContent from "./table/IncomeTableContent";

interface IncomeTableProps {
  incomes: Income[];
  filteredIncomes: Income[];
  isLoading: boolean;
  error: Error | null;
}

const IncomeTable: React.FC<IncomeTableProps> = ({ 
  incomes, 
  filteredIncomes, 
  isLoading, 
  error 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Transactions</CardTitle>
        <CardDescription>
          Manage your income sources and transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <IncomeTableContent 
          incomes={filteredIncomes} 
          isLoading={isLoading} 
          error={error} 
        />
      </CardContent>
    </Card>
  );
};

export default IncomeTable;
