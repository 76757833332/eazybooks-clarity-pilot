
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/types/invoice";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { CustomerSelect } from "@/components/invoices/CustomerSelect";
import { invoiceService } from "@/services/invoice";
import { toast } from "@/components/ui/use-toast";

const CreateInvoice: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Fetch customers
  const { data: customers, refetch: refetchCustomers, isError: isCustomersError } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("customers")
          .select("*")
          .order("name");

        if (error) {
          console.error("Error fetching customers:", error);
          toast({
            title: "Error fetching customers",
            description: error.message,
            variant: "destructive"
          });
          throw error;
        }
        
        return data as Customer[];
      } catch (error) {
        console.error("Error in customer query:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Generate invoice number
  const { data: invoiceNumber, isError: isInvoiceNumberError } = useQuery({
    queryKey: ["invoice-number"],
    queryFn: async () => {
      try {
        return await invoiceService.generateInvoiceNumber();
      } catch (error) {
        console.error("Error generating invoice number:", error);
        toast({
          title: "Error generating invoice number",
          description: "Could not generate a new invoice number. Using a fallback.",
          variant: "destructive"
        });
        return `INV-${new Date().getTime().toString().slice(-4)}`;
      }
    }
  });

  // Handle new customer added
  const handleCustomerAdded = (newCustomer: Customer) => {
    refetchCustomers();
  };

  // Show error state if needed
  if (isCustomersError && isInvoiceNumberError) {
    return (
      <AppLayout title="Create Invoice">
        <div className="p-6 text-center">
          <h2 className="text-xl font-medium text-destructive mb-2">Error Loading Invoice Data</h2>
          <p className="text-muted-foreground mb-4">
            There was a problem loading the necessary data to create an invoice.
            Please make sure you're logged in and try again.
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Create Invoice">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-eazybooks-purple"></div>
        </div>
      ) : (
        <>
          <CustomerSelect 
            customers={customers || []} 
            onCustomerAdded={handleCustomerAdded} 
          />
          <InvoiceForm 
            customers={customers} 
            invoiceNumber={invoiceNumber} 
          />
        </>
      )}
    </AppLayout>
  );
};

export default CreateInvoice;
