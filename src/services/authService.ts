
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

  // Create profile for the new user
  if (data.user) {
    try {
      await createProfile(data.user.id, {
        id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        role: role,
        email: email,
        subscription_tier: 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (profileError) {
      console.error("Error creating profile during signup:", profileError);
      // Continue anyway, as the profile creation will be retried on login
    }
  }

  return data;
};

export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    // Fetch the user profile from the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile doesn't exist yet, may need to create one
        console.warn("User profile does not exist, will need to create one");
        return null;
      }
      console.error("Error fetching user profile:", error);
      throw error;
    }

    return data as Profile;
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    return null;
  }
};

export const createProfile = async (userId: string, profileData: Partial<Profile>) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .insert({
        ...profileData,
        id: userId
      });

    if (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in createProfile:", error);
    throw error;
  }
};

export const fetchUserBusiness = async (businessId: string): Promise<Business | null> => {
  try {
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
  } catch (error) {
    console.error("Error in fetchUserBusiness:", error);
    return null;
  }
};

export const updateProfile = async (userId: string, updatedProfile: Partial<Profile>) => {
  try {
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (checkError && checkError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      return createProfile(userId, updatedProfile);
    }
    
    // Profile exists, update it
    const { error } = await supabase
      .from('profiles')
      .update(updatedProfile)
      .eq('id', userId);

    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in updateProfile:", error);
    throw error;
  }
};

export const updateBusiness = async (businessId: string, updatedBusiness: Partial<Business>) => {
  try {
    const { error } = await supabase
      .from('businesses')
      .update(updatedBusiness)
      .eq('id', businessId);

    if (error) {
      console.error("Error updating business:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in updateBusiness:", error);
    throw error;
  }
};

export const createBusiness = async (userId: string, businessData: Partial<Business>) => {
  try {
    // Make sure the required field 'name' is present
    if (!businessData.name) {
      throw new Error("Business name is required");
    }

    const { data, error } = await supabase
      .from('businesses')
      .insert({
        ...businessData,
        owner_id: userId,
        name: businessData.name // Ensure name is explicitly passed
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating business:", error);
      throw error;
    }

    return data as Business;
  } catch (error) {
    console.error("Error in createBusiness:", error);
    throw error;
  }
};

export const inviteUser = async (
  inviterId: string,
  businessId: string,
  email: string,
  role: UserRole,
  employeeRole?: EmployeeRole
) => {
  try {
    // Insert directly into the invitations table instead of using RPC
    const { error } = await supabase
      .from('invitations')
      .insert({
        inviter_id: inviterId,
        business_id: businessId,
        email: email,
        role: role,
        employee_role: employeeRole || null,
        status: 'pending'
      });

    if (error) {
      console.error("Error sending invitation:", error);
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in inviteUser:", error);
    throw error;
  }
};
