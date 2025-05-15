
import { supabase } from "@/integrations/supabase/client";
import { Invoice, InvoiceItem } from "@/types/invoice";
import { baseService } from "@/services/base/baseService";

/**
 * Service for querying invoice data
 */
export const invoiceQueryService = {
  /**
   * Get all invoices for the current user and tenant
   */
  getInvoices: async () => {
    try {
      const userId = await baseService.getCurrentUserId();
      const tenantId = await baseService.getCurrentTenantId();
      
      console.log("Fetching invoices for user:", userId, "in tenant:", tenantId);
      
      // Create the base query with essential parameters
      const baseQuery = supabase
        .from("invoices")
        .select(`
          *,
          customer:customers(*)
        `)
        .eq("user_id", userId)
        .order("issue_date", { ascending: false });
      
      // Execute appropriate query with or without tenant filter
      const { data, error } = tenantId 
        ? await baseQuery.eq("tenant_id", tenantId)
        : await baseQuery;
      
      if (error) {
        console.error("Error fetching invoices:", error);
        throw error;
      }
      
      console.log("Invoices retrieved:", data?.length || 0);
      return data as Invoice[];
    } catch (error) {
      console.error("Error in getInvoices:", error);
      // If there's an error with the join query, fall back to just invoices
      try {
        const userId = await baseService.getCurrentUserId();
        const tenantId = await baseService.getCurrentTenantId();
        
        // Create a fallback base query
        const fallbackQuery = supabase
          .from("invoices")
          .select("*")
          .eq("user_id", userId)
          .order("issue_date", { ascending: false });
        
        // Execute appropriate fallback query with or without tenant filter
        const { data, error: fallbackError } = tenantId
          ? await fallbackQuery.eq("tenant_id", tenantId)
          : await fallbackQuery;
        
        if (fallbackError) {
          console.error("Error in fallback query:", fallbackError);
          throw fallbackError;
        }
        
        console.log("Fallback invoices retrieved:", data?.length || 0);
        return data as Invoice[];
      } catch (secondError) {
        console.error("Error in fallback query:", secondError);
        throw secondError;
      }
    }
  },
  
  /**
   * Get invoice by ID with customer and item details
   * Makes sure the invoice belongs to the current tenant
   */
  getInvoiceById: async (id: string) => {
    try {
      const userId = await baseService.getCurrentUserId();
      const tenantId = await baseService.getCurrentTenantId();
      
      // Create the base query
      const query = supabase
        .from("invoices")
        .select(`
          *,
          customer:customers(*),
          items:invoice_items(*)
        `)
        .eq("id", id)
        .eq("user_id", userId);
      
      // Add tenant filter if available and execute
      const { data, error } = tenantId
        ? await query.eq("tenant_id", tenantId).maybeSingle()
        : await query.maybeSingle();
      
      if (error) {
        console.error("Error fetching invoice:", error);
        throw error;
      }
      
      if (!data) {
        throw new Error(`Invoice not found or you don't have access to this invoice`);
      }
      
      return data as Invoice & { items: InvoiceItem[] };
    } catch (error) {
      console.error("Error in getInvoiceById:", error);
      throw error;
    }
  },
  
  /**
   * Get all items for a specific invoice
   * Ensures the items belong to an invoice in the current tenant
   */
  getInvoiceItems: async (invoiceId: string) => {
    try {
      // First, verify this invoice belongs to the current user/tenant
      const userId = await baseService.getCurrentUserId();
      const tenantId = await baseService.getCurrentTenantId();
      
      // Build the verification query
      const verificationQuery = supabase
        .from("invoices")
        .select("id")
        .eq("id", invoiceId)
        .eq("user_id", userId);
      
      // Execute verification query with or without tenant filter
      const result = tenantId
        ? await verificationQuery.eq("tenant_id", tenantId).maybeSingle()
        : await verificationQuery.maybeSingle();
        
      const invoiceData = result.data;
      const invoiceError = result.error;
      
      if (invoiceError || !invoiceData) {
        console.error("Error: Not authorized to access this invoice or invoice not found");
        throw new Error("Not authorized to access this invoice");
      }
      
      // If invoice verification passed, get the items
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
    } catch (error) {
      console.error("Error in getInvoiceItems:", error);
      throw error;
    }
  },
};
