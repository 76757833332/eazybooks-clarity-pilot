
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { invoiceService } from "@/services/invoice";
import { pdfService } from "@/services/pdf";
import { useAuth } from "@/contexts/auth";
// Import refactored components
import { LoadingState } from "@/components/invoices/LoadingState";
import { NotFoundState } from "@/components/invoices/NotFoundState";
import { InvoiceHeader } from "@/components/invoices/InvoiceHeader";
import { InvoiceContent } from "@/components/invoices/InvoiceContent";
import { InvoiceSidebar } from "@/components/invoices/InvoiceSidebar";
import { DeleteInvoiceDialog } from "@/components/invoices/DeleteInvoiceDialog";

const InvoiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const { business } = useAuth();
  // Fetch invoice details
  const { data: invoice, isLoading: isLoadingInvoice } = useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      if (!id) throw new Error("Invoice ID is required");
      
      return await invoiceService.getInvoiceById(id);
    },
  });

  // Fetch invoice items
  const { data: invoiceItems, isLoading: isLoadingItems } = useQuery({
    queryKey: ["invoiceItems", id],
    queryFn: async () => {
      if (!id) throw new Error("Invoice ID is required");
      
      return await invoiceService.getInvoiceItems(id);
    },
  });

  // Actions
  const handleUpdateStatus = async (newStatus: string) => {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from("invoices")
        .update({ status: newStatus })
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Status updated",
        description: `Invoice status has been updated to ${newStatus}.`,
      });
      
      // Refresh data
      window.location.reload();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Failed to update status",
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  const handleDeleteInvoice = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      
      await invoiceService.deleteInvoice(id);
      
      toast({
        title: "Invoice deleted",
        description: "The invoice has been permanently deleted.",
      });
      
      navigate("/invoices");
    } catch (error: any) {
      console.error("Error deleting invoice:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete invoice",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const isLoading = isLoadingInvoice || isLoadingItems;

  const handleDownloadPDF = () => {
    try {
      if (invoice && invoiceItems) {
        pdfService.generateInvoicePDF(invoice, invoiceItems, business);
        toast({ title: "Invoice downloaded", description: "PDF generated successfully." });
      } else {
        toast({ variant: "destructive", title: "Download failed", description: "Invoice data not ready." });
      }
    } catch (error: any) {
      console.error("Error downloading invoice PDF:", error);
      toast({ variant: "destructive", title: "Failed to generate PDF", description: error?.message || "Unexpected error." });
    }
  };

  return (
    <AppLayout title="Invoice Details">
      {isLoading ? (
        <LoadingState />
      ) : !invoice ? (
        <NotFoundState />
      ) : (
        <>
          {/* Header */}
          <InvoiceHeader 
            invoice={invoice} 
            onUpdateStatus={handleUpdateStatus}
            onDelete={() => {}}  // Empty function since we use the dialog
            isDeleting={isDeleting}
            onDownload={handleDownloadPDF}
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-6">
              {/* Invoice Content */}
              <InvoiceContent 
                invoice={invoice} 
                invoiceItems={invoiceItems || []} 
              />
            </div>

            <div className="md:col-span-4">
              {/* Sidebar */}
              <InvoiceSidebar 
                invoice={invoice} 
                onUpdateStatus={handleUpdateStatus}
                onDelete={() => {
                  // This is just a button that triggers the dialog, the actual delete happens in the dialog
                  const deleteButton = document.querySelector('[data-delete-invoice-trigger]');
                  if (deleteButton instanceof HTMLElement) {
                    deleteButton.click();
                  }
                }}
                onDownload={handleDownloadPDF}
              />

              {/* Hidden Delete Dialog Trigger */}
              <span className="hidden">
                <DeleteInvoiceDialog
                  invoiceNumber={invoice.invoice_number}
                  isDeleting={isDeleting}
                  onDelete={handleDeleteInvoice}
                >
                  <button data-delete-invoice-trigger>Delete</button>
                </DeleteInvoiceDialog>
              </span>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default InvoiceDetails;
