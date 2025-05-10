
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "@/types/employee";
import { baseService } from "./base/baseService";

export const employeeService = {
  /**
   * Get all employees for the current user
   */
  getEmployees: async () => {
    const user = await baseService.getCurrentUser();
    
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("user_id", user.id)
      .order("last_name", { ascending: true });
      
    if (error) throw error;
    return data as Employee[];
  },
  
  /**
   * Get employee by id
   */
  getEmployeeById: async (id: string) => {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) throw error;
    return data as Employee;
  },
  
  /**
   * Create employee
   */
  createEmployee: async (employee: Omit<Employee, "id" | "created_at" | "updated_at">) => {
    const user = await baseService.getCurrentUser();
    
    const { data, error } = await supabase
      .from("employees")
      .insert([{ ...employee, user_id: user.id }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Update employee
   */
  updateEmployee: async (id: string, employee: Partial<Employee>) => {
    const { data, error } = await supabase
      .from("employees")
      .update(employee)
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Delete employee
   */
  deleteEmployee: async (id: string) => {
    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  }
};
