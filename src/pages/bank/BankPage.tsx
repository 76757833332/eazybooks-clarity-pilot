
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, CreditCard, Wallet, ArrowUpDown, Download } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

// Demo data for bank accounts
const demoAccounts = [
  {
    id: "1",
    name: "Business Checking",
    accountNumber: "****3456",
    balance: 24580.75,
    type: "checking",
  },
  {
    id: "2",
    name: "Business Savings",
    accountNumber: "****7890",
    balance: 135750.25,
    type: "savings",
  },
  {
    id: "3",
    name: "Tax Reserve",
    accountNumber: "****1234",
    balance: 45000.00,
    type: "savings",
  }
];

// Demo data for recent transactions
const demoTransactions = [
  {
    id: "1",
    description: "Client Payment - ABC Corp",
    date: "Today, 10:23 AM",
    amount: 12500.00,
    type: "credit",
  },
  {
    id: "2",
    description: "Office Rent Payment",
    date: "Yesterday, 2:45 PM",
    amount: 3200.00,
    type: "debit",
  },
  {
    id: "3",
    description: "Software Subscription",
    date: "May 8, 9:15 AM",
    amount: 99.99,
    type: "debit",
  },
  {
    id: "4",
    description: "Utility Bill Payment",
    date: "May 7, 11:30 AM",
    amount: 245.50,
    type: "debit",
  },
  {
    id: "5",
    description: "Client Payment - XYZ Ltd",
    date: "May 6, 3:20 PM",
    amount: 7800.00,
    type: "credit",
  }
];

const BankPage = () => {
  const { user } = useAuth();
  
  // In a real app, we would fetch data from an API
  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ["bankAccounts", user?.id],
    queryFn: async () => demoAccounts,
    enabled: !!user,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["recentTransactions", user?.id],
    queryFn: async () => demoTransactions,
    enabled: !!user,
  });

  // Calculate total balance across all accounts
  const totalBalance = accounts?.reduce((sum, account) => sum + account.balance, 0) || 0;

  return (
    <AppLayout title="Bank Accounts">
      <div className="space-y-6">
        {/* Summary Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-xl">Total Balance</CardTitle>
              <CardDescription>Across all accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(totalBalance)}</div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="gap-2">
                <Download size={16} />
                Export Statement
              </Button>
            </CardFooter>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Button className="w-full sm:w-auto gap-2">
              <Plus size={16} />
              Add Account
            </Button>
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <ArrowUpDown size={16} />
              Transfer Funds
            </Button>
          </div>
        </div>

        {/* Accounts Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accountsLoading ? (
              <p>Loading accounts...</p>
            ) : (
              accounts?.map((account) => (
                <Card key={account.id} className="hover:bg-accent/10 transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{account.name}</CardTitle>
                        <CardDescription>Account {account.accountNumber}</CardDescription>
                      </div>
                      {account.type === "checking" ? (
                        <CreditCard className="text-muted-foreground" />
                      ) : (
                        <Wallet className="text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(account.balance)}</div>
                    <p className="text-sm text-muted-foreground capitalize">{account.type} Account</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <Card>
            <div className="rounded-md border">
              <div className="p-4">
                {transactionsLoading ? (
                  <p>Loading transactions...</p>
                ) : (
                  <div className="space-y-4">
                    {transactions?.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between py-2">
                        <div className="flex-1">
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                        <div className={`text-right font-medium ${
                          transaction.type === "credit" ? "text-green-500" : "text-muted-foreground"
                        }`}>
                          {transaction.type === "credit" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t p-4 text-center">
                <Button variant="outline" size="sm">View All Transactions</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default BankPage;
