
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
      
      // Prepare the selection string
      const selection = `
        *,
        customer:customers(*)
      `;
      
      // Create the base query
      const query = supabase.from("invoices").select(selection);
      
      // Add user filter
      const userFiltered = query.eq("user_id", userId);
      
      // Add tenant filter if needed
      let finalQuery;
      if (tenantId) {
        finalQuery = userFiltered.eq("tenant_id", tenantId);
      } else {
        finalQuery = userFiltered;
      }
      
      // Execute query with order
      const { data, error } = await finalQuery.order("issue_date", { ascending: false });
      
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
        
        let query = supabase
          .from("invoices")
          .select("*")
          .eq("user_id", userId);
        
        // Add tenant filter if needed
        if (tenantId) {
          query = query.eq("tenant_id", tenantId);
        }
        
        const { data, error } = await query.order("issue_date", { ascending: false });
        
        if (error) {
          console.error("Error in fallback query:", error);
          throw error;
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
      
      // Prepare the selection
      const selection = `
        *,
        customer:customers(*),
        items:invoice_items(*)
      `;
      
      // Create the base query
      const query = supabase
        .from("invoices")
        .select(selection)
        .eq("id", id)
        .eq("user_id", userId);
        
      // Add tenant filter if needed
      let finalQuery;
      if (tenantId) {
        finalQuery = query.eq("tenant_id", tenantId);
      } else {
        finalQuery = query;
      }
      
      // Execute the query
      const { data, error } = await finalQuery.maybeSingle();
      
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
      
      // Create the base query for validation
      const validationQuery = supabase
        .from("invoices")
        .select("id")
        .eq("id", invoiceId)
        .eq("user_id", userId);
        
      // Add tenant filter if needed
      let finalValidationQuery;
      if (tenantId) {
        finalValidationQuery = validationQuery.eq("tenant_id", tenantId);
      } else {
        finalValidationQuery = validationQuery;
      }
      
      // Execute validation query
      const { data: invoiceData, error: invoiceError } = await finalValidationQuery.maybeSingle();
      
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
