
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

const ConnectBankTab = () => {
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
  );
};

export default ConnectBankTab;
