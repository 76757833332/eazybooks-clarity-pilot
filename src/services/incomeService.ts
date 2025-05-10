
import { supabase } from "@/integrations/supabase/client";
import { Income, IncomeSource, IncomeStatus } from "@/types/income";

// Since there's no "incomes" table in the database,
// we'll use a mock implementation until the table is created
export const getIncomes = async (): Promise<Income[]> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  // Mock data - in a real implementation we would query the database
  // This would be replaced once an "incomes" table is created in the database
  return [
    {
      id: "1",
      user_id: user.user.id,
      description: "Client Payment",
      amount: 1200,
      income_date: new Date().toISOString(),
      source: "services",
      status: "received",
      notes: "Payment for project completion",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "2",
      user_id: user.user.id,
      description: "Product Sales",
      amount: 850,
      income_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: "sales",
      status: "received",
      notes: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "3",
      user_id: user.user.id,
      description: "Consulting Fee",
      amount: 1500,
      income_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      source: "consulting",
      status: "pending",
      notes: "Awaiting client approval",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};

export const getIncomeById = async (id: string): Promise<Income> => {
  // Mock implementation
  const incomes = await getIncomes();
  const income = incomes.find(income => income.id === id);
  if (!income) throw new Error("Income not found");
  return income;
};

export const createIncome = async (income: Omit<Income, "id" | "created_at" | "updated_at">): Promise<Income> => {
  // Mock implementation 
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  const newIncome: Income = {
    id: Math.random().toString(36).substr(2, 9),
    ...income,
    user_id: user.user.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  return newIncome;
};

export const updateIncome = async (id: string, income: Partial<Income>): Promise<Income> => {
  // Mock implementation
  const existingIncome = await getIncomeById(id);
  return {
    ...existingIncome,
    ...income,
    updated_at: new Date().toISOString()
  };
};

export const deleteIncome = async (id: string): Promise<void> => {
  // Mock implementation
  // In a real implementation, we would delete the record from the database
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
