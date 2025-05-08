
export type TaxCategory = 'income' | 'sales' | 'property' | 'payroll' | 'other';

export type TaxStatus = 'pending' | 'paid' | 'overdue' | 'filed';

export type Tax = {
  id: string;
  user_id: string;
  name: string;
  category: TaxCategory;
  amount: number;
  due_date: string;
  payment_date?: string;
  status: TaxStatus;
  notes?: string;
  period_start?: string;
  period_end?: string;
  tax_authority?: string;
  tax_id_number?: string;
  created_at: string;
  updated_at: string;
};

export type NewTax = Omit<Tax, 'id' | 'created_at' | 'updated_at'>;
