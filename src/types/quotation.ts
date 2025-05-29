
export type Quotation = {
  id: string;
  user_id: string;
  customer_id?: string;
  quotation_number: string;
  issue_date: string;
  valid_until: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  total_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer | null;
};

export type QuotationItem = {
  id: string;
  quotation_id: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
  created_at: string;
  updated_at: string;
};

export type NewQuotation = Omit<Quotation, 'id' | 'created_at' | 'updated_at'>;
export type NewQuotationItem = Omit<QuotationItem, 'id' | 'created_at' | 'updated_at'>;

import { Customer } from "./invoice";
