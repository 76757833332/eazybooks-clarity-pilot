
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
      return data as unknown as Invoice[]; // Using unknown as an intermediate type
    } catch (error) {
      console.error("Error fetching invoices:", error);
      // If there's an error with the join query, fall back to just invoices
      const { data, error: fallbackError } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.user.id)
        .order("issue_date", { ascending: false });
        
      if (fallbackError) throw fallbackError;
      return data as unknown as Invoice[];
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
    
    return data as unknown as Invoice & { items: InvoiceItem[] };
  },
  
  createInvoice: async (invoice: Omit<Invoice, "id" | "created_at" | "updated_at">, items: Omit<InvoiceItem, "id" | "invoice_id" | "created_at" | "updated_at">[]) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    // Start a transaction
    const { data, error } = await supabase
      .from("invoices")
      .insert([{ ...invoice, user_id: user.user.id }])
      .select()
      .single();
      
    if (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
    
    // Now add the items if there are any
    if (items.length > 0) {
      const itemsWithInvoiceId = items.map(item => ({
        ...item,
        invoice_id: data.id,
        description: item.description || '' // Ensure description is always provided
      }));
      
      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(itemsWithInvoiceId as any[]);
        
      if (itemsError) {
        console.error("Error creating invoice items:", itemsError);
        throw itemsError;
      }
    }
    
    return data as Invoice;
  },
  
  updateInvoice: async (id: string, invoice: Partial<Invoice>, items?: Partial<InvoiceItem>[]) => {
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
    if (items) {
      for (const item of items) {
        if (item.id) {
          // Update existing item
          // Ensure description is provided since it's required
          const itemToUpdate = {
            ...item,
            description: item.description || '' // Provide a default value if description is not set
          };
          
          const { error: updateError } = await supabase
            .from("invoice_items")
            .update(itemToUpdate)
            .eq("id", item.id);
            
          if (updateError) {
            console.error("Error updating invoice item:", updateError);
            throw updateError;
          }
        } else {
          // Add new item
          // Ensure all required fields are provided for new items
          const newItem = {
            ...item,
            invoice_id: id,
            description: item.description || '' // Provide a default value if description is not set
          };
          
          const { error: insertError } = await supabase
            .from("invoice_items")
            .insert([newItem]);
            
          if (insertError) {
            console.error("Error adding invoice item:", insertError);
            throw insertError;
          }
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
