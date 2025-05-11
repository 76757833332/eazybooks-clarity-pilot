
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for deleting invoices and invoice items
 */
export const invoiceDeleteService = {
  /**
   * Delete an invoice and all its items
   */
  deleteInvoice: async (id: string) => {
    // Delete invoice items first (if there are any)
    const { error: itemsError } = await supabase
      .from("invoice_items")
      .delete()
      .eq("invoice_id", id);
      
    if (itemsError) {
      console.error("Error deleting invoice items:", itemsError);
    }
    
    // Then delete the invoice
    const { error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", id);
      
    if (error) {
      console.error("Error deleting invoice:", error);
      throw error;
    }
    
    return true;
  },
  
  /**
   * Delete a specific invoice item
   */
  deleteInvoiceItem: async (itemId: string) => {
    const { error } = await supabase
      .from("invoice_items")
      .delete()
      .eq("id", itemId);
      
    if (error) {
      console.error("Error deleting invoice item:", error);
      throw error;
    }
    
    return true;
  }
};
