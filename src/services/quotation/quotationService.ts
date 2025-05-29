
import { supabase } from "@/integrations/supabase/client";
import { Quotation, QuotationItem, NewQuotation, NewQuotationItem } from "@/types/quotation";
import { baseService } from "@/services/base/baseService";

export const quotationService = {
  // Get all quotations for the current user
  getQuotations: async (): Promise<Quotation[]> => {
    const userId = await baseService.getCurrentUserId();
    
    const { data, error } = await supabase
      .from("quotations")
      .select(`
        *,
        customer:customers(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching quotations:", error);
      throw error;
    }
    
    return data as Quotation[];
  },

  // Get a single quotation with items
  getQuotationById: async (id: string): Promise<Quotation & { items: QuotationItem[] }> => {
    const { data: quotation, error: quotationError } = await supabase
      .from("quotations")
      .select(`
        *,
        customer:customers(*)
      `)
      .eq("id", id)
      .single();
      
    if (quotationError) {
      console.error("Error fetching quotation:", quotationError);
      throw quotationError;
    }

    const { data: items, error: itemsError } = await supabase
      .from("quotation_items")
      .select("*")
      .eq("quotation_id", id)
      .order("created_at");
      
    if (itemsError) {
      console.error("Error fetching quotation items:", itemsError);
      throw itemsError;
    }
    
    return { ...quotation, items } as Quotation & { items: QuotationItem[] };
  },

  // Create a new quotation with items
  createQuotation: async (
    quotation: Omit<NewQuotation, "user_id">, 
    items: Omit<NewQuotationItem, "quotation_id">[]
  ): Promise<Quotation> => {
    const userId = await baseService.getCurrentUserId();
    
    // Calculate total amount from items
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    
    const { data, error } = await supabase
      .from("quotations")
      .insert([{ 
        ...quotation, 
        user_id: userId,
        total_amount: totalAmount
      }])
      .select()
      .single();
      
    if (error) {
      console.error("Error creating quotation:", error);
      throw error;
    }
    
    // Add items if there are any
    if (items.length > 0) {
      const itemsWithQuotationId = items.map(item => ({
        ...item,
        quotation_id: data.id
      }));
      
      const { error: itemsError } = await supabase
        .from("quotation_items")
        .insert(itemsWithQuotationId);
        
      if (itemsError) {
        console.error("Error creating quotation items:", itemsError);
        throw itemsError;
      }
    }
    
    return data as Quotation;
  },

  // Generate a sequential quotation number
  generateQuotationNumber: async (): Promise<string> => {
    try {
      const userId = await baseService.getCurrentUserId();
      
      const { data, error } = await supabase
        .from("quotations")
        .select("quotation_number")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);
        
      if (error) {
        console.error("Error querying quotations for number generation:", error);
        return `QUO-${Date.now().toString().slice(-6)}`;
      }
      
      let nextNumber = 1;
      const prefix = "QUO-";
      
      if (data && data.length > 0 && data[0].quotation_number) {
        const lastNumber = data[0].quotation_number;
        if (lastNumber.startsWith(prefix)) {
          const numericPart = lastNumber.substring(prefix.length);
          const num = parseInt(numericPart, 10);
          if (!isNaN(num)) {
            nextNumber = num + 1;
          }
        }
      }
      
      return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
    } catch (error) {
      console.error("Error in generateQuotationNumber:", error);
      return `QUO-${Date.now().toString().slice(-4)}`;
    }
  },

  // Update quotation status
  updateQuotationStatus: async (id: string, status: Quotation['status']): Promise<void> => {
    const { error } = await supabase
      .from("quotations")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
      
    if (error) {
      console.error("Error updating quotation status:", error);
      throw error;
    }
  },

  // Delete quotation
  deleteQuotation: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("quotations")
      .delete()
      .eq("id", id);
      
    if (error) {
      console.error("Error deleting quotation:", error);
      throw error;
    }
  }
};
