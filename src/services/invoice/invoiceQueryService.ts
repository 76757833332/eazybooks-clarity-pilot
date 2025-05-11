
import { supabase } from "@/integrations/supabase/client";
import { Invoice, InvoiceItem } from "@/types/invoice";
import { baseService } from "@/services/base/baseService";

/**
 * Service for querying invoice data
 */
export const invoiceQueryService = {
  /**
   * Get all invoices for the current user
   */
  getInvoices: async () => {
    const user = await baseService.getCurrentUser();
    
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          customer:customers(*)
        `)
        .eq("user_id", user.id)
        .order("issue_date", { ascending: false });
        
      if (error) throw error;
      return data as Invoice[]; // Simplified casting since we're using proper relationships
    } catch (error) {
      console.error("Error fetching invoices:", error);
      // If there's an error with the join query, fall back to just invoices
      const { data, error: fallbackError } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("issue_date", { ascending: false });
        
      if (fallbackError) throw fallbackError;
      return data as Invoice[];
    }
  },
  
  /**
   * Get invoice by ID with customer and item details
   */
  getInvoiceById: async (id: string) => {
    const { data, error } = await supabase
      .from("invoices")
      .select(`
        *,
        customer:customers(*),
        items:invoice_items(*)
      `)
      .eq("id", id)
      .single();
      
    if (error) {
      console.error("Error fetching invoice:", error);
      throw error;
    }
    
    return data as Invoice & { items: InvoiceItem[] };
  },
  
  /**
   * Get all items for a specific invoice
   */
  getInvoiceItems: async (invoiceId: string) => {
    const { data, error } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", invoiceId)
      .order("created_at");
      
    if (error) {
      console.error("Error fetching invoice items:", error);
      throw error;
    }
    
    return data as InvoiceItem[];
  },
};
