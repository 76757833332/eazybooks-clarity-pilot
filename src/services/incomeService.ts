
import { supabase } from "@/integrations/supabase/client";
import { Income, NewIncome } from "@/types/income";

export const getIncomes = async (): Promise<Income[]> => {
  // This is demo data since we haven't set up the actual database table yet
  const demoIncomes: Income[] = [
    {
      id: "1",
      user_id: "123",
      description: "Client Project Payment",
      amount: 3500,
      income_date: new Date().toISOString().split('T')[0],
      source: "services",
      status: "received",
      notes: "Final payment for website redesign",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      user_id: "123",
      description: "Product Sales",
      amount: 1250,
      income_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      source: "sales",
      status: "received",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      user_id: "123",
      description: "Consulting Fee",
      amount: 1800,
      income_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      source: "consulting",
      status: "received",
      notes: "Monthly retainer for Company XYZ",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      user_id: "123",
      description: "Dividend Payment",
      amount: 625,
      income_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      source: "investment",
      status: "received",
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "5",
      user_id: "123",
      description: "Upcoming Project Payment",
      amount: 4200,
      income_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      source: "services",
      status: "pending",
      notes: "Milestone payment for ongoing project",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

  // In a real implementation, this would fetch from Supabase
  // const { data, error } = await supabase
  //   .from('incomes')
  //   .select('*')
  //   .order('income_date', { ascending: false });

  // if (error) throw error;
  // return data;

  return Promise.resolve(demoIncomes);
};

export const createIncome = async (income: NewIncome): Promise<Income> => {
  // This is a demo implementation since we haven't set up the actual database table yet
  const newIncome: Income = {
    ...income,
    id: Math.random().toString(36).substring(2, 11),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // In a real implementation, this would insert into Supabase
  // const { data, error } = await supabase
  //   .from('incomes')
  //   .insert(income)
  //   .select()
  //   .single();

  // if (error) throw error;
  // return data;

  return Promise.resolve(newIncome);
};

export const getIncomeById = async (id: string): Promise<Income | null> => {
  // In a real implementation, this would fetch from Supabase
  // const { data, error } = await supabase
  //   .from('incomes')
  //   .select('*')
  //   .eq('id', id)
  //   .single();

  // if (error) throw error;
  // return data;
  
  // For now, return the first demo income
  const demoIncomes = await getIncomes();
  return demoIncomes.find(income => income.id === id) || null;
};

export const updateIncome = async (id: string, updates: Partial<Income>): Promise<Income> => {
  // In a real implementation, this would update in Supabase
  // const { data, error } = await supabase
  //   .from('incomes')
  //   .update(updates)
  //   .eq('id', id)
  //   .select()
  //   .single();

  // if (error) throw error;
  // return data;
  
  const income = await getIncomeById(id);
  if (!income) throw new Error('Income not found');
  
  const updatedIncome: Income = {
    ...income,
    ...updates,
    updated_at: new Date().toISOString(),
  };
  
  return Promise.resolve(updatedIncome);
};

export const deleteIncome = async (id: string): Promise<void> => {
  // In a real implementation, this would delete from Supabase
  // const { error } = await supabase
  //   .from('incomes')
  //   .delete()
  //   .eq('id', id);

  // if (error) throw error;
  
  return Promise.resolve();
};
