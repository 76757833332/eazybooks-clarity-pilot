
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  return (
    <div className="bg-secondary/40 rounded-lg p-4">
      <h3 className="text-sm font-medium mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  transaction.type === 'income' 
                    ? "bg-green-500/20 text-green-500" 
                    : "bg-red-500/20 text-red-500"
                )}
              >
                {transaction.type === 'income' ? (
                  <ArrowDownRight size={16} />
                ) : (
                  <ArrowUpRight size={16} />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{transaction.name}</p>
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
              </div>
            </div>
            <p 
              className={cn(
                "text-sm font-medium",
                transaction.type === 'income' ? "text-green-500" : "text-red-500"
              )}
            >
              {transaction.type === 'income' ? '+' : '-'} €{transaction.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
