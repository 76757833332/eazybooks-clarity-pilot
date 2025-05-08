
export type IncomeSource = 'sales' | 'services' | 'consulting' | 'investment' | 'other';

export type IncomeStatus = 'received' | 'pending' | 'cancelled';

export type Income = {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  income_date: string;
  source: IncomeSource;
  status: IncomeStatus;
  notes?: string;
  attachment_url?: string;
  created_at: string;
  updated_at: string;
};

export type NewIncome = Omit<Income, 'id' | 'created_at' | 'updated_at'>;
