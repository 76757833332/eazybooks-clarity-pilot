
import { supabase } from "@/integrations/supabase/client";
import { Expense } from "@/types/expense";

export const expenseService = {
  // Get all expenses for the current user
  getExpenses: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.user.id)
      .order("expense_date", { ascending: false });
      
    if (error) throw error;
    return data as Expense[];
  },
  
  // Get a single expense by id
  getExpenseById: async (id: string) => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) throw error;
    return data as Expense;
  },
  
  // Create a new expense
  createExpense: async (expense: Omit<Expense, "id" | "created_at" | "updated_at">) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("expenses")
      .insert([{ ...expense, user_id: user.user.id }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Update an existing expense
  updateExpense: async (id: string, expense: Partial<Expense>) => {
    const { data, error } = await supabase
      .from("expenses")
      .update(expense)
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Delete an expense
  deleteExpense: async (id: string) => {
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  },
  
  // Get expense categories
  getExpenseCategories: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("expense_categories")
      .select("*")
      .eq("user_id", user.user.id);
      
    if (error) {
      // If no categories exist yet, return default ones
      return [
        { id: "office", name: "Office Supplies" },
        { id: "travel", name: "Travel" },
        { id: "meals", name: "Meals & Entertainment" },
        { id: "software", name: "Software & Services" },
        { id: "utilities", name: "Utilities" },
        { id: "rent", name: "Rent" },
        { id: "other", name: "Other" }
      ];
    }
    
    return data;
  }
};
