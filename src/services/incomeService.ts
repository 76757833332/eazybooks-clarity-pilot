
import { supabase } from "@/integrations/supabase/client";
import { Income, IncomeSource, IncomeStatus } from "@/types/income";

/**
 * Get all incomes for the current user
 */
export const getIncomes = async (): Promise<Income[]> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("incomes")
    .select("*")
    .eq("user_id", user.user.id)
    .order("income_date", { ascending: false });

  if (error) {
    console.error("Error fetching incomes:", error);
    throw error;
  }

  return data as Income[];
};

/**
 * Get a specific income by ID
 */
export const getIncomeById = async (id: string): Promise<Income> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("incomes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.user.id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching income by ID:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Income not found");
  }

  return data as Income;
};

/**
 * Create a new income record
 */
export const createIncome = async (income: Omit<Income, "id" | "created_at" | "updated_at">): Promise<Income> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  const newIncome = {
    ...income,
    user_id: user.user.id
  };

  const { data, error } = await supabase
    .from("incomes")
    .insert(newIncome)
    .select()
    .single();

  if (error) {
    console.error("Error creating income:", error);
    throw error;
  }

  return data as Income;
};

/**
 * Update an existing income record
 */
export const updateIncome = async (id: string, income: Partial<Income>): Promise<Income> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("incomes")
    .update(income)
    .eq("id", id)
    .eq("user_id", user.user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating income:", error);
    throw error;
  }

  return data as Income;
};

/**
 * Delete an income record
 */
export const deleteIncome = async (id: string): Promise<void> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("incomes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.user.id);

  if (error) {
    console.error("Error deleting income:", error);
    throw error;
  }
};

/**
 * Get available income sources
 */
export const getIncomeSources = async (): Promise<string[]> => {
  return [
    "sales",
    "services",
    "consulting",
    "investment",
    "other"
  ];
};

/**
 * Get available income statuses
 */
export const getIncomeStatuses = async (): Promise<string[]> => {
  return [
    "pending",
    "received",
    "cancelled"
  ];
};
