
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { Invoice } from "@/types/invoice";

interface InvoiceSidebarProps {
  invoice: Invoice;
  onUpdateStatus: (newStatus: string) => Promise<void>;
  onDelete: () => void;
  onDownload: () => void;
}

export const InvoiceSidebar = ({ 
  invoice, 
  onUpdateStatus,
  onDelete,
  onDownload,
}: InvoiceSidebarProps) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Status:</span>
              <StatusBadge status={invoice.status} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount:</span>
              <span className="font-medium">{formatCurrency(invoice.total_amount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Info */}
      {invoice.customer && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Customer</h3>
            <div className="space-y-2">
              <div>
                <div className="font-medium">{invoice.customer.name}</div>
                {invoice.customer.email && (
                  <div className="text-sm text-muted-foreground">{invoice.customer.email}</div>
                )}
              </div>
              {invoice.customer.phone && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Phone: </span>
                  <span>{invoice.customer.phone}</span>
                </div>
              )}
              {invoice.customer.address && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Address: </span>
                  <span>{invoice.customer.address}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">Actions</h3>
          <div className="space-y-2">
            {invoice.status === 'draft' && (
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => onUpdateStatus('sent')}
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
                  className="mr-2"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                Mark as Sent
              </Button>
            )}
            
            {invoice.status === 'sent' && (
              <Button 
                className="w-full justify-start bg-green-600 hover:bg-green-700" 
                onClick={() => onUpdateStatus('paid')}
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
                  className="mr-2"
                >
                  <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
                  <path d="M2 20h.01"></path>
                </svg>
                Mark as Paid
              </Button>
            )}
            
            <Button variant="outline" className="w-full justify-start" onClick={onDownload}>
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
                className="mr-2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download PDF
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
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
                className="mr-2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Invoice
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
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
                className="mr-2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Duplicate
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-600 hover:text-red-700"
              onClick={onDelete}
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
                className="mr-2"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              Delete Invoice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
