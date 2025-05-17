
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TransactionsTab = () => {
  const navigate = useNavigate();
  const hasTransactions = true; // This would be determined by your data
  
  const navigateToUpload = () => {
    const uploadTab = document.querySelector('[data-value="upload"]') as HTMLElement;
    if (uploadTab) uploadTab.click();
  };

  if (!hasTransactions) {
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
        <Button onClick={navigateToUpload} variant="outline" className="flex items-center gap-1">
          <Upload className="h-4 w-4" />
          Import More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TransactionsTab;
