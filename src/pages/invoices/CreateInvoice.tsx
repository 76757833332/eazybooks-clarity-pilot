
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/types/invoice";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { CustomerSelect } from "@/components/invoices/CustomerSelect";
import { invoiceService } from "@/services/invoice";

const CreateInvoice: React.FC = () => {
  // Fetch customers
  const { data: customers, refetch: refetchCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching customers:", error);
        throw new Error(error.message);
      }
      
      return data as Customer[];
    },
  });

  // Generate invoice number
  const { data: invoiceNumber } = useQuery({
    queryKey: ["invoice-number"],
    queryFn: async () => {
      try {
        return await invoiceService.generateInvoiceNumber();
      } catch (error) {
        console.error("Error generating invoice number:", error);
        return `INV-${new Date().getTime().toString().slice(-4)}`;
      }
    }
  });

  // Handle new customer added
  const handleCustomerAdded = (newCustomer: Customer) => {
    refetchCustomers();
  };

  return (
    <AppLayout title="Create Invoice">
      <CustomerSelect 
        customers={customers || []} 
        onCustomerAdded={handleCustomerAdded} 
      />
      <InvoiceForm 
        customers={customers} 
        invoiceNumber={invoiceNumber} 
      />
    </AppLayout>
  );
};

export default CreateInvoice;
