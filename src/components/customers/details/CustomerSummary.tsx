
import React from "react";
import { useNavigate } from "react-router-dom";
import { Receipt, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Invoice } from "@/types/invoice";
import { formatCurrency } from "@/lib/utils";

interface CustomerSummaryProps {
  customerId: string;
  invoices: Invoice[];
}

export const CustomerSummary = ({ customerId, invoices }: CustomerSummaryProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Summary</CardTitle>
        <CardDescription>Overview of customer activity</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-eazybooks-purple bg-opacity-15 flex items-center justify-center text-eazybooks-purple mr-3">
                <Receipt size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Invoices</p>
                <p className="text-2xl font-semibold">{invoices.length}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-eazybooks-purple bg-opacity-15 flex items-center justify-center text-eazybooks-purple mr-3">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(
                    invoices.reduce((sum, invoice) => sum + invoice.total_amount, 0)
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full"
            onClick={() => navigate(`/invoices/create?customerId=${customerId}`)}
          >
            Create New Invoice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
