
import { supabase } from "@/integrations/supabase/client";
import { Tax, NewTax, TaxCategory, TaxStatus } from "@/types/tax";
import { formatCurrency } from "@/lib/utils";

// Type for tax creation that doesn't require user_id
export type CreateTaxInput = Omit<NewTax, "user_id">;

export const taxService = {
  // Get all taxes for the current user
  getTaxes: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("taxes")
      .select("*")
      .eq("user_id", user.user.id)
      .order("due_date", { ascending: false });
      
    if (error) throw error;
    return data as Tax[];
  },
  
  // Get a single tax by id
  getTaxById: async (id: string) => {
    const { data, error } = await supabase
      .from("taxes")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) throw error;
    return data as Tax;
  },
  
  // Create a new tax record
  createTax: async (tax: CreateTaxInput) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const newTax = {
      ...tax,
      user_id: user.user.id
    };
    
    const { data, error } = await supabase
      .from("taxes")
      .insert([newTax])
      .select()
      .single();
      
    if (error) throw error;
    return data as Tax;
  },
  
  // Update a tax record
  updateTax: async (id: string, tax: Partial<Tax>) => {
    const { data, error } = await supabase
      .from("taxes")
      .update(tax)
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    return data as Tax;
  },
  
  // Delete a tax record
  deleteTax: async (id: string) => {
    const { error } = await supabase
      .from("taxes")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  },

  // Get tax summary - total pending, paid, and overdue amounts
  getTaxSummary: async () => {
    const taxes = await taxService.getTaxes();
    
    const summary = {
      pending: 0,
      paid: 0,
      overdue: 0,
      upcoming: 0,
      total: 0
    };
    
    const today = new Date();
    
    taxes.forEach(tax => {
      summary.total += tax.amount;
      
      if (tax.status === 'paid') {
        summary.paid += tax.amount;
      } else if (tax.status === 'overdue') {
        summary.overdue += tax.amount;
      } else if (tax.status === 'pending') {
        const dueDate = new Date(tax.due_date);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          // Should be marked as overdue
          summary.overdue += tax.amount;
        } else if (diffDays <= 30) {
          // Due within 30 days
          summary.upcoming += tax.amount;
        } else {
          summary.pending += tax.amount;
        }
      }
    });
    
    return summary;
  }
};
