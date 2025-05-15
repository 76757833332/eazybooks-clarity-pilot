
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/types/invoice";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { CustomerSelect } from "@/components/invoices/CustomerSelect";
import { invoiceService } from "@/services/invoice";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CreateInvoice: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Verify authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setAuthError("Please log in to create invoices.");
        }
      } catch (error) {
        console.error("Auth error:", error);
        setAuthError("Authentication error occurred.");
      }
    };
    
    checkAuth();
  }, []);

  // Fetch customers
  const { data: customers, refetch: refetchCustomers, isError: isCustomersError, error: customersError } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      try {
        console.log("Fetching customers...");
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
        
        console.log("Customers retrieved:", data?.length || 0);
        return data as Customer[];
      } catch (error: any) {
        console.error("Error in customer query:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Generate invoice number
  const { data: invoiceNumber, isError: isInvoiceNumberError, error: invoiceNumberError } = useQuery({
    queryKey: ["invoice-number"],
    queryFn: async () => {
      try {
        console.log("Generating invoice number...");
        return await invoiceService.generateInvoiceNumber();
      } catch (error: any) {
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
    console.log("New customer added:", newCustomer.name);
    refetchCustomers();
  };

  // Display auth error if present
  if (authError) {
    return (
      <AppLayout title="Create Invoice">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            {authError} Please make sure you're logged in and try again.
          </AlertDescription>
        </Alert>
      </AppLayout>
    );
  }

  // Show error state if needed
  if (isCustomersError || isInvoiceNumberError) {
    return (
      <AppLayout title="Create Invoice">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Invoice Data</AlertTitle>
          <AlertDescription>
            {customersError instanceof Error ? customersError.message : ''}
            {invoiceNumberError instanceof Error ? invoiceNumberError.message : ''}
          </AlertDescription>
        </Alert>
        <div className="p-6 text-center">
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
