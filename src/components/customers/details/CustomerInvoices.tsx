
import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types/invoice";
import { formatCurrency } from "@/lib/utils";

interface CustomerInvoicesProps {
  invoices: Invoice[];
  isLoading: boolean;
}

export const CustomerInvoices = ({ invoices, isLoading }: CustomerInvoicesProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
        <CardDescription>All invoices associated with this customer</CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No invoices found for this customer.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2" />
                        {new Date(invoice.issue_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.due_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(invoice.total_amount)}
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                        ${
                          invoice.status === 'paid'
                            ? 'bg-green-500/10 text-green-500'
                            : invoice.status === 'overdue'
                            ? 'bg-red-500/10 text-red-500'
                            : invoice.status === 'sent'
                            ? 'bg-blue-500/10 text-blue-500'
                            : 'bg-gray-100 text-gray-800'
                        }
                      `}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
