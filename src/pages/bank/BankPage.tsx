
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth";
import AppLayout from "@/components/layout/AppLayout";
import BankAccountsTab from "@/components/bank/BankAccountsTab";
import TransactionsTab from "@/components/bank/TransactionsTab";
import ConnectBankTab from "@/components/bank/ConnectBankTab";
import TransactionUpload from "@/components/bank/TransactionUpload";

const BankPage = () => {
  const { user, business } = useAuth();

  return (
    <AppLayout title="Banking">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Banking</h1>
        <p className="text-muted-foreground">
          Connect and manage your bank accounts
        </p>
      </div>

      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="upload">Upload Transactions</TabsTrigger>
          <TabsTrigger value="connect">Connect New Account</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts">
          <BankAccountsTab />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsTab />
        </TabsContent>

        <TabsContent value="upload">
          <TransactionUpload />
        </TabsContent>

        <TabsContent value="connect">
          <ConnectBankTab />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default BankPage;
