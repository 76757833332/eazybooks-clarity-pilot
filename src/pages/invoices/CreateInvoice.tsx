
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/types/invoice";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { CustomerSelect } from "@/components/invoices/CustomerSelect";
import { invoiceService } from "@/services/invoice";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CreateInvoice: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
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

  // Fetch customers with better error handling
  const { data: customers, refetch: refetchCustomers, isLoading: customersLoading, isError: isCustomersError, error: customersError } = useQuery({
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
          throw error;
        }
        
        console.log("Customers retrieved:", data?.length || 0);
        return data as Customer[];
      } catch (error: any) {
        console.error("Error in customer query:", error);
        toast.error("Failed to load customers");
        throw error;
      }
    },
  });

  // Generate invoice number with better error handling
  const { data: invoiceNumber, isLoading: invoiceNumberLoading, isError: isInvoiceNumberError } = useQuery({
    queryKey: ["invoice-number"],
    queryFn: async () => {
      try {
        console.log("Generating invoice number...");
        const number = await invoiceService.generateInvoiceNumber();
        console.log("Invoice number generated:", number);
        return number;
      } catch (error: any) {
        console.error("Error generating invoice number:", error);
        // Don't show error toast for invoice number generation, just use fallback
        const fallbackNumber = `INV-${Date.now().toString().slice(-4)}`;
        console.log("Using fallback invoice number:", fallbackNumber);
        return fallbackNumber;
      }
    }
  });

  // Handle new customer added
  const handleCustomerAdded = (newCustomer: Customer) => {
    console.log("New customer added:", newCustomer.name);
    refetchCustomers();
  };

  // Set loading state
  const isPageLoading = customersLoading || invoiceNumberLoading;

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

  // Show error state for critical errors only
  if (isCustomersError) {
    return (
      <AppLayout title="Create Invoice">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription>
            {customersError instanceof Error ? customersError.message : 'Failed to load customers'}
          </AlertDescription>
        </Alert>
        <div className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            There was a problem loading customer data. Please try refreshing the page.
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Create Invoice">
      {isPageLoading ? (
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
