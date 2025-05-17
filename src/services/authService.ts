
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import { Profile, Business, UserRole, EmployeeRole } from '@/contexts/auth/types';

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error signing in:", error);
    throw error;
  }

  return data;
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const signUp = async (email: string, password: string, firstName: string, lastName: string, role: UserRole) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        role: role,
        full_name: `${firstName} ${lastName}`,
      },
    },
  });

  if (error) {
    console.error("Error signing up:", error);
    throw error;
  }

  return data;
};

export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  // Fetch the user profile from the profiles table
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Profile doesn't exist yet, may need to create one
      console.warn("User profile does not exist:", error);
      return null;
    }
    console.error("Error fetching user profile:", error);
    throw error;
  }

  return data as Profile;
};

export const fetchUserBusiness = async (businessId: string): Promise<Business | null> => {
  // Fetch the business data
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Business doesn't exist
      console.warn("Business does not exist:", error);
      return null;
    }
    console.error("Error fetching business data:", error);
    throw error;
  }

  return data as Business;
};

export const updateProfile = async (userId: string, updatedProfile: Partial<Profile>) => {
  const { error } = await supabase
    .from('profiles')
    .update(updatedProfile)
    .eq('id', userId);

  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const updateBusiness = async (businessId: string, updatedBusiness: Partial<Business>) => {
  const { error } = await supabase
    .from('businesses')
    .update(updatedBusiness)
    .eq('id', businessId);

  if (error) {
    console.error("Error updating business:", error);
    throw error;
  }
};

export const createBusiness = async (userId: string, businessData: Partial<Business>) => {
  const { data, error } = await supabase
    .from('businesses')
    .insert({
      ...businessData,
      owner_id: userId
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating business:", error);
    throw error;
  }

  return data;
};

export const inviteUser = async (
  inviterId: string,
  businessId: string,
  email: string,
  role: UserRole,
  employeeRole?: EmployeeRole
) => {
  // In a real implementation, this would send an invitation email
  // For now, we'll just create an invitation record
  const { error } = await supabase
    .from('invitations')
    .insert({
      inviter_id: inviterId,
      business_id: businessId,
      email: email,
      role: role,
      employee_role: employeeRole,
      status: 'pending'
    });

  if (error) {
    console.error("Error sending invitation:", error);
    throw error;
  }
};
