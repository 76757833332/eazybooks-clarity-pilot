
import { supabase } from "@/integrations/supabase/client";
import { Invoice, InvoiceItem } from "@/types/invoice";

export const invoiceService = {
  getInvoices: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          customer:customers(*)
        `)
        .eq("user_id", user.user.id)
        .order("issue_date", { ascending: false });
        
      if (error) throw error;
      return data as Invoice[]; // Simplified casting since we're using proper relationships
    } catch (error) {
      console.error("Error fetching invoices:", error);
      // If there's an error with the join query, fall back to just invoices
      const { data, error: fallbackError } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.user.id)
        .order("issue_date", { ascending: false });
        
      if (fallbackError) throw fallbackError;
      return data as Invoice[];
    }
  },
  
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
  
  createInvoice: async (invoice: Omit<Invoice, "id" | "created_at" | "updated_at">, items: Omit<InvoiceItem, "id" | "invoice_id" | "created_at" | "updated_at">[]) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    // Calculate total amount from items
    const totalAmount = items.reduce((sum, item) => {
      // Ensure price and quantity are numbers
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      const itemAmount = price * quantity;
      return sum + itemAmount;
    }, 0);
    
    // Start a transaction
    const { data, error } = await supabase
      .from("invoices")
      .insert([{ 
        ...invoice, 
        user_id: user.user.id,
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
      const itemsWithInvoiceId = items.map(item => {
        // Calculate amount based on price and quantity
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        const amount = price * quantity;
        
        return {
          invoice_id: data.id,
          description: item.description || '', // Ensure description is always provided
          price: price,
          quantity: quantity,
          amount: amount
        };
      });
      
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
  
  updateInvoice: async (id: string, invoice: Partial<Invoice>, items?: Partial<InvoiceItem>[]) => {
    let totalAmount = invoice.total_amount;
    
    // If items are provided, recalculate total amount
    if (items && items.length > 0) {
      totalAmount = items.reduce((sum, item) => {
        // Skip items marked for deletion (if any)
        if (item.deleted) return sum;
        
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
            invoice_id: id,
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
    }
    
    return data as Invoice;
  },
  
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
  },
  
  // Generate a sequential invoice number
  generateInvoiceNumber: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("invoices")
      .select("invoice_number")
      .eq("user_id", user.user.id)
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
