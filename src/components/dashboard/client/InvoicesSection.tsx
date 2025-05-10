
import React from "react";
import { FileText } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Invoice {
  id: string;
  amount: string;
  status: string;
  date: string;
  downloadUrl: string;
}

interface InvoicesSectionProps {
  invoices: Invoice[];
}

const InvoicesSection: React.FC<InvoicesSectionProps> = ({ invoices }) => {
  const getInvoiceStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-green-500";
      case "pending":
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
          <a
            href="/invoices"
            className="text-sm text-eazybooks-purple hover:underline"
          >
            View all
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-eazybooks-purple" />
                    <h3 className="font-medium">{invoice.id}</h3>
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
                  {invoice.status === "Pending" && (
                    <Button
                      size="sm"
                      className="bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
                    >
                      Pay Now
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-eazybooks-purple text-eazybooks-purple"
                  >
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
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No invoices yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicesSection;
