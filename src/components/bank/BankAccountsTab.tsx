
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Wallet, CreditCard, RefreshCw, Plus } from "lucide-react";

const BankAccountsTab = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Business Checking</CardTitle>
              <Building className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Bank of America</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,512.65</div>
            <div className="text-xs text-muted-foreground mt-1">
              Account ending in 4832
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-3">
            <Button variant="ghost" size="sm">
              View Details
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Savings Account</CardTitle>
              <Wallet className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Bank of America</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,719.42</div>
            <div className="text-xs text-muted-foreground mt-1">
              Account ending in 7291
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-3">
            <Button variant="ghost" size="sm">
              View Details
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Business Credit Card</CardTitle>
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>American Express</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">-$3,241.87</div>
            <div className="text-xs text-muted-foreground mt-1">
              Card ending in 1842
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-3">
            <Button variant="ghost" size="sm">
              View Details
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </CardFooter>
        </Card>
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
