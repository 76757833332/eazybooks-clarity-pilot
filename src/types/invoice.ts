
export type Customer = {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
};

export type Invoice = {
  id: string;
  user_id: string;
  customer_id?: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  total_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer | null;
};

export type InvoiceItem = {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
  created_at: string;
  updated_at: string;
};

export type NewInvoice = Omit<Invoice, 'id' | 'created_at' | 'updated_at'>;
export type NewInvoiceItem = Omit<InvoiceItem, 'id' | 'created_at' | 'updated_at'>;
