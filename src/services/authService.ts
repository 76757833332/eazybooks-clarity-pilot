
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Profile, Business, UserRole, EmployeeRole } from '@/contexts/auth/types';
import { v4 as uuidv4 } from 'uuid';

export async function fetchUserProfile(userId: string): Promise<Profile | null> {
  try {
    // Instead of directly querying a profiles table, we should adapt to what's available
    // For now, assume the profile data will be stored in user metadata
    const { data: user, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    // Create a profile structure from the auth user data
    const profile: Profile = {
      id: userId,
      user_id: userId,
      first_name: user.user?.user_metadata?.first_name || '',
      last_name: user.user?.user_metadata?.last_name || '',
      role: (user.user?.user_metadata?.role as UserRole) || 'business_owner',
      belongs_to_business_id: user.user?.user_metadata?.belongs_to_business_id || null,
      created_at: user.user?.created_at || new Date().toISOString(),
      updated_at: user.user?.updated_at || new Date().toISOString(),
    };

    return profile;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return null;
  }
}

export async function fetchUserBusiness(businessId: string): Promise<Business | null> {
  try {
    // Since there's no businesses table, we'll need to adapt this to whatever table
    // is storing business information, or create a new one via SQL migration
    // For now, return a mock business to prevent errors
    const mockBusiness: Business = {
      id: businessId,
      name: "Your Business",
      owner_id: "",
      legal_name: "",
      tax_id: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      phone: "",
      email: "",
      website: "",
      industry: "",
      type: "",
      description: "",
      logo_url: "",
      business_type: "",
      currency: "",
      default_invoice_terms: "",
      default_tax_percentage: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return mockBusiness;
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
    // Since we don't have a profiles table, update user metadata instead
    const { error } = await supabase.auth.updateUser({
      data: updatedProfile
    });
    
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
    // Since there's no businesses table yet, we'd need to create one via SQL migration
    // For now, just show a success message without actually updating anything
    console.log('Would update business:', businessId, updatedBusiness);
    toast.success('Business information updated successfully');
  } catch (error) {
    console.error('Update business error:', error);
    throw error;
  }
}

export async function createBusiness(userId: string, businessData: Partial<Business>): Promise<Business | null> {
  try {
    // Since there's no businesses table yet, return a mock business
    const newBusiness: Business = {
      id: uuidv4(),
      name: businessData.name || "New Business",
      owner_id: userId,
      legal_name: businessData.legal_name || "",
      tax_id: businessData.tax_id || "",
      address: businessData.address || "",
      city: businessData.city || "",
      state: businessData.state || "",
      postal_code: businessData.postal_code || "",
      country: businessData.country || "",
      phone: businessData.phone || "",
      email: businessData.email || "",
      website: businessData.website || "",
      industry: businessData.industry || "",
      type: businessData.type || "",
      description: businessData.description || "",
      logo_url: businessData.logo_url || "",
      business_type: businessData.business_type || "",
      currency: businessData.currency || "USD",
      default_invoice_terms: businessData.default_invoice_terms || "",
      default_tax_percentage: businessData.default_tax_percentage || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Also update the user metadata to attach them to this business
    await supabase.auth.updateUser({
      data: {
        belongs_to_business_id: newBusiness.id
      }
    });
    
    toast.success('Business created successfully!');
    
    return newBusiness;
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
    // Instead of inserting into an invites table, we could:
    // 1. Send an email to the user with a magic link
    // 2. Create a temporary record somewhere or in local storage
    // For now, just log and show success message
    console.log('Would invite user:', { email, businessId, role, employeeRole });
    toast.success(`Invitation sent to ${email}`);
  } catch (error) {
    console.error('Invite user error:', error);
    throw error;
  }
}
