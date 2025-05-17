
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Invoice } from "@/types/invoice";

interface InvoicesListProps {
  invoices: Invoice[];
  getStatusColor: (status: string) => string;
}

export const InvoicesList = ({ invoices, getStatusColor }: InvoicesListProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3 bg-secondary/40 rounded-tl-lg">Invoice</th>
            <th className="px-4 py-3 bg-secondary/40">Customer</th>
            <th className="px-4 py-3 bg-secondary/40">Issue Date</th>
            <th className="px-4 py-3 bg-secondary/40">Due Date</th>
            <th className="px-4 py-3 bg-secondary/40">Amount</th>
            <th className="px-4 py-3 bg-secondary/40">Status</th>
            <th className="px-4 py-3 bg-secondary/40 rounded-tr-lg"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-sm">
          {invoices?.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-secondary/20">
              <td className="px-4 py-3">
                <Link to={`/invoices/${invoice.id}`} className="hover:underline text-eazybooks-purple">
                  #{invoice.invoice_number}
                </Link>
              </td>
              <td className="px-4 py-3">
                {invoice.customer?.name || 'No Customer'}
              </td>
              <td className="px-4 py-3">
                {new Date(invoice.issue_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                {new Date(invoice.due_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 font-medium">
                {formatCurrency(invoice.total_amount)}
              </td>
              <td className="px-4 py-3">
                <Badge className={`${getStatusColor(invoice.status)} rounded-md`}>
                  {invoice.status}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Link 
                  to={`/invoices/${invoice.id}`}
                  className="text-xs px-2 py-1 rounded bg-secondary hover:bg-secondary/80"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
