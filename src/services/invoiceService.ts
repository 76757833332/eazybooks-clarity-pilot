
import { supabase } from "@/integrations/supabase/client";
import { Invoice, InvoiceItem } from "@/types/invoice";

export const invoiceService = {
  // Get all invoices for the current user
  getInvoices: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("invoices")
      .select("*, customers:customer_id(*)")
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    return data as Invoice[];
  },
  
  // Get a single invoice by id
  getInvoiceById: async (id: string) => {
    const { data, error } = await supabase
      .from("invoices")
      .select("*, customers:customer_id(*)")
      .eq("id", id)
      .single();
      
    if (error) throw error;
    
    // Get invoice items
    const { data: items, error: itemsError } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", id);
      
    if (itemsError) throw itemsError;
    
    return {
      ...data,
      invoice_items: items
    } as Invoice & { invoice_items: InvoiceItem[] };
  },
  
  // Create a new invoice
  createInvoice: async (invoice: Omit<Invoice, "id" | "created_at" | "updated_at">, items: Omit<InvoiceItem, "id" | "created_at" | "updated_at" | "invoice_id">[]) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    // Start a transaction
    const { data: newInvoice, error } = await supabase
      .from("invoices")
      .insert([{ ...invoice, user_id: user.user.id }])
      .select()
      .single();
      
    if (error) throw error;
    
    // Add invoice items
    if (items.length > 0) {
      const formattedItems = items.map(item => ({
        ...item,
        invoice_id: newInvoice.id,
        description: item.description || "Item" // Ensure description is never undefined
      }));
      
      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(formattedItems);
        
      if (itemsError) throw itemsError;
    }
    
    return newInvoice;
  },
  
  // Update an existing invoice
  updateInvoice: async (id: string, invoice: Partial<Invoice>, items?: Partial<InvoiceItem>[]) => {
    // Update invoice
    const { data, error } = await supabase
      .from("invoices")
      .update(invoice)
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    
    // Update items if provided
    if (items && items.length > 0) {
      // Delete existing items
      await supabase
        .from("invoice_items")
        .delete()
        .eq("invoice_id", id);
        
      // Insert new items
      const formattedItems = items.map(item => ({
        ...item,
        invoice_id: id,
        description: item.description || "Item" // Ensure description is never undefined
      }));
      
      // Using .upsert() to properly handle inserts
      const { error: itemsError } = await supabase
        .from("invoice_items")
        .upsert(formattedItems);
        
      if (itemsError) throw itemsError;
    }
    
    return data;
  },
  
  // Delete an invoice
  deleteInvoice: async (id: string) => {
    // Delete invoice items first (foreign key constraint)
    const { error: itemsError } = await supabase
      .from("invoice_items")
      .delete()
      .eq("invoice_id", id);
      
    if (itemsError) throw itemsError;
    
    // Then delete the invoice
    const { error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  },
  
  // Get customers for dropdown
  getCustomers: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", user.user.id);
      
    if (error) throw error;
    return data;
  }
};
