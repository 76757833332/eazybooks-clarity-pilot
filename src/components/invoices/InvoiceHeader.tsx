
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { Invoice } from "@/types/invoice";

interface InvoiceHeaderProps {
  invoice: Invoice;
  onUpdateStatus: (newStatus: string) => Promise<void>;
  onDelete: () => void;
  isDeleting: boolean;
  onDownload: () => void;
}

export const InvoiceHeader = ({ 
  invoice, 
  onUpdateStatus, 
  onDelete,
  isDeleting,
  onDownload,
}: InvoiceHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/invoices")}
          className="mr-2"
        >
          <ChevronLeft size={16} />
        </Button>
        <div>
          <h2 className="text-2xl font-semibold">
            Invoice #{invoice.invoice_number}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <StatusBadge status={invoice.status} />
            <span>•</span>
            <span>Created {new Date(invoice.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {invoice.status === 'draft' && (
          <Button 
            variant="outline" 
            size="sm"
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
              className="mr-1"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            Mark as Sent
          </Button>
        )}
        
        {invoice.status === 'sent' && (
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white" 
            size="sm"
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
              className="mr-1"
            >
              <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
              <path d="M2 20h.01"></path>
            </svg>
            Mark as Paid
          </Button>
        )}
        
        <Button variant="outline" size="sm" onClick={onDownload}>
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
            className="mr-1"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download PDF
        </Button>
        
        <Button variant="outline" size="sm">
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
            className="mr-1"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Duplicate
        </Button>

        <Button 
          variant="destructive" 
          size="sm"
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
            className="mr-1"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          {isDeleting ? (
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
              Deleting...
            </span>
          ) : "Delete"}
        </Button>
      </div>
    </div>
  );
};
