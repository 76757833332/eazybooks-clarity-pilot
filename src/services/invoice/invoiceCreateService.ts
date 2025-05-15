
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
    try {
      const userId = await baseService.getCurrentUserId();
      console.log("Creating invoice for user:", userId);
      
      // Calculate total amount from items
      const totalAmount = invoiceCalculationService.calculateItemsTotal(items);
      console.log("Calculated total amount:", totalAmount);
      
      // Start a transaction
      const { data, error } = await supabase
        .from("invoices")
        .insert([{ 
          ...invoice, 
          user_id: userId,
          total_amount: totalAmount  // Set the calculated total
        }])
        .select()
        .single();
        
      if (error) {
        console.error("Error creating invoice:", error);
        throw error;
      }
      
      console.log("Invoice created with ID:", data.id);
      
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
        
        console.log("Added", items.length, "items to invoice");
      }
      
      return data as Invoice;
    } catch (error) {
      console.error("Error in createInvoice:", error);
      throw error;
    }
  },
  
  /**
   * Generate a sequential invoice number
   */
  generateInvoiceNumber: async () => {
    try {
      const userId = await baseService.getCurrentUserId();
      console.log("Generating invoice number for user:", userId);
      
      const { data, error } = await supabase
        .from("invoices")
        .select("invoice_number")
        .eq("user_id", userId)
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
      
      const invoiceNumber = `${prefix}${nextNumber.toString().padStart(4, '0')}`;
      console.log("Generated invoice number:", invoiceNumber);
      return invoiceNumber;
    } catch (error) {
      console.error("Error in generateInvoiceNumber:", error);
      throw error;
    }
  }
};
