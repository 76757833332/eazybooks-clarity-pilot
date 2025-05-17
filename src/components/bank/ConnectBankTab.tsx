
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addBankAccount } from "@/services/bankService";
import { useNavigate } from "react-router-dom";

const ConnectBankTab = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("checking");
  const [balance, setBalance] = useState("");
  
  const handleConnectBank = async () => {
    if (!selectedBank) {
      toast.error("Please select a bank");
      return;
    }
    
    if (!accountName) {
      toast.error("Please enter an account name");
      return;
    }
    
    if (!accountNumber || accountNumber.length < 4) {
      toast.error("Please enter a valid account number");
      return;
    }
    
    // Get last 4 digits
    const lastFour = accountNumber.slice(-4);
    
    setIsConnecting(true);
    
    try {
      // In a real app, this would connect to a bank API
      // For now, we're manually adding the account
      await addBankAccount({
        account_name: accountName,
        account_number: accountNumber,
        account_type: accountType,
        bank_name: getBankName(selectedBank),
        last_four: lastFour,
        balance: balance ? parseFloat(balance) : 0,
        currency: "USD"
      });
      
      toast.success("Bank account connected successfully!");
      // Navigate to the accounts tab
      const accountsTab = document.querySelector('[data-value="accounts"]') as HTMLElement;
      if (accountsTab) accountsTab.click();
    } catch (error) {
      console.error("Error connecting bank account:", error);
      toast.error("Failed to connect bank account. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };
  
  const getBankName = (code: string): string => {
    const banks: Record<string, string> = {
      'bofa': 'Bank of America',
      'chase': 'Chase',
      'wells': 'Wells Fargo',
      'citi': 'Citibank',
      'other': 'Other Bank'
    };
    
    return banks[code] || 'Unknown Bank';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect a Bank Account</CardTitle>
        <CardDescription>
          Enter your bank account information or connect directly to your bank
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
          <Label htmlFor="accountName">Account Name</Label>
          <Input 
            id="accountName" 
            value={accountName} 
            onChange={(e) => setAccountName(e.target.value)} 
            placeholder="e.g. Business Checking"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input 
            id="accountNumber" 
            value={accountNumber} 
            onChange={(e) => setAccountNumber(e.target.value)} 
            placeholder="Account Number"
            type="password"
          />
          <p className="text-xs text-muted-foreground">
            Only the last 4 digits will be displayed
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountType">Account Type</Label>
          <Select value={accountType} onValueChange={setAccountType}>
            <SelectTrigger id="accountType">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="checking">Checking</SelectItem>
              <SelectItem value="savings">Savings</SelectItem>
              <SelectItem value="credit">Credit Card</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="balance">Initial Balance</Label>
          <Input 
            id="balance" 
            value={balance} 
            onChange={(e) => setBalance(e.target.value)} 
            placeholder="0.00"
            type="number"
            step="0.01"
          />
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

      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleConnectBank} 
          disabled={!selectedBank || !accountName || !accountNumber || isConnecting}
          className="w-full bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              Connect Bank Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConnectBankTab;
