
import React from "react";
import { FileText, Plus } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Invoice {
  id: string;
  amount: string;
  status: string;
  date: string;
  invoice_number: string;
}

interface InvoicesSectionProps {
  invoices: Invoice[];
  isLoading?: boolean;
}

const InvoicesSection: React.FC<InvoicesSectionProps> = ({ invoices, isLoading = false }) => {
  const getInvoiceStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-green-500";
      case "pending":
      case "sent":
        return "text-amber-500";
      case "overdue":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-eazybooks-purple" />
              Recent Invoices
            </div>
          </CardTitle>
          <Link
            to="/invoices"
            className="text-sm text-eazybooks-purple hover:underline"
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-eazybooks-purple"></div>
            </div>
          ) : invoices.length > 0 ? (
            invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-eazybooks-purple" />
                    <h3 className="font-medium">#{invoice.invoice_number}</h3>
                  </div>
                  <div className="mt-1 flex items-center gap-3">
                    <span className="text-sm">{invoice.amount}</span>
                    <span className="text-xs text-muted-foreground">
                      {invoice.date}
                    </span>
                    <span
                      className={`text-xs font-medium ${getInvoiceStatusColor(
                        invoice.status
                      )}`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(invoice.status.toLowerCase() === "pending" || invoice.status.toLowerCase() === "sent") && (
                    <Button
                      size="sm"
                      className="bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
                      asChild
                    >
                      <Link to={`/invoices/${invoice.id}`}>
                        Pay Now
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-eazybooks-purple text-eazybooks-purple"
                    asChild
                  >
                    <Link to={`/invoices/${invoice.id}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                      </svg>
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No invoices yet</p>
              <Button 
                variant="outline"
                size="sm"
                className="mt-4"
                asChild
              >
                <Link to="/invoices/create">
                  <Plus size={14} className="mr-2" />
                  Create Invoice
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicesSection;
