
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Invoice, InvoiceItem } from "@/types/invoice";
import { useAuth } from "@/contexts/auth";

interface InvoiceContentProps {
  invoice: Invoice;
  invoiceItems: InvoiceItem[];
}

export const InvoiceContent = ({ invoice, invoiceItems }: InvoiceContentProps) => {
  const { business } = useAuth();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-8">
          {/* Your Company Info */}
          <div className="flex items-start space-x-4">
            {business?.logo_url && (
              <div className="flex-shrink-0">
                <img 
                  src={business.logo_url} 
                  alt={`${business.name} logo`}
                  className="w-16 h-16 object-contain"
                />
              </div>
            )}
            <div>
              <h3 className="font-bold text-lg mb-1">
                {business?.name || "Your Business"}
              </h3>
              {business?.legal_name && business.legal_name !== business.name && (
                <p className="text-sm text-muted-foreground mb-1">
                  {business.legal_name}
                </p>
              )}
              <div className="text-sm text-muted-foreground">
                {business?.address && <p>{business.address}</p>}
                {(business?.city || business?.state || business?.postal_code) && (
                  <p>
                    {[business?.city, business?.state, business?.postal_code]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
                {business?.country && <p>{business.country}</p>}
                {business?.email && <p className="mt-1">{business.email}</p>}
                {business?.phone && <p>{business.phone}</p>}
                {business?.website && <p>{business.website}</p>}
              </div>
            </div>
          </div>

          {/* Invoice Number & Dates */}
          <div className="text-right">
            <h2 className="text-2xl font-bold">INVOICE</h2>
            <p className="text-muted-foreground">#{invoice.invoice_number}</p>
            <div className="mt-4 text-sm">
              <div className="flex justify-between mt-1">
                <span className="text-muted-foreground mr-4">Issue Date:</span>
                <span>{new Date(invoice.issue_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-muted-foreground mr-4">Due Date:</span>
                <span>{new Date(invoice.due_date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Billed To */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">BILLED TO:</h3>
          <div className="font-medium">{invoice.customer?.name || "No Customer"}</div>
          {invoice.customer?.address && (
            <div className="text-sm text-muted-foreground mt-1">
              {invoice.customer.address}
            </div>
          )}
          {invoice.customer?.email && (
            <div className="text-sm text-muted-foreground mt-1">
              {invoice.customer.email}
            </div>
          )}
        </div>

        {/* Invoice Items */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
              <th className="pb-2">Description</th>
              <th className="pb-2 text-right">Qty</th>
              <th className="pb-2 text-right">Price</th>
              <th className="pb-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoiceItems?.map((item) => (
              <tr key={item.id} className="text-sm">
                <td className="py-3">{item.description}</td>
                <td className="py-3 text-right">{item.quantity}</td>
                <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                <td className="py-3 text-right">${item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mt-6">
          <div className="w-1/3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>${invoice.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-border font-medium">
              <span>Total:</span>
              <span className="text-lg">${invoice.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">NOTES:</h3>
            <p className="text-sm">{invoice.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
