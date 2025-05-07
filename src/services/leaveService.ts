
import { supabase } from "@/integrations/supabase/client";
import { LeaveApplication, NewLeaveApplication } from "@/types/leave";

export const fetchLeaveApplications = async (userId: string) => {
  const { data, error } = await supabase
    .from('leave_applications')
    .select('*, employees!inner(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching leave applications:', error);
    throw error;
  }
  
  return data as (LeaveApplication & { employees: any })[];
};

export const createLeaveApplication = async (leaveApplication: NewLeaveApplication) => {
  const { data, error } = await supabase
    .from('leave_applications')
    .insert(leaveApplication)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating leave application:', error);
    throw error;
  }
  
  return data as LeaveApplication;
};

export const updateLeaveApplication = async (id: string, updates: Partial<LeaveApplication>) => {
  const { data, error } = await supabase
    .from('leave_applications')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating leave application:', error);
    throw error;
  }
  
  return data as LeaveApplication;
};

export const deleteLeaveApplication = async (id: string) => {
  const { error } = await supabase
    .from('leave_applications')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting leave application:', error);
    throw error;
  }
  
  return true;
};
