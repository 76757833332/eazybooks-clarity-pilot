
import { supabase } from "@/integrations/supabase/client";
import { Payroll, PayrollDeduction } from "@/types/payroll";
import { baseService } from "./base/baseService";

export const payrollManagementService = {
  /**
   * Get all payrolls
   */
  getPayrolls: async () => {
    const user = await baseService.getCurrentUser();
    
    const { data, error } = await supabase
      .from("payrolls")
      .select("*, employee:employee_id(*)")
      .eq("user_id", user.id)
      .order("payment_date", { ascending: false });
      
    if (error) throw error;
    return data as Payroll[];
  },
  
  /**
   * Get payroll by id
   */
  getPayrollById: async (id: string) => {
    const { data, error } = await supabase
      .from("payrolls")
      .select("*, employee:employee_id(*)")
      .eq("id", id)
      .single();
      
    if (error) throw error;
    
    // Get payroll deductions
    const { data: deductions, error: deductionsError } = await supabase
      .from("payroll_deductions")
      .select("*, deduction_type:deduction_type_id(*)")
      .eq("payroll_id", id);
      
    if (deductionsError) throw deductionsError;
    
    return {
      ...data,
      payroll_deductions: deductions
    } as Payroll & { payroll_deductions: PayrollDeduction[] };
  },
  
  /**
   * Create payroll
   */
  createPayroll: async (
    payroll: Omit<Payroll, "id" | "created_at" | "updated_at" | "employee" | "payroll_deductions">,
    deductions?: Omit<PayrollDeduction, "id" | "created_at" | "payroll_id" | "deduction_type">[]
  ) => {
    const user = await baseService.getCurrentUser();
    
    // Start a transaction
    const { data: newPayroll, error } = await supabase
      .from("payrolls")
      .insert([{ ...payroll, user_id: user.id }])
      .select()
      .single();
      
    if (error) throw error;
    
    // Add payroll deductions
    if (deductions && deductions.length > 0) {
      const formattedDeductions = deductions.map(deduction => ({
        ...deduction,
        payroll_id: newPayroll.id
      }));
      
      const { error: deductionsError } = await supabase
        .from("payroll_deductions")
        .insert(formattedDeductions);
        
      if (deductionsError) throw deductionsError;
    }
    
    return newPayroll;
  },
  
  /**
   * Update payroll
   */
  updatePayroll: async (
    id: string, 
    payroll: Partial<Payroll>,
    deductions?: Omit<PayrollDeduction, "id" | "created_at" | "payroll_id" | "deduction_type">[]
  ) => {
    // Update payroll
    const { data, error } = await supabase
      .from("payrolls")
      .update(payroll)
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    
    // Update deductions if provided
    if (deductions) {
      // Delete existing deductions
      await supabase
        .from("payroll_deductions")
        .delete()
        .eq("payroll_id", id);
        
      if (deductions.length > 0) {
        // Insert new deductions
        const formattedDeductions = deductions.map(deduction => ({
          ...deduction,
          payroll_id: id
        }));
        
        const { error: deductionsError } = await supabase
          .from("payroll_deductions")
          .insert(formattedDeductions);
          
        if (deductionsError) throw deductionsError;
      }
    }
    
    return data;
  },
  
  /**
   * Delete payroll
   */
  deletePayroll: async (id: string) => {
    // Delete payroll deductions first (foreign key constraint)
    const { error: deductionsError } = await supabase
      .from("payroll_deductions")
      .delete()
      .eq("payroll_id", id);
      
    if (deductionsError) throw deductionsError;
    
    // Then delete the payroll
    const { error } = await supabase
      .from("payrolls")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  }
};
