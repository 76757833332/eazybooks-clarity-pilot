
import { supabase } from "@/integrations/supabase/client";
import { Invoice, InvoiceItem } from "@/types/invoice";
import { baseService } from "@/services/base/baseService";
import { invoiceCalculationService } from "./invoiceCalculationService";

/**
 * Service for creating invoices
 */
export const invoiceCreateService = {
  /**
   * Create a new invoice with items
   */
  createInvoice: async (invoice: Omit<Invoice, "id" | "created_at" | "updated_at">, items: Omit<InvoiceItem, "id" | "invoice_id" | "created_at" | "updated_at">[]) => {
    const user = await baseService.getCurrentUser();
    
    // Calculate total amount from items
    const totalAmount = invoiceCalculationService.calculateItemsTotal(items);
    
    // Start a transaction
    const { data, error } = await supabase
      .from("invoices")
      .insert([{ 
        ...invoice, 
        user_id: user.id,
        total_amount: totalAmount  // Set the calculated total
      }])
      .select()
      .single();
      
    if (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
    
    // Now add the items if there are any
    if (items.length > 0) {
      const itemsWithInvoiceId = invoiceCalculationService.prepareInvoiceItems(items, data.id);
      
      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(itemsWithInvoiceId);
        
      if (itemsError) {
        console.error("Error creating invoice items:", itemsError);
        throw itemsError;
      }
    }
    
    return data as Invoice;
  },
  
  /**
   * Generate a sequential invoice number
   */
  generateInvoiceNumber: async () => {
    const user = await baseService.getCurrentUser();
    
    const { data, error } = await supabase
      .from("invoices")
      .select("invoice_number")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);
      
    if (error) {
      console.error("Error generating invoice number:", error);
      throw error;
    }
    
    let nextNumber = 1;
    const prefix = "INV-";
    
    if (data && data.length > 0 && data[0].invoice_number) {
      const lastNumber = data[0].invoice_number;
      if (lastNumber.startsWith(prefix)) {
        const num = parseInt(lastNumber.substring(prefix.length), 10);
        if (!isNaN(num)) {
          nextNumber = num + 1;
        }
      }
    }
    
    return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
  }
};
