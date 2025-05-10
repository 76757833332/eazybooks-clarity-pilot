
import { supabase } from "@/integrations/supabase/client";
import { Tax } from "@/types/tax";

export const taxService = {
  getTaxes: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("taxes")
      .select("*")
      .eq("user_id", user.user.id)
      .order("due_date", { ascending: false });

    if (error) {
      console.error("Error fetching taxes:", error);
      throw error;
    }

    return data as Tax[];
  },

  getTaxById: async (id: string) => {
    const { data, error } = await supabase
      .from("taxes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching tax:", error);
      throw error;
    }

    return data as Tax;
  },

  createTax: async (tax: Omit<Tax, "id" | "created_at" | "updated_at">) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("taxes")
      .insert([{ ...tax, user_id: user.user.id }])
      .select()
      .single();

    if (error) {
      console.error("Error creating tax:", error);
      throw error;
    }

    return data as Tax;
  },

  updateTax: async (id: string, tax: Partial<Tax>) => {
    const { data, error } = await supabase
      .from("taxes")
      .update(tax)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating tax:", error);
      throw error;
    }

    return data as Tax;
  },

  deleteTax: async (id: string) => {
    const { error } = await supabase
      .from("taxes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting tax:", error);
      throw error;
    }
    
    return true;
  },

  // Get tax summary statistics
  getTaxSummary: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    // Fetch all taxes first
    const { data: taxes, error } = await supabase
      .from("taxes")
      .select("*")
      .eq("user_id", user.user.id);
      
    if (error) {
      console.error("Error fetching tax summary:", error);
      throw error;
    }
    
    if (!taxes) return {
      total: 0,
      paid: 0,
      pending: 0,
      overdue: 0,
      upcoming: 0
    };
    
    // Calculate summary values
    const summary = {
      total: taxes.reduce((sum, tax) => sum + (tax.amount || 0), 0),
      paid: taxes.filter(t => t.status === 'paid').reduce((sum, tax) => sum + (tax.amount || 0), 0),
      pending: taxes.filter(t => t.status === 'pending').reduce((sum, tax) => sum + (tax.amount || 0), 0),
      overdue: taxes.filter(t => t.status === 'overdue').reduce((sum, tax) => sum + (tax.amount || 0), 0),
      upcoming: taxes.filter(t => {
        const dueDate = new Date(t.due_date);
        return t.status !== 'paid' && dueDate >= now && dueDate <= thirtyDaysFromNow;
      }).reduce((sum, tax) => sum + (tax.amount || 0), 0)
    };
    
    return summary;
  }
};
