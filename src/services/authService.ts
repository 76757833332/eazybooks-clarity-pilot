
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Profile, Business, UserRole, EmployeeRole } from '@/contexts/auth/types';
import { v4 as uuidv4 } from 'uuid';

export async function fetchUserProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data as unknown as Profile;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return null;
  }
}

export async function fetchUserBusiness(businessId: string): Promise<Business | null> {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    if (error) {
      console.error('Error fetching business:', error);
      return null;
    }

    return data as unknown as Business;
  } catch (error) {
    console.error('Failed to fetch business:', error);
    return null;
  }
}

export async function signUp(
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string, 
  role: UserRole
): Promise<void> {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: role
        }
      }
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success("Account created! Please verify your email.");
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string): Promise<void> {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      toast.error(error.message);
      throw error;
    } else {
      toast.success("Logged in successfully!");
    }
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signInWithGoogle(): Promise<void> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    
    if (error) {
      toast.error(error.message);
      throw error;
    }
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  try {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  } catch (error) {
    console.error('Sign out error:', error);
    toast.error('An error occurred while signing out');
  }
}

export async function updateProfile(userId: string, updatedProfile: Partial<Profile>): Promise<void> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updatedProfile)
      .eq('id', userId);
    
    if (error) {
      toast.error(error.message);
      throw error;
    }
    
    toast.success('Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
}

export async function updateBusiness(businessId: string, updatedBusiness: Partial<Business>): Promise<void> {
  try {
    const { error } = await supabase
      .from('businesses')
      .update(updatedBusiness)
      .eq('id', businessId);
    
    if (error) {
      toast.error(error.message);
      throw error;
    }
    
    toast.success('Business information updated successfully');
  } catch (error) {
    console.error('Update business error:', error);
    throw error;
  }
}

export async function updateOnboardingStep(userId: string, step: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('profiles' as any)
      .update({ onboarding_step: step })
      .eq('id', userId);
    
    if (error) {
      toast.error(error.message);
      throw error;
    }
  } catch (error) {
    console.error('Update onboarding step error:', error);
    throw error;
  }
}

export async function completeOnboarding(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('profiles' as any)
      .update({ onboarding_completed: true })
      .eq('id', userId);
    
    if (error) {
      toast.error(error.message);
      throw error;
    }
    
    toast.success('Onboarding completed!');
  } catch (error) {
    console.error('Complete onboarding error:', error);
    throw error;
  }
}

export async function createBusiness(userId: string, businessData: Partial<Business>): Promise<Business | null> {
  try {
    const { data, error } = await supabase
      .from('businesses' as any)
      .insert({
        ...businessData,
        owner_id: userId
      })
      .select();
    
    if (error) {
      toast.error(error.message);
      throw error;
    }
    
    // Get the first result if available
    const newBusiness = Array.isArray(data) && data.length > 0 ? data[0] : data;
    toast.success('Business created successfully!');
    
    return newBusiness as unknown as Business;
  } catch (error) {
    console.error('Create business error:', error);
    throw error;
  }
}

export async function inviteUser(
  userId: string,
  businessId: string,
  email: string,
  role: UserRole,
  employeeRole?: EmployeeRole
): Promise<void> {
  try {
    // Generate a unique token and set expiration (48 hours from now)
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);
    
    const { error } = await supabase
      .from('invites')
      .insert({
        email,
        business_id: businessId,
        invited_by: userId,
        role,
        employee_role: employeeRole,
        token,
        expires_at: expiresAt.toISOString()
      });
    
    if (error) {
      toast.error(error.message);
      throw error;
    }
    
    toast.success(`Invitation sent to ${email}`);
  } catch (error) {
    console.error('Invite user error:', error);
    throw error;
  }
}
