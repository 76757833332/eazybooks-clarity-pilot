
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type BankAccount = Database['public']['Tables']['bank_accounts']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type BankAccountInsert = Database['public']['Tables']['bank_accounts']['Insert'];

export async function fetchBankAccounts() {
  const { data, error } = await supabase
    .from('bank_accounts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bank accounts:', error);
    throw error;
  }

  return data;
}

export async function fetchAccountTransactions(bankAccountId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('bank_account_id', bankAccountId)
    .order('transaction_date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }

  return data;
}

export async function fetchAllTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, bank_accounts(account_name, bank_name, last_four)')
    .order('transaction_date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }

  return data;
}

export async function addBankAccount(account: Omit<BankAccountInsert, 'user_id'>) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('bank_accounts')
    .insert({
      ...account,
      user_id: userData.user.id
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding bank account:', error);
    throw error;
  }

  return data;
}

export async function importTransactions(transactions: Omit<TransactionInsert, 'user_id' | 'id'>[]) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("User not authenticated");
  }
  
  const transactionsWithUserId = transactions.map(transaction => ({
    ...transaction,
    user_id: userData.user!.id
  }));

  const { data, error } = await supabase
    .from('transactions')
    .insert(transactionsWithUserId)
    .select();

  if (error) {
    console.error('Error importing transactions:', error);
    throw error;
  }

  return data;
}

export async function refreshBankAccount(accountId: string) {
  // In a real app, this would connect to a bank API
  // For now, we'll just fetch the current account data
  const { data, error } = await supabase
    .from('bank_accounts')
    .select('*')
    .eq('id', accountId)
    .single();

  if (error) {
    console.error('Error refreshing account:', error);
    throw error;
  }

  return data;
}
