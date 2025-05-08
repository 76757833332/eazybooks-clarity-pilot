
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/types/invoice";

// Define a type for creating a new customer without requiring user_id
export type CreateCustomerInput = Omit<Customer, "id" | "created_at" | "updated_at" | "user_id">;

export const customerService = {
  // Get all customers for the current user
  getCustomers: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", user.user.id)
      .order("name");
      
    if (error) throw error;
    return data as Customer[];
  },
  
  // Get a single customer by id
  getCustomerById: async (id: string) => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) throw error;
    return data as Customer;
  },
  
  // Create a new customer - updated to use the new type
  createCustomer: async (customer: CreateCustomerInput) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("customers")
      .insert([{ ...customer, user_id: user.user.id }])
      .select()
      .single();
      
    if (error) throw error;
    return data as Customer;
  },
  
  // Update an existing customer
  updateCustomer: async (id: string, customer: Partial<Customer>) => {
    const { data, error } = await supabase
      .from("customers")
      .update(customer)
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    return data as Customer;
  },
  
  // Delete a customer
  deleteCustomer: async (id: string) => {
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  }
};
