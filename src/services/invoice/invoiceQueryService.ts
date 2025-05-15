
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
      
      // Define base select statement
      const selectQuery = `
        *,
        customer:customers(*)
      `;
      
      // Create a base query without applying filters yet
      const query = supabase
        .from("invoices")
        .select(selectQuery);
      
      // Apply user filter
      const userFilteredQuery = query.eq("user_id", userId);
      
      // Execute different queries based on tenant
      let result;
      
      if (tenantId) {
        // Apply tenant filter
        result = await userFilteredQuery.eq("tenant_id", tenantId).order("issue_date", { ascending: false });
      } else {
        // No tenant filter
        result = await userFilteredQuery.order("issue_date", { ascending: false });
      }
          
      const { data, error } = result;
      
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
        
        // Create a base fallback query
        const fallbackQuery = supabase
          .from("invoices")
          .select("*");
        
        // Apply user filter
        const userFilteredFallbackQuery = fallbackQuery.eq("user_id", userId);
        
        // Execute different queries based on tenant
        let result;
        
        if (tenantId) {
          // Apply tenant filter
          result = await userFilteredFallbackQuery.eq("tenant_id", tenantId).order("issue_date", { ascending: false });
        } else {
          // No tenant filter
          result = await userFilteredFallbackQuery.order("issue_date", { ascending: false });
        }
        
        const { data, error } = result;
        
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
      
      // Define the select query string
      const selectQuery = `
        *,
        customer:customers(*),
        items:invoice_items(*)
      `;
      
      // Create base query
      const query = supabase
        .from("invoices")
        .select(selectQuery)
        .eq("id", id)
        .eq("user_id", userId);
      
      // Execute query based on whether tenant filter is needed
      let result;
      
      if (tenantId) {
        // Query with tenant filter
        result = await query.eq("tenant_id", tenantId).maybeSingle();
      } else {
        // Query without tenant filter
        result = await query.maybeSingle();
      }
      
      const { data, error } = result;
      
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
      
      // Build base verification query
      const verificationQuery = supabase
        .from("invoices")
        .select("id")
        .eq("id", invoiceId)
        .eq("user_id", userId);
      
      // Execute verification query with or without tenant filter
      let verificationResult;
      
      if (tenantId) {
        // Verification query with tenant filter
        verificationResult = await verificationQuery.eq("tenant_id", tenantId).maybeSingle();
      } else {
        // Verification query without tenant filter
        verificationResult = await verificationQuery.maybeSingle();
      }
      
      const { data: invoiceData, error: invoiceError } = verificationResult;
      
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
