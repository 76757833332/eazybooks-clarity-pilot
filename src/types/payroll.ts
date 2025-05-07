
import { Employee } from './employee';

export type DeductionType = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_percentage: boolean;
  rate?: number;
  created_at: string;
  updated_at: string;
};

export type PayrollDeduction = {
  id: string;
  payroll_id: string;
  deduction_type_id: string;
  amount: number;
  created_at: string;
  deduction_type?: DeductionType;
};

export type Payroll = {
  id: string;
  user_id: string;
  employee_id: string;
  pay_period_start: string;
  pay_period_end: string;
  payment_date: string;
  gross_amount: number;
  net_amount: number;
  taxes: number;
  deductions: number;
  status: 'pending' | 'processed' | 'paid' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  employee?: Employee;
  payroll_deductions?: PayrollDeduction[];
};

export type NewPayroll = Omit<Payroll, 'id' | 'created_at' | 'updated_at' | 'employee' | 'payroll_deductions'>;
