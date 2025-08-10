
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Invoice, InvoiceItem, Customer } from "@/types/invoice";

// Define the InvoiceWithItems type that was missing
export type InvoiceWithItems = Invoice & {
  items: InvoiceItem[];
};

export const fetchInvoices = async (userId: string = ''): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  // Add type assertion to ensure the data conforms to Invoice type
  return (data || []) as Invoice[];
};

export const fetchInvoiceById = async (
  invoiceId: string
): Promise<InvoiceWithItems | null> => {
  // First, fetch the invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", invoiceId)
    .single();

  if (invoiceError) {
    throw new Error(invoiceError.message);
  }

  if (!invoice) {
    return null;
  }

  // Optionally fetch the customer details and attach to the invoice object
  let customer: Customer | null = null;
  if (invoice.customer_id) {
    const { data: customerData, error: customerError } = await supabase
      .from("customers")
      .select("*")
      .eq("id", invoice.customer_id)
      .single();
    if (customerError) {
      // Don't throw here; allow invoice to load without customer if there's a permissions/data issue
      console.warn("Failed to load customer for invoice:", customerError.message);
    } else {
      customer = (customerData as Customer) || null;
    }
  }

  // Then fetch the invoice items
  const { data: items, error: itemsError } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", invoiceId);

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return {
    ...invoice,
    customer: customer, // attach so UI and PDF can display customer name/details
    items: (items || []) as InvoiceItem[],
  } as InvoiceWithItems;
};

export const useInvoicesQuery = (userId: string) => {
  return useQuery({
    queryKey: ["invoices", userId],
    queryFn: () => fetchInvoices(userId),
  });
};

export const useInvoiceQuery = (invoiceId: string | undefined) => {
  return useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => fetchInvoiceById(invoiceId as string),
    enabled: !!invoiceId,
  });
};
