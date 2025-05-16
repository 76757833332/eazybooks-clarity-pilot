
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/layout/AppLayout";
import { getIncomes } from "@/services/incomeService";
import { Income } from "@/types/income";

// Import components
import SummaryCards from "@/components/income/SummaryCards";
import ActionButtons from "@/components/income/ActionButtons";
import FilterChips from "@/components/income/FilterChips";
import IncomeTable from "@/components/income/IncomeTable";

const IncomePage: React.FC = () => {
  const [filter, setFilter] = useState<string | null>(null);
  
  const { data: incomes = [], isLoading, error } = useQuery({
    queryKey: ["incomes", filter],
    queryFn: getIncomes
  });

  const filteredIncomes = filter 
    ? incomes.filter(income => income.source === filter)
    : incomes;

  return (
    <AppLayout title="Income">
      <div className="space-y-6">
        {/* Summary Cards */}
        <SummaryCards incomes={incomes} />

        {/* Action Buttons */}
        <ActionButtons />

        {/* Filter Chips */}
        <FilterChips filter={filter} setFilter={setFilter} />

        {/* Income Table */}
        <IncomeTable 
          incomes={incomes} 
          filteredIncomes={filteredIncomes} 
          isLoading={isLoading} 
          error={error as Error | null}
        />
      </div>
    </AppLayout>
  );
};

export default IncomePage;
