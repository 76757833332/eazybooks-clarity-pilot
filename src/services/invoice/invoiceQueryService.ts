
import { createClient } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Invoice, InvoiceWithItems } from "@/types/invoice";

const supabase = createClient();

export const fetchInvoices = async (userId: string): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
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
    items: items || [],
  };
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
