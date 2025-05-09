
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Profile, Business, UserRole, EmployeeRole, AuthContextType } from '@/types/auth';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setProfile(data as Profile);

      // If user has a business, fetch it
      if (data.belongs_to_business_id) {
        fetchUserBusiness(data.belongs_to_business_id);
      }

      // Check if onboarding is not completed
      if (!data.onboarding_completed) {
        // Redirect to onboarding flow
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  // Fetch user business
  const fetchUserBusiness = async (businessId: string) => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single();

      if (error) {
        console.error('Error fetching business:', error);
        return;
      }

      setBusiness(data as Business);
    } catch (error) {
      console.error('Failed to fetch business:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN' && currentSession?.user) {
          fetchUserProfile(currentSession.user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setBusiness(null);
          navigate('/login');
        } else if (event === 'USER_UPDATED') {
          setUser(currentSession?.user ?? null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: UserRole) => {
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
  };

  const signIn = async (email: string, password: string) => {
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
  };

  const signInWithGoogle = async () => {
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
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('An error occurred while signing out');
    }
  };

  const updateProfile = async (updatedProfile: Partial<Profile>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id);
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      // Update local state
      setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const updateOnboardingStep = async (step: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_step: step })
        .eq('id', user.id);
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      // Update local state
      setProfile(prev => prev ? { ...prev, onboarding_step: step } : null);
    } catch (error) {
      console.error('Update onboarding step error:', error);
      throw error;
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      // Update local state
      setProfile(prev => prev ? { ...prev, onboarding_completed: true } : null);
      toast.success('Onboarding completed!');
    } catch (error) {
      console.error('Complete onboarding error:', error);
      throw error;
    }
  };

  const createBusiness = async (businessData: Partial<Business>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('businesses')
        .insert([{ ...businessData, owner_id: user.id }])
        .select()
        .single();
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      // Update local state
      setBusiness(data as Business);
      toast.success('Business created successfully!');
      
      // After business creation, the trigger will update the profile
      await fetchUserProfile(user.id);
    } catch (error) {
      console.error('Create business error:', error);
      throw error;
    }
  };

  const inviteUser = async (email: string, role: UserRole, employeeRole?: EmployeeRole) => {
    if (!user || !business) {
      toast.error('You need to create a business first');
      return;
    }
    
    try {
      // Generate a unique token and set expiration (48 hours from now)
      const token = uuidv4();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48);
      
      const { error } = await supabase
        .from('invites')
        .insert([{
          email,
          business_id: business.id,
          invited_by: user.id,
          role,
          employee_role: employeeRole,
          token,
          expires_at: expiresAt.toISOString()
        }]);
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      // In a real app, you'd send an email with the invite link
      toast.success(`Invitation sent to ${email}`);
    } catch (error) {
      console.error('Invite user error:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    profile,
    business,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    updateProfile,
    updateOnboardingStep,
    completeOnboarding,
    createBusiness,
    inviteUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
