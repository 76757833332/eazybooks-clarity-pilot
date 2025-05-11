
import { supabase } from "@/integrations/supabase/client";
import { Invoice, InvoiceItem } from "@/types/invoice";
import { invoiceCalculationService } from "./invoiceCalculationService";

/**
 * Service for updating invoices
 */
export const invoiceUpdateService = {
  /**
   * Update an existing invoice and its items
   */
  updateInvoice: async (id: string, invoice: Partial<Invoice>, items?: Partial<InvoiceItem>[]) => {
    let totalAmount = invoice.total_amount;
    
    // If items are provided, recalculate total amount
    if (items && items.length > 0) {
      totalAmount = items.reduce((sum, item) => {
        // Skip items marked for deletion (if any)
        if ((item as any).deleted) return sum;
        
        // Ensure price and quantity are numbers
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        const itemAmount = price * quantity;
        return sum + itemAmount;
      }, 0);
      
      // Update the invoice with the new total
      invoice.total_amount = totalAmount;
    }
    
    // Update the invoice
    const { data, error } = await supabase
      .from("invoices")
      .update(invoice)
      .eq("id", id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating invoice:", error);
      throw error;
    }
    
    // Update items if provided
    if (items && items.length > 0) {
      await invoiceUpdateService.updateInvoiceItems(id, items);
    }
    
    return data as Invoice;
  },
  
  /**
   * Update invoice items, handling updates, deletions and insertions
   */
  updateInvoiceItems: async (invoiceId: string, items: Partial<InvoiceItem>[]) => {
    // Create an array to track new items to be added
    const newItems = [];
    const updatePromises = [];
    
    for (const item of items) {
      // Calculate amount based on price and quantity
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      const amount = price * quantity;
      
      if (item.id) {
        // Update existing item
        // Ensure description is provided since it's required
        const itemToUpdate = {
          ...item,
          price: price,
          quantity: quantity,
          amount: amount,
          description: item.description || '' // Provide a default value if description is not set
        };
        
        updatePromises.push(
          supabase
            .from("invoice_items")
            .update(itemToUpdate)
            .eq("id", item.id)
        );
      } else {
        // Add new item
        // Ensure all required fields are provided for new items
        const newItem = {
          invoice_id: invoiceId,
          description: item.description || '', // Provide a default value if description is not set
          price: price,
          quantity: quantity,
          amount: amount
        };
        
        newItems.push(newItem);
      }
    }
    
    // Execute all update promises
    if (updatePromises.length > 0) {
      const updateResults = await Promise.all(updatePromises);
      for (const result of updateResults) {
        if (result.error) {
          console.error("Error updating invoice item:", result.error);
          throw result.error;
        }
      }
    }
    
    // Insert new items if any
    if (newItems.length > 0) {
      const { error: insertError } = await supabase
        .from("invoice_items")
        .insert(newItems);
        
      if (insertError) {
        console.error("Error adding invoice items:", insertError);
        throw insertError;
      }
    }
    
    return true;
  }
};
