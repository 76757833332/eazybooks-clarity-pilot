
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
      
      // Build the base query without any filters first
      const baseQuery = supabase.from("invoices");
      
      // Apply filters one by one to avoid deep chaining
      const withUserFilter = baseQuery.select(`
        *,
        customer:customers(*)
      `).eq("user_id", userId);
      
      // Create a separate query with tenant filter if applicable
      let finalQuery;
      if (tenantId) {
        finalQuery = withUserFilter.eq("tenant_id", tenantId);
      } else {
        finalQuery = withUserFilter;
      }
      
      // Execute the query with ordering as the final operation
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
        
        // Create a base fallback query without any filters first
        const baseQuery = supabase.from("invoices");
        
        // Apply user filter
        const withUserFilter = baseQuery.select("*").eq("user_id", userId);
        
        // Create a separate query with tenant filter if applicable
        let finalQuery;
        if (tenantId) {
          finalQuery = withUserFilter.eq("tenant_id", tenantId);
        } else {
          finalQuery = withUserFilter;
        }
        
        // Execute the query
        const { data, error } = await finalQuery.order("issue_date", { ascending: false });
        
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
      
      // Create base query without filters first
      const baseQuery = supabase.from("invoices");
      
      // Apply basic filters one by one
      const withFilters = baseQuery.select(`
        *,
        customer:customers(*),
        items:invoice_items(*)
      `)
      .eq("id", id)
      .eq("user_id", userId);
      
      // Apply tenant filter separately if needed
      let finalQuery;
      if (tenantId) {
        finalQuery = withFilters.eq("tenant_id", tenantId);
      } else {
        finalQuery = withFilters;
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
      
      // Build verification query without filters first
      const baseVerificationQuery = supabase.from("invoices");
      
      // Apply basic filters
      const withUserFilter = baseVerificationQuery
        .select("id")
        .eq("id", invoiceId)
        .eq("user_id", userId);
      
      // Apply tenant filter separately
      let finalVerificationQuery;
      if (tenantId) {
        finalVerificationQuery = withUserFilter.eq("tenant_id", tenantId);
      } else {
        finalVerificationQuery = withUserFilter;
      }
      
      // Execute the verification query
      const { data: invoiceData, error: invoiceError } = await finalVerificationQuery.maybeSingle();
      
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
