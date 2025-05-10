
import { supabase } from "@/integrations/supabase/client";
import { DeductionType } from "@/types/payroll";
import { baseService } from "./base/baseService";

export const deductionService = {
  /**
   * Get deduction types
   */
  getDeductionTypes: async () => {
    const user = await baseService.getCurrentUser();
    
    const { data, error } = await supabase
      .from("deduction_types")
      .select("*")
      .eq("user_id", user.id);
      
    if (error) throw error;
    return data as DeductionType[];
  },
  
  /**
   * Create deduction type
   */
  createDeductionType: async (deductionType: Omit<DeductionType, "id" | "created_at" | "updated_at">) => {
    const user = await baseService.getCurrentUser();
    
    const { data, error } = await supabase
      .from("deduction_types")
      .insert([{ ...deductionType, user_id: user.id }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
};
