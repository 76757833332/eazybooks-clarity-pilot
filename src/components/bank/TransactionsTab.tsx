
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download, Loader2 } from "lucide-react";
import { fetchAllTransactions } from "@/services/bankService";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Transaction = Database['public']['Tables']['transactions']['Row'] & {
  bank_accounts: {
    account_name: string;
    bank_name: string;
    last_four: string;
  } | null;
};

const TransactionsTab = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllTransactions();
      setTransactions(data as Transaction[]);
    } catch (error) {
      toast.error("Failed to load transactions");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const navigateToUpload = () => {
    const uploadTab = document.querySelector('[data-value="upload"]') as HTMLElement;
    if (uploadTab) uploadTab.click();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="flex flex-col items-center text-center p-8">
        <CardHeader>
          <CardTitle className="text-xl">No Transactions Found</CardTitle>
          <CardDescription>
            You don't have any transactions yet. Import transactions from your bank or upload a transaction file to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="flex items-center gap-1 bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
            onClick={navigateToUpload}
          >
            <Upload className="h-4 w-4" />
            Upload Transactions
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          View and categorize your recent bank transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-medium ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {transaction.amount < 0 ? '-' : '+'}
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(transaction.amount))}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.bank_accounts?.account_name || 'Unknown Account'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Export Transactions</Button>
        <Button onClick={navigateToUpload} variant="outline" className="flex items-center gap-1">
          <Upload className="h-4 w-4" />
          Import More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TransactionsTab;
