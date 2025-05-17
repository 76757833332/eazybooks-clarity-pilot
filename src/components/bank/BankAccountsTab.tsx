
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Wallet, CreditCard, RefreshCw, Plus, Loader2 } from "lucide-react";
import { fetchBankAccounts, refreshBankAccount } from "@/services/bankService";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type BankAccount = Database['public']['Tables']['bank_accounts']['Row'];

const BankAccountsTab = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshingAccount, setRefreshingAccount] = useState<string | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchBankAccounts();
      setAccounts(data);
    } catch (error) {
      toast.error("Failed to load bank accounts");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async (accountId: string) => {
    setRefreshingAccount(accountId);
    try {
      await refreshBankAccount(accountId);
      await loadAccounts();
      toast.success("Account refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh account");
      console.error(error);
    } finally {
      setRefreshingAccount(null);
    }
  };

  const getAccountIcon = (accountType: string) => {
    switch (accountType.toLowerCase()) {
      case 'checking':
        return <Building className="h-5 w-5 text-muted-foreground" />;
      case 'savings':
        return <Wallet className="h-5 w-5 text-muted-foreground" />;
      case 'credit':
        return <CreditCard className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Building className="h-5 w-5 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <Card className="flex flex-col items-center text-center p-8">
        <CardHeader>
          <CardTitle className="text-xl">No Bank Accounts</CardTitle>
          <CardDescription>
            You haven't connected any bank accounts yet. Add an account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="flex items-center gap-1 bg-eazybooks-purple hover:bg-eazybooks-purple-secondary">
            <Plus className="h-4 w-4" />
            Add First Account
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{account.account_name}</CardTitle>
                {getAccountIcon(account.account_type)}
              </div>
              <CardDescription>{account.bank_name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {account.balance < 0 ? (
                  <span className="text-red-500">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: account.currency }).format(account.balance)}
                  </span>
                ) : (
                  new Intl.NumberFormat('en-US', { style: 'currency', currency: account.currency }).format(account.balance)
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Account ending in {account.last_four}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-3">
              <Button variant="ghost" size="sm">
                View Details
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => handleRefresh(account.id)}
                disabled={refreshingAccount === account.id}
              >
                {refreshingAccount === account.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button className="flex items-center gap-1 bg-eazybooks-purple hover:bg-eazybooks-purple-secondary">
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </div>
    </>
  );
};

export default BankAccountsTab;
