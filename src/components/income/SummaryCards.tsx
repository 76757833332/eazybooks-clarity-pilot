
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Income, IncomeSource } from "@/types/income";

interface SummaryCardsProps {
  incomes: Income[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ incomes }) => {
  // Calculate total income (received only)
  const totalReceivedIncome = incomes
    ?.filter(income => income.status === "received")
    .reduce((sum, income) => sum + income.amount, 0) || 0;

  // Calculate pending income
  const totalPendingIncome = incomes
    ?.filter(income => income.status === "pending")
    .reduce((sum, income) => sum + income.amount, 0) || 0;

  // Group by source
  const incomeBySource = incomes?.reduce((acc, income) => {
    if (!acc[income.source]) {
      acc[income.source] = 0;
    }
    if (income.status === "received") {
      acc[income.source] += income.amount;
    }
    return acc;
  }, {} as Record<IncomeSource, number>) || {};

  // Get source with highest income
  let topSource: IncomeSource | null = null;
  let topAmount = 0;
  
  Object.entries(incomeBySource).forEach(([source, amount]) => {
    const typedSource = source as IncomeSource;
    const typedAmount = amount as number;
    
    if (typedAmount > topAmount) {
      topSource = typedSource;
      topAmount = typedAmount;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Income</CardTitle>
          <CardDescription>Received payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalReceivedIncome)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {incomes?.filter(i => i.status === "received").length || 0} transactions
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Pending Income</CardTitle>
          <CardDescription>Expected payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalPendingIncome)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {incomes?.filter(i => i.status === "pending").length || 0} pending transactions
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Top Income Source</CardTitle>
          <CardDescription>Highest revenue generator</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">
            {topSource ? topSource : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {topSource ? formatCurrency(topAmount) : "No data available"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
