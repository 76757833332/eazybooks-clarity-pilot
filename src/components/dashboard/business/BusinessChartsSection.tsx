
import React from "react";
import { useQuery } from "@tanstack/react-query";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import * as incomeService from "@/services/incomeService";

const BusinessChartsSection: React.FC = () => {
  // Fetch real transactions from incomes and expenses
  const { data: transactions = [] } = useQuery({
    queryKey: ["dashboard-transactions"],
    queryFn: async () => {
      try {
        // Fetch recent incomes
        const incomes = await incomeService.getIncomes();
        
        // Transform to transaction format and return most recent 3
        return incomes.slice(0, 3).map(income => ({
          id: income.id,
          name: income.description || income.source,
          date: new Date(income.income_date).toLocaleDateString(),
          amount: income.amount,
          type: 'income' as const
        }));
      } catch (error) {
        console.error("Error fetching transaction data for dashboard:", error);
        return [];
      }
    }
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <PerformanceChart />
      </div>
      <div className="space-y-6">
        <QuickActions />
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  );
};

export default BusinessChartsSection;
