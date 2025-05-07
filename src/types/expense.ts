
export type ExpenseCategory = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type Expense = {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  description?: string;
  expense_date: string;
  payment_method?: string;
  receipt_url?: string;
  status: 'recorded' | 'pending' | 'reimbursed' | 'approved';
  created_at: string;
  updated_at: string;
};

export type NewExpense = Omit<Expense, 'id' | 'created_at' | 'updated_at'>;
