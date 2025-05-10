
import { supabase } from "@/integrations/supabase/client";
import { Income, IncomeSource, IncomeStatus } from "@/types/income";

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

export const getIncomeById = async (id: string): Promise<Income> => {
  const { data, error } = await supabase
    .from("incomes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching income:", error);
    throw error;
  }

  return data as Income;
};

export const createIncome = async (income: Omit<Income, "id" | "created_at" | "updated_at">): Promise<Income> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("incomes")
    .insert([{ ...income, user_id: user.user.id }])
    .select()
    .single();

  if (error) {
    console.error("Error creating income:", error);
    throw error;
  }

  return data as Income;
};

export const updateIncome = async (id: string, income: Partial<Income>): Promise<Income> => {
  const { data, error } = await supabase
    .from("incomes")
    .update(income)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating income:", error);
    throw error;
  }

  return data as Income;
};

export const deleteIncome = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("incomes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting income:", error);
    throw error;
  }
};

export const getIncomeSources = async (): Promise<string[]> => {
  return [
    "sales",
    "services",
    "consulting",
    "investment",
    "other"
  ];
};

export const getIncomeStatuses = async (): Promise<string[]> => {
  return [
    "pending",
    "received",
    "cancelled"
  ];
};
