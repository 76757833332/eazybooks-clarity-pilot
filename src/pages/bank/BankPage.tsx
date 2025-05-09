import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth";
import AppLayout from "@/components/layout/AppLayout";
import { ArrowRight, Plus, CreditCard, Wallet, Building, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const BankPage = () => {
  const { user, business } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");

  const handleConnectBank = () => {
    setIsConnecting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Bank account connected successfully!");
      setIsConnecting(false);
    }, 2000);
  };

  return (
    <AppLayout title="Banking">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Banking</h1>
        <p className="text-muted-foreground">
          Connect and manage your bank accounts
        </p>
      </div>

      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="connect">Connect New Account</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts">
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
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                View and categorize your recent bank transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Office Supplies</p>
                    <p className="text-sm text-muted-foreground">May 12, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-500">-$124.99</p>
                    <p className="text-sm text-muted-foreground">Business Checking</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Client Payment - ABC Corp</p>
                    <p className="text-sm text-muted-foreground">May 10, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-500">+$3,500.00</p>
                    <p className="text-sm text-muted-foreground">Business Checking</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Software Subscription</p>
                    <p className="text-sm text-muted-foreground">May 8, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-500">-$49.99</p>
                    <p className="text-sm text-muted-foreground">Business Credit Card</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Client Payment - XYZ Inc</p>
                    <p className="text-sm text-muted-foreground">May 5, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-500">+$1,250.00</p>
                    <p className="text-sm text-muted-foreground">Business Checking</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Office Rent</p>
                    <p className="text-sm text-muted-foreground">May 1, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-500">-$1,800.00</p>
                    <p className="text-sm text-muted-foreground">Business Checking</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Export Transactions</Button>
              <Button>View All</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="connect">
          <Card>
            <CardHeader>
              <CardTitle>Connect a Bank Account</CardTitle>
              <CardDescription>
                Securely connect your bank account to automatically import transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bank">Select your bank</Label>
                <Select value={selectedBank} onValueChange={setSelectedBank}>
                  <SelectTrigger id="bank">
                    <SelectValue placeholder="Select a bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bofa">Bank of America</SelectItem>
                    <SelectItem value="chase">Chase</SelectItem>
                    <SelectItem value="wells">Wells Fargo</SelectItem>
                    <SelectItem value="citi">Citibank</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-sync">Automatic sync</Label>
                  <Switch id="auto-sync" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically sync transactions daily
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="categorize">Auto-categorize</Label>
                  <Switch id="categorize" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically categorize transactions based on patterns
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleConnectBank} 
                disabled={!selectedBank || isConnecting}
                className="w-full bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
              >
                {isConnecting ? "Connecting..." : "Connect Bank Account"}
                {!isConnecting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default BankPage;
